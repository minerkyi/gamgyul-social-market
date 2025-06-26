import { Link } from 'react-router-dom';
import styles from './ProfileInfo.module.css';

function ProfileInfo({
  image,
  name,
  accountname,
  intro,
  followerCount,
  followingCount,
}) {
  const basicProfileImageUrl = new URL(
    '../../assets/basic-profile-img.png',
    import.meta.url
  ).href;

  const isHttpUrl = image && image.startsWith('http');

  const handleImageError = (e) => {
    e.target.src = basicProfileImageUrl;
  };

  return (
    <section className={styles.profileContainer}>
      <div className={styles.profileInfo}>
        <Link
          to={`/profile/${accountname}/followers`}
          className={styles.followCount}
        >
          <strong>{followerCount}</strong>
          <span>followers</span>
        </Link>

        <div className={styles.profileImageWrapper}>
          <img
            src={isHttpUrl ? image : basicProfileImageUrl}
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
