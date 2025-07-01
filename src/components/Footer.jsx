import { useContext } from 'react';
import { Link } from 'react-router-dom';
import FooterContext from '../contexts/FooterContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { isVisibled, path } = useContext(FooterContext);

  return isVisibled ? (
    <footer>
      <nav className={styles['bottom-nav']}>
        <Link to="/home" className={styles.link}>
          <div className={styles['nav-item']}>
            <div
              className={`${styles['nav-icon']} ${styles.home} ${
                path === '/home' ? styles.active : ''
              }`}
            />
            <span className={styles['nav-label']}>홈</span>
          </div>
        </Link>
        <Link to="/chat" className={styles.link}>
          <div className={styles['nav-item']}>
            <div
              className={`${styles['nav-icon']} ${styles.message} ${
                path === '/chat' ? styles.active : ''
              }`}
            />
            <span className={styles['nav-label']}>채팅</span>
          </div>
        </Link>
        <Link to="/post" className={styles.link}>
          <div className={styles['nav-item']}>
            <div className={`${styles['nav-icon']} ${styles.edit}`} />
            <span className={styles['nav-label']}>게시물 작성</span>
          </div>
        </Link>
        <Link to="/profile" className={styles.link}>
          <div className={styles['nav-item']}>
            <div
              className={`${styles['nav-icon']} ${styles.user} ${
                path === '/profile' ? styles.active : ''
              }`}
            />
            <span className={styles['nav-label']}>프로필</span>
          </div>
        </Link>
      </nav>
    </footer>
  ) : (
    <></>
  );
}
