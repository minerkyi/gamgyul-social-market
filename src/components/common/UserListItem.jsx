import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfileRefetch } from '../../contexts/ProfileRefetchContext';
import { useFetchApi } from '../../hooks/useFetchApi';
import styles from './UserListItem.module.css';

import basicProfileImage from '../../assets/basic-profile-img.png';

function UserListItem({ user }) {
  const { image, username, accountname, isfollow } = user;
  const [isFollowed, setIsFollowed] = useState(isfollow);
  const { fetchData } = useFetchApi();
  const myAccountname = JSON.parse(localStorage.getItem('user')).accountname;
  const { refetch } = useProfileRefetch();

  const handleFollowToggle = async () => {
    const token = localStorage.getItem('token');
    const path = `/profile/${accountname}/${
      isFollowed ? 'unfollow' : 'follow'
    }`;
    const method = isFollowed ? 'DELETE' : 'POST';

    const [data, isErr] = await fetchData(path, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (isErr) {
      alert('요청을 처리할 수 없습니다.');
      return;
    }

    setIsFollowed((prevIsFollowed) => !prevIsFollowed);
    refetch();
  };

  const handleImageError = (e) => {
    e.target.src = basicProfileImage;
  };

  const isMyProfile = accountname === myAccountname;

  return (
    <li className={styles.userItem}>
      <Link to={`/profile/${accountname}`} className={styles.userInfo}>
        <img
          src={image || basicProfileImage}
          alt={`${username}의 프로필 이미지`}
          className={styles.profileImage}
          onError={handleImageError}
          crossOrigin="anonymous"
        />
        <div className={styles.textInfo}>
          <p className={styles.userName}>{username}</p>
          <p className={styles.userAccount}>@ {accountname}</p>
        </div>
      </Link>
      {!isMyProfile && (
        <button
          type="button"
          className={`${styles.followButton} ${
            isFollowed ? styles.cancel : styles.follow
          }`}
          onClick={handleFollowToggle}
        >
          {isFollowed ? '취소' : '팔로우'}
        </button>
      )}
    </li>
  );
}

export default UserListItem;
