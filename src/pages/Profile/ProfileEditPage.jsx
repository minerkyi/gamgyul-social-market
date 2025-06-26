import { useEffect, useState } from 'react';
import styles from './ProfileEditPage.module.css';

import basicProfileImage from '../../assets/basic-profile-img.png';
import Header from '../../components/Header';

function ProfileEditPage() {
  //나중에 state 로 관리될 데이터
  const [username, setUsername] = useState('애월읍 위니브 감귤농장');
  const [accountId, setAccountId] = useState('weniv_Mandarin');
  const [intro, setIntro] = useState(
    '애월읍 감귤 전국 배송, 귤따기 체험, 감귤 농장'
  );

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isAccountIdValid, setIsAccountIdValid] = useState(true);

  const isFormValid = isUsernameValid && isAccountIdValid;

  // 유저네임 유효성
  useEffect(() => {
    if (username.length >= 2 && username.length <= 10) {
      setIsUsernameValid(true);
    } else {
      setIsUsernameValid(false);
    }
  }, [username]);

  // 계정ID 유효성
  useEffect(() => {
    const regex = /^[a-zA-Z0-9_.]+$/;
    if (regex.test(accountId) && accountId.length > 0) {
      setIsAccountIdValid(true);
    } else {
      setIsAccountIdValid(false);
    }
  }, [accountId]);

  // 저장
  const handleSave = () => {
    if (!isFormValid) {
      return;
    }
    console.log('프로필 저장!', { username, accountId, intro });
  };

  return (
    <div className={styles.pageContainer}>
      <Header type="products" title="프로필 수정" onClick={handleSave} />

      <main className={styles.mainContent}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.imageSection}>
            <img
              src={basicProfileImage}
              alt="현재 프로필 이미지"
              className={styles.profileImage}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username">사용자 이름</label>
            <input
              type="text"
              id="username"
              placeholder="2~10자 이내여야 합니다."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {!isUsernameValid && (
              <p className={styles.errorMessage}>* 2~10자 이내여야 합니다.</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="accountId">계정 ID</label>
            <input
              type="text"
              id="accountId"
              placeholder="영문, 숫자, 특수문자(.),(_)만 사용 가능합니다."
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
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
              id="intro"
              placeholder="자신과 판매할 상품에 대해 소개해 주세요!"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows="1"
            />
          </div>
        </form>
      </main>
    </div>
  );
}

export default ProfileEditPage;
