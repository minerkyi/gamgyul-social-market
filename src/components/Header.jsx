import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import iconSearch from '../assets/icon/icon-search.png';
import iconArrow from '../assets/icon/icon-arrow-left.png';
import iconMore from '../assets/icon/icon-more-vertical.png';

export default function Header({title, type, onClick}) {
  if(type === 'products') {
    return (
      <header className={styles.header}>
        <button className={styles["back-button"]} onClick={() => {history.back();}}>
          <img src={iconArrow} alt="" />
        </button>
        <h1 className={`${styles["header-title"]} sr-only`}>{title}</h1>
        <button className={styles["save-button"]} onClick={onClick}>저장</button>
      </header>
    );
  } else if(type === 'profile') {
    return (
      <header className={styles.header}>
        <button className={styles["back-button"]} onClick={() => {history.back();}}>   
          <img src={iconArrow} alt="뒤로가기" />
        </button>
        <h1 className={`styles["header-title"] sr-only`}>{title}</h1>
        <button className={styles["empty-button"]} onClick={onClick}>
          <img src={iconMore} alt="더 보기" />
        </button>
      </header>
    );
  }else {
    return (
      <header className={styles.header}>
        <h1 className={styles["header-title"]}>{title}</h1>
        <button className={styles["empty-button"]}>
          <img className={styles["search-icon"]} src={iconSearch} alt="검색" />
        </button>
      </header>
    );
  }
}
