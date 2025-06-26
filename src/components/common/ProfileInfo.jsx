import { Link } from 'react-router-dom';
import styles from './ProfileInfo.module.css';

import basicProfileImage from '../../assets/Ellipse-1.png';

function ProfileInfo({
  image,
  name,
  accountname,
  intro,
  followerCount,
  followingCount,
}) {
  const handleImageError = (e) => {
    e.target.src = basicProfileImage;
  };
  return (
    <section className={styles.profileContainer}>
      <div className={styles.profileInfo}>
        {/* 2. 기존 a태그를 Link로 바꾸고, to prop으로 경로를 지정합니다. */}
        <Link
          to={`/profile/${accountname}/followers`}
          className={styles.followCount}
        >
          <strong>{followerCount}</strong>
          <span>followers</span>
        </Link>

        <div className={styles.profileImageWrapper}>
          <img
            src={image}
            alt={`${name}의 프로필`}
            onError={handleImageError}
          />
        </div>

        <Link
          to={`/profile/${accountname}/followings`}
          className={`${styles.followCount} ${styles.followings}`}
        >
          <strong>{followingCount}</strong>
          <span>followings</span>
        </Link>
      </div>

      <p className={styles.profileName}>{name}</p>
      <p className={styles.profileId}>@ {accountname}</p>
      <p className={styles.profileIntro}>{intro}</p>
    </section>
  );
}

export default ProfileInfo;
