import { Link } from 'react-router-dom';
import styles from './UserListItem.module.css';

const basicProfileImageUrl = new URL(
  '../../assets/basic-profile-img.png',
  import.meta.url
).href;

function UserListItem({ user, keyword }) {
  const { image, username, accountname } = user;

  const highlightText = (text, highlight) => {
    if (!highlight || !text.includes(highlight)) {
      return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={index} className={styles.highlight}>
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <Link to={`/profile/${accountname}`} className={styles.userLink}>
      <li className={styles.userItem}>
        <img
          src={image || basicProfileImageUrl}
          alt={`${username} 프로필`}
          className={styles.profileImage}
          onError={(e) => {
            e.target.src = basicProfileImageUrl;
          }}
          crossOrigin="anonymous"
        />
        <div className={styles.userInfo}>
          <span className={styles.userName}>
            {highlightText(username, keyword)}
          </span>
          <span className={styles.accountName}>
            @ {highlightText(accountname, keyword)}
          </span>
        </div>
      </li>
    </Link>
  );
}

export default UserListItem;
