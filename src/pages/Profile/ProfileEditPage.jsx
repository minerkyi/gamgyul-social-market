import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './ProfileEditPage.module.css';

function ProfileEditPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState('');
  const [accountId, setAccountId] = useState('');
  const [intro, setIntro] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isAccountIdValid, setIsAccountIdValid] = useState(true);
  const isFormValid =
    isUsernameValid && isAccountIdValid && username && accountId;

  const basicProfileImageUrl = new URL(
    '../../assets/basic-profile-img.png',
    import.meta.url
  ).href;

  // 컴포넌트 마운트 시 기존 프로필 정보 불러오기
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
        const token = localStorage.getItem('token');
        const myAccountname = localStorage.getItem('accountname');

        const response = await fetch(`${API_URL}/profile/${myAccountname}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const profile = data.profile;

        setUsername(profile.username);
        setAccountId(profile.accountname);
        setIntro(profile.intro);
        setImagePreview(profile.image || basicProfileImageUrl);
      } catch (error) {
        console.error('기존 프로필 정보를 불러오는 데 실패했습니다.', error);
        setImagePreview(basicProfileImageUrl);
      }
    };
    fetchCurrentProfile();
  }, []);

  // 이미지 미리보기 URL 생명주기 관리
  useEffect(() => {
    if (!imageFile) {
      return;
    }

    const newObjectUrl = URL.createObjectURL(imageFile);
    setImagePreview(newObjectUrl);

    return () => {
      URL.revokeObjectURL(newObjectUrl);
    };
  }, [imageFile]);

  // 유효성 검사 로직
  useEffect(() => {
    if (username === '') return;
    setIsUsernameValid(username.length >= 2 && username.length <= 10);
  }, [username]);

  useEffect(() => {
    if (accountId === '') return;
    const regex = /^[a-zA-Z0-9_.]+$/;
    setIsAccountIdValid(regex.test(accountId));
  }, [accountId]);

  // 이벤트 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    if (!isFormValid) return;

    const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
    const token = localStorage.getItem('token');
    let finalImageUrl = imagePreview;

    if (imageFile) {
      const imageUploadUrl = `${API_URL}/image/uploadfile`;
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const res = await fetch(imageUploadUrl, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.filename) {
          finalImageUrl = `https://dev.wenivops.co.kr/services/mandarin/${data.filename}`;
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        return;
      }
    }

    const requestBody = {
      user: {
        username,
        accountname: accountId,
        intro,
        image: finalImageUrl,
      },
    };

    try {
      const res = await fetch(`${API_URL}/user`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.message === '이미 사용중인 계정 ID입니다.') {
          alert('이미 사용중인 계정 ID입니다.');
          setIsAccountIdValid(false);
          return;
        }
        throw new Error('프로필 수정 실패');
      }

      const data = await res.json();
      localStorage.setItem('accountname', data.user.accountname);
      navigate('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  // JSX 렌더링
  return (
    <div className={styles.pageContainer}>
      <Header
        type="products"
        title="프로필 수정"
        disabled={!isFormValid}
        onClick={handleSave}
      />
      <main className={styles.mainContent}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div
            className={styles.imageSection}
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={imagePreview}
              alt="프로필 이미지"
              className={styles.profileImage}
              onError={(e) => {
                e.target.src = basicProfileImageUrl;
              }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="username">사용자 이름</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              type="text"
              placeholder="2~10자 이내"
            />
            {!isUsernameValid && (
              <p className={styles.errorMessage}>* 2~10자 이내여야 합니다.</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="accountId">계정 ID</label>
            <input
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              id="accountId"
              type="text"
              placeholder="영문, 숫자, 밑줄, 마침표"
            />
            {!isAccountIdValid && (
              <p className={styles.errorMessage}>
                * 영문, 숫자, 밑줄, 마침표만 사용할 수 있습니다.
              </p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="intro">소개</label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              id="intro"
              rows="1"
              placeholder="자신과 판매할 상품에 대해 소개해 주세요!"
            />
          </div>
        </form>
      </main>
    </div>
  );
}

export default ProfileEditPage;
