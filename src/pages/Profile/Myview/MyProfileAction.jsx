import styles from './MyProfileAction.module.css';

import { Link } from 'react-router-dom';

function MyProfileAction() {
  return (
    <div className={styles.buttonContainer}>
      <Link to="/profile/edit" className={styles.profileButton}>
        프로필 수정
      </Link>
      <Link to="/product/upload" className={styles.profileButton}>
        상품 등록
      </Link>
    </div>
  );
}

export default MyProfileAction;
