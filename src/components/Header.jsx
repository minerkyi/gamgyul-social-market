import { useNavigate } from 'react-router-dom';

import styles from './Header.module.css';

import iconArrow from '../assets/icon/icon-arrow-left.png';
import iconMore from '../assets/icon/icon-more-vertical.png';
import iconSearch from '../assets/icon/icon-search.png';

export default function Header(props) {
  const {
    title,
    type,
    onClick,
    disabled = false,
    isTitleVisible = false,
    value,
    onChange,
  } = props;
  const navigate = useNavigate();

  // 카멜케이스-> 코드 컨벤션스타일로 수정
  if (type === 'search-input') {
    return (
      <header className={styles.searchHeader}>
        <button className={styles['back-button']} onClick={() => navigate(-1)}>
          <img src={iconArrow} alt="뒤로가기" />
        </button>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="계정 검색"
          value={value}
          onChange={onChange}
        />
      </header>
    );
  }

  if (type === 'products') {
    return (
      <header className={styles.header}>
        <button className={styles['back-button']} onClick={() => navigate(-1)}>
          <img src={iconArrow} alt="뒤로가기" />
        </button>
        <h1 className={`${styles['header-title']} sr-only`}>{title}</h1>
        <button
          className={styles['save-button']}
          onClick={onClick}
          disabled={disabled}
        >
          저장
        </button>
      </header>
    );
  } else if (type === 'profile') {
    return (
      <header className={styles.header}>
        <button className={styles['back-button']} onClick={() => navigate(-1)}>
          <img src={iconArrow} alt="뒤로가기" />
        </button>
        <h1 className={`${styles['header-title']} sr-only`}>{title}</h1>
        <button className={styles['empty-button']} onClick={onClick}>
          <img src={iconMore} alt="더 보기" />
        </button>
      </header>
    );
  } else if (type === 'title-with-back') {
    return (
      <header className={styles.header}>
        <button className={styles['back-button']} onClick={() => navigate(-1)}>
          <img src={iconArrow} alt="뒤로가기" />
        </button>
        <h1 className={styles['header-title']}>{title}</h1>
      </header>
    );
  } else if (type === 'back-only') {
    return (
      <header className={styles.header}>
        <button className={styles['back-button']} onClick={() => navigate(-1)}>
          <img src={iconArrow} alt="뒤로가기" />
        </button>
      </header>
    );
  } else {
    return (
      <header className={styles.header}>
        <h1 className={styles['header-title']}>{title}</h1>
        <button className={styles['empty-button']}>
          <img className={styles['search-icon']} src={iconSearch} alt="검색" />
        </button>
      </header>
    );
  }
}
