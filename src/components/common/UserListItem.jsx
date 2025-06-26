import { useState } from 'react';
import styles from './UserListItem.module.css';

import basicProfileImage from '../../assets/basic-profile-img.png';

function UserListItem({ image, name, accountname, initialIsFollowed = false }) {
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);

  const handleFollowToggle = () => {
    setIsFollowed((prev) => !prev);
    // API 호출 로직
  };

  const handleImageError = (e) => {
    e.target.src = basicProfileImage;
  };

  return (
    <li className={styles.userItem}>
      <div className={styles.userInfo}>
        <img
          src={image}
          alt={`${name}의 프로필 이미지`}
          className={styles.profileImage}
          onError={handleImageError}
        />
        <div className={styles.textInfo}>
          <p className={styles.userName}>{name}</p>
          <p className={styles.userAccount}>@ {accountname}</p>
        </div>
      </div>
      <button
        type="button"
        className={`${styles.followButton} ${
          isFollowed ? styles.followed : ''
        }`}
        onClick={handleFollowToggle}
      >
        {isFollowed ? '취소' : '팔로우'}
      </button>
    </li>
  );
}

export default UserListItem;
