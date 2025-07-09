import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useUser } from '../../contexts/userContext';
import { useFetchApi } from '../../hooks/useFetchApi';
import styles from './ProfileEditPage.module.css';

function ProfileEditPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, saveUser } = useUser();
  const { fetchData } = useFetchApi();

  const [username, setUsername] = useState('');
  const [accountId, setAccountId] = useState('');
  const [intro, setIntro] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isAccountIdValid, setIsAccountIdValid] = useState(true);
  const [accountIdMessage, setAccountIdMessage] = useState('');

  const isFormValid =
    isUsernameValid &&
    isAccountIdValid &&
    username &&
    accountId &&
    (user.username !== username ||
      user.accountname !== accountId ||
      user.intro !== intro ||
      imageFile !== null);

  const basicProfileImageUrl = new URL(
    '../../assets/basic-profile-img.png',
    import.meta.url
  ).href;

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAccountId(user.accountname);
      setIntro(user.intro);
      setPreview(user.image);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (username && (username.length < 2 || username.length > 10)) {
      setIsUsernameValid(false);
    } else {
      setIsUsernameValid(true);
    }
  }, [username]);

  const checkAccountId = useCallback(
    async (id) => {
      const regex = /^[a-zA-Z0-9_.]+$/;
      if (!regex.test(id)) {
        setAccountIdMessage('영문, 숫자, 밑줄, 마침표만 사용 가능합니다.');
        setIsAccountIdValid(false);
        return;
      }

      if (user && user.accountname === id) {
        setAccountIdMessage('');
        setIsAccountIdValid(true);
        return;
      }

      const [data, isErr] = await fetchData('/user/accountnamevalid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { accountname: id } }),
      });

      if (isErr || data.message !== '사용 가능한 계정ID 입니다.') {
        setAccountIdMessage(data.message);
        setIsAccountIdValid(false);
      } else {
        setAccountIdMessage('');
        setIsAccountIdValid(true);
      }
    },
    [fetchData, user]
  );

  useEffect(() => {
    if (!accountId) return;
    const debounce = setTimeout(() => {
      checkAccountId(accountId);
    }, 500);
    return () => clearTimeout(debounce);
  }, [accountId, checkAccountId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  const handleSave = async () => {
    if (!isFormValid) return;

    let finalImageUrl = user.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      const [data, isErr] = await fetchData('/image/uploadfile', {
        method: 'POST',
        body: formData,
      });

      if (isErr) {
        alert('이미지 업로드에 실패했습니다.');
        return;
      }
      finalImageUrl = `https://dev.wenivops.co.kr/services/mandarin/${data.info.filename}`;
    }

    const [updatedUserData, isUpdateErr] = await fetchData('/user', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username,
          accountname: accountId,
          intro,
          image: finalImageUrl,
        },
      }),
    });

    if (isUpdateErr) {
      alert(updatedUserData.message || '프로필 수정에 실패했습니다.');
      return;
    }

    // 로그인 정보 localStorage 업데이트
    user.username = updatedUserData.user.username;
    user.accountname = updatedUserData.user.accountname;
    user.intro = updatedUserData.user.intro;
    user.image = updatedUserData.user.image;
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/profile');
  };

  return (
    <div className={styles.pageContainer}>
      <Header
        type="product"
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
              src={preview || basicProfileImageUrl}
              alt="프로필 이미지"
              className={styles.profileImage}
              crossOrigin="anonymous"
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
              placeholder="2~10자 이내여야 합니다."
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
              placeholder="영문, 숫자, 밑줄, 마침표만 사용 가능합니다."
            />
            {!isAccountIdValid && (
              <p className={styles.errorMessage}>* {accountIdMessage}</p>
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
