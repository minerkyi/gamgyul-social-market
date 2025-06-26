import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import styles from './ProfileEditPage.module.css';

function ProfileEditPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [username, setUsername] = useState('');
  const [accountId, setAccountId] = useState('');
  const [intro, setIntro] = useState('');

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isAccountIdValid, setIsAccountIdValid] = useState(true);
  const isFormValid =
    isUsernameValid && isAccountIdValid && username && accountId;

  const basicProfileImageUrl = new URL(
    '../../assets/basic-profile-img.png',
    import.meta.url
  ).href;

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
        const token = localStorage.getItem('token');
        const myAccountname = localStorage.getItem('accountname');

        if (!token || !myAccountname) {
          console.error('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
          alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
          navigate('/');
          return;
        }

        const response = await fetch(`${API_URL}/profile/${myAccountname}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('프로필 정보를 불러오는 데 실패했습니다.');
        }

        const data = await response.json();
        const profileData = data.profile;

        if (!profileData) {
          throw new Error('서버로부터 받은 프로필 데이터가 올바르지 않습니다.');
        }

        setProfile(profileData);
        setUsername(profileData.username);
        setAccountId(profileData.accountname);
        setIntro(profileData.intro);
      } catch (error) {
        console.error(error);
        alert('프로필 정보를 가져오는 중 문제가 발생했습니다.');
        navigate('/profile');
      }
    };
    fetchCurrentProfile();
  }, [navigate]);

  useEffect(() => {
    if (username === '') return;
    setIsUsernameValid(username.length >= 2 && username.length <= 10);
  }, [username]);

  useEffect(() => {
    if (accountId === '') return;
    const regex = /^[a-zA-Z0-9_.]+$/;
    setIsAccountIdValid(regex.test(accountId));
  }, [accountId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      setPreview(null);
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  const handleSave = async () => {
    if (!isFormValid) return;

    const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
    const token = localStorage.getItem('token');

    let finalImageUrl = profile ? profile.image : '';

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
      user: { username, accountname: accountId, intro, image: finalImageUrl },
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

  const finalImageSrc =
    preview || (profile && profile.image) || basicProfileImageUrl;

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
              src={finalImageSrc}
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
