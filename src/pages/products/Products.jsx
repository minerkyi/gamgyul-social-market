import React from 'react'
import Header from '../../components/Header'
import styles from './Products.module.css';

export default function Products() {
  return (
    <>
      <Header title={'상품 등록'} type={'products'} />
      <div className={styles["content"]}>
        <div className={styles["image-section"]}>
            <div className={styles["section-title"]}>이미지 등록</div>
            <div className={styles["image-upload"]}>
                <div className={styles["camera-icon"]}></div>
            </div>
        </div>

        <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>상품명</label>
            <input type="text" className={styles["form-input"]} placeholder="ex ) 5월 이벤트용 상품명" />
        </div>

        <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>가격</label>
            <input type="text" className={styles["form-input"]} placeholder="숫자만 입력 가능합니다" />
        </div>

        <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>한줄 설명</label>
            <input type="text" className={styles["form-input"]} placeholder="간단한 상품설명 한줄" />
        </div>
      </div>
    </>
  );
}
