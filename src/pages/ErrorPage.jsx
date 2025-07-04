import React from 'react';
import styles from './ErrorPage.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ErrorPage() {

  const navigate = useNavigate();
  const location = useLocation();
  const message = location?.state?.message || '오류가 발생하였습니다.';
  console.log(location);

  return (
    <div className={styles.container}>
      <div className={styles["error-icon"]} />
      <p className={styles["error-message"]}>{message}</p>
      <button className={styles["retry-button"]} onClick={() => {navigate(-1)}}>이전 페이지</button>
    </div>
  )
}
