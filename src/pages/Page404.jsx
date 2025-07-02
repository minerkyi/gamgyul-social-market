import React from 'react';
import styles from './Page404.module.css';
import { useNavigate } from 'react-router-dom';

export default function Page404() {

  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles["red-dot"]}></div>
      <div className={styles["error-icon"]} />
      <p className={styles["error-message"]}>페이지를 찾을 수 없습니다. :(</p>
      <button className={styles["retry-button"]} onClick={() => {navigate(-1)}}>이전 페이지</button>
    </div>
  )
}
