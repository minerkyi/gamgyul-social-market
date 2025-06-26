import styles from './YourProfileAction.module.css';

import messageIcon from '../../../assets/icon/icon-message-circle.png';
import shareIcon from '../../../assets/icon/icon-share.png';

//isFollowed : 팔로우중인지 여부 (true/false)
//oonFollowToggle : 팔로우/언팔로우 버튼 클릭시 시행될 함수
function YourProfileActions({ isFollowed, onFollowToggle }) {
  return (
    <div className={styles.actionWrapper}>
      <button type="button" className={styles.iconButton}>
        <img src={messageIcon} alt="메세지 보내기" />
      </button>

      {/* isFollowed 값에 따라 버튼 스타일 텍스트 바뀝니다. */}
      <button
        type="button"
        className={`${styles.followButton} ${
          isFollowed ? styles.followed : ''
        }`}
        onClick={onFollowToggle}
      >
        {isFollowed ? '언팔로우' : '팔로우'}
      </button>

      <button type="button" className={styles.iconButton}>
        <img src={shareIcon} alt="공유하기" />
      </button>
    </div>
  );
}

export default YourProfileActions;
