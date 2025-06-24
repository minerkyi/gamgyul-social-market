import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import styles from './Products.module.css';
import { useFetchApi } from '../../hooks/useFetchApi';

export default function Products() {

  const handleSave = () => {
    if(seletedImg) {
      const formData = new FormData();
      formData.append('image', seletedImg);
      // const [data, loading, error] = useFetchApi('/image/uploadfiles', 'POST', null, formData);
      const [data] = useFetchApi('/image/uploadfiles', 'POST', null, formData);
      console.log(data);
    }
  };

  const fileInputRef = useRef(null);
  const [seletedImg, setSeletedImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  const handleImgUpload = () => {
    fileInputRef.current.click();
  };

  const handleImgChange = (e) => {
    console.log('change');
    const file = e.target.files[0];
    if(file) {
      setSeletedImg(file);
      setImgPreview(URL.createObjectURL(file));
    } else {
      setSeletedImg(null);
      setImgPreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if(imgPreview) {
        URL.revokeObjectURL(imgPreview);
      }
    }
  }, [imgPreview]);

  return (
    <>
      <Header title={'상품 등록'} type={'products'} onClick={handleSave} />
      <main className={styles["content"]}>
        <section className={styles["image-section"]}>
          <h2 className={styles["section-title"]}>이미지 등록</h2>
          <figure className={styles["image-upload"]}>
            <img className={`${styles.image} ${imgPreview ? '' : styles.hidden}`} src={imgPreview} alt="업로드 이미지" />
            <button className={styles["camera-icon"]} aria-label="이미지 업로드" onClick={handleImgUpload} />
          </figure>
          <input type="file" className={styles.hidden} ref={fileInputRef} onChange={handleImgChange} accept="image/jpg, image/gif, image/png, image/jpeg, image/bmp, image/tif, image/heic" />
        </section>

        <form>
          <fieldset className={styles["form-group"]} htmlFor="name">
            <label className={styles["form-label"]} htmlFor="name">상품명</label>
            <input type="text" className={styles["form-input"]} id="name" name="name" placeholder="2~15자 이내여야 합니다." required minLength={2} maxLength={15} />
          </fieldset>

          <fieldset className={styles["form-group"]}>
            <label className={`${styles["form-label"]} fw-500`} htmlFor="price">가격</label>
            <input type="number" className={styles["form-input"]} id="price" name="price" placeholder="숫자만 입력 가능합니다." required min={0} />
          </fieldset>

          <fieldset className={styles["form-group"]}>
            <label className={`${styles["form-label"]} fw-500`} htmlFor="link">판매 링크</label>
            <input type="url" className={styles["form-input"]} id="link" name="link" placeholder="URL을 입력해 주세요." required />
          </fieldset>
        </form>
      </main>
    </>
  );
}
