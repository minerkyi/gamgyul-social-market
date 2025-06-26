import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import styles from './Products.module.css';
import { useFetchApi } from '../../hooks/useFetchApi';

export default function Products() {
  
  const fileInputRef = useRef(null);
  const [seletedImg, setSeletedImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState('');
  const [link, setLink] = useState(''); 
  const [disabled, setDisabled] = useState(true);
  
  const token = localStorage.getItem('token');
  const {fetchData} = useFetchApi();

  const handleImgUpload = () => {
    fileInputRef.current.click();
  };

  const handleImgChange = (e) => {

    setImage(null);
    const file = e.target.files[0];
    if(file) {
      setSeletedImg(file);
      setImgPreview(URL.createObjectURL(file));
    } else {
      setSeletedImg(null);
      setImgPreview(null);
    }
  };

  const handleItemName = (e) => {
    const value = e.target.value;
    setItemName(value);
  };

  const handlePrice = (e) => {
    const value = e.target.value;
    let num = 0;
    if(value !== '') {
      num = Number(value.replace(/[^\d]/g, ''));
      setDisplayPrice(num.toLocaleString());
    } else {
      setDisplayPrice(value);
    }
    setPrice(num);
  };

  const handleLink = (e) => {
    const value = e.target.value;
    setLink(value);
  };

  useEffect(() => {
    const urlRegex = /^(https?):\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(?:\/[^\s]*)?$/i;
    if(itemName !== '' && price > 0 && urlRegex.test(link) && seletedImg) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [itemName, price, link, seletedImg]);

  const handleSave = async () => {
    if(seletedImg) {
      const formData = new FormData();
      formData.append('image', seletedImg);
      let filename = image;
      let [data, isError] = [null, null];

      console.log(image);
      if(!image) {
        [data, isError] = await fetchData('/image/uploadfile', {method: 'POST', body: formData});

        if(isError) {
          alert(data.message);
          return;
        }
        filename = data.info.filename;

        if(filename) {
          setImage(filename);
        }
      }

      if(filename || image) {
        [data, isError] = await fetchData('/product', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
              'product': {
                itemName,
                price: Number(price),
                link,
                itemImage: `https://dev.wenivops.co.kr/services/mandarin/${filename}`
              }
            })
        });

        if(isError) {
          alert(data.message);
          return;
        } else {
          setItemName('');
          setPrice(0);
          setDisplayPrice('');
          setLink('');
          setSeletedImg(null);
          setImgPreview(null);
        }
      }
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
      <Header title={'상품 등록'} type={'products'} onClick={handleSave} disabled={disabled} />
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
          <fieldset className={styles["form-group"]}>
            <label className={styles["form-label"]} htmlFor="itemName">상품명</label>
            <input type="text" className={styles["form-input"]} id="itemName" name="itemName" value={itemName} placeholder="2~15자 이내여야 합니다." required minLength={2} maxLength={15} onChange={handleItemName} />
          </fieldset>

          <fieldset className={styles["form-group"]}>
            <label className={`${styles["form-label"]} fw-500`}htmlFor="price">가격</label>
            <input type="text" className={styles["form-input"]} id="price" name="price" placeholder="숫자만 입력 가능합니다." required value={displayPrice} onChange={handlePrice} />
          </fieldset>

          <fieldset className={styles["form-group"]}>
            <label className={`${styles["form-label"]} fw-500`} htmlFor="link">판매 링크</label>
            <input type="url" className={styles["form-input"]} id="link" name="link" placeholder="URL을 입력해 주세요." required value={link} onChange={handleLink} />
          </fieldset>
        </form>
      </main>
    </>
  );
}
