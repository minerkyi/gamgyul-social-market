import styles from './ChatListItem.module.css';

import { Link } from 'react-router-dom';

const basicProfileImageUrl = new URL(
  '../../assets/basic-profile-img.png',
  import.meta.url
).href;

function ChatListItem({ chat }) {
  const { id, profileImage, userName, lastMessage, timestamp, unreadCount } =
    chat;

  const chatRoomPath = `/chat/${id}`;

  return (
    <Link to={chatRoomPath} className={styles.chatLink}>
      <li className={styles.chatItem}>
        <div className={styles.profileImageContainer}>
          <img
            src={profileImage || basicProfileImageUrl}
            alt={`${userName} 프로필`}
            className={styles.profileImage}
            onError={(e) => {
              e.target.src = basicProfileImageUrl;
            }}
          />
          {unreadCount > 0 && <div className={styles.unreadDot}></div>}
        </div>
        <div className={styles.chatDetails}>
          <span className={styles.userName}>{userName}</span>
          <p className={styles.lastMessage}>{lastMessage}</p>
        </div>
        <span className={styles.timestamp}>{timestamp}</span>
      </li>
    </Link>
  );
}

export default ChatListItem;
