import { useState } from 'react';
import Header from '../../components/Header';
import styles from './CreatePost.module.css';

export default function CreatePost() {

  const [disabled, setDisabeld] = useState(true);
  const handleUpload = () => {

  };

  return (
    <>
      <Header title={'게시글 작성'} type={'products'} onClick={handleUpload} disabled={disabled} />
      <div className={styles.content}>
        <div className={styles.inputArea}>
          <div className={styles.profileIcon}>
            <div className={styles.profileInner}></div>
          </div>
          <textarea
            className={styles.postInput}
            placeholder="개시글 입력하기..."
            rows={4} />
        </div>
      </div>
    </>
  )
}
