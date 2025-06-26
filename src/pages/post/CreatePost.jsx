import { useState } from 'react';
import Header from '../../components/Header';
import styles from './CreatePost.module.css';
import imgUpload from '../../assets/upload-file.png';

export default function CreatePost() {

  const [disabled, setDisabeld] = useState(true);
  const handleUpload = () => {

  };

  return (
    <>
      <div className={styles.container}>
        <Header title={'게시글 작성'} type={'products'} onClick={handleUpload} disabled={disabled} />
        <div className={styles.inputArea}>
          <div className={styles.profileIcon}>
            <div className={styles.profileInner}></div>
          </div>
          <textarea
            className={styles.postInput}
            placeholder="게시글 입력하기..."
          />
        </div>

        <button className={styles.fabButton}>
          <img
            src={imgUpload}
            alt="이미지 첨부"
          />
        </button>
      </div>
    </>
  )
}
