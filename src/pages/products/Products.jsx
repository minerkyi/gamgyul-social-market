import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import styles from './Products.module.css';
import { useFetchApi } from '../../hooks/useFetchApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../contexts/userContext';

export default function Products() {
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [seletedImg, setSeletedImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [objectUrl, setObjectUrl] = useState(null);

  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState('');
  const [link, setLink] = useState('');

  const [disabled, setDisabled] = useState(true);
  
  const {id} = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;
  const {fetchData, result, isLoading} = useFetchApi();

  useEffect(() => {
    if(id) {
      const productData = async () => {
        const [data, isErr] = await fetchData(`/product/detail/${id}`, {
          method: "GET",
          headers: {
            "Authorization" : `Bearer ${token}`,
            "Content-type" : "application/json"
          }
        });

        if(isErr) {
          navigate('/error', {state:{message: data.message.message}, replace: true});
          return;
        }
        
        const product = data.product;
        setImgPreview(product.itemImage);
        setImage(product.itemImage.split('/').pop());
        setItemName(product.itemName);
        setPrice(product.price);
        setLink(product.link);
      }
      productData();
    }
  }, []);

  const handleImgUpload = () => {
    fileInputRef.current.click();
  };

  const handleImgChange = (e) => {

    setImage(null);
    const file = e.target.files[0];
    if(file) {
      setSeletedImg(file);
      const objUrl = URL.createObjectURL(file);
      setImgPreview(objUrl);
      setObjectUrl(objUrl);
    } else {
      setSeletedImg(null);
      if(result) {
        setImgPreview(result.product.itemImage);
      } else {
        setImgPreview(null);
      }
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
    }
    setPrice(num);
  };
  useEffect(() => {
    if(price === 0) {
      setDisplayPrice('');
    } else {
      setDisplayPrice(price.toLocaleString());
    }
  }, [price]);

  const handleLink = (e) => {
    const value = e.target.value;
    setLink(value);
  };

  useEffect(() => {
    const urlRegex = /^(https?):\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(?:\/[^\s]*)?$/i;
    if(itemName?.length > 1 && price > 0 && urlRegex.test(link) && imgPreview) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [itemName, price, link, seletedImg]);

  const handleSave = async () => {
    let filename = image;
    if(seletedImg) {
      const formData = new FormData();
      formData.append('image', seletedImg);

      if(!image) {
        const [data, isError] = await fetchData('/image/uploadfile', {method: 'POST', body: formData});

        if(isError) {
          alert(data.message);
          return;
        }
        filename = data.info.filename;

        if(filename) {
          setImage(filename);
        }
      }
    }

    if(filename || image) {
      if(id) {
        const [data, isError] = await fetchData(`/product/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
              'product': {
                itemName,
                price: price,
                link,
                itemImage: `https://dev.wenivops.co.kr/services/mandarin/${filename}`
              }
            })
        });

        if(isError) {
          navigate('/error', {state:{message: data.message.message}});
          return;
        } else {
          navigate(-1);
          return;
        }
      } else {
        const [data, isError] = await fetchData('/product', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
              'product': {
                itemName,
                price: price,
                link,
                itemImage: `https://dev.wenivops.co.kr/services/mandarin/${filename}`
              }
            })
        });
  
        if(isError) {
          navigate('/error', {state:{message: data.message.message}});
          return;
        }

        setItemName('');
        setPrice(0);
        setDisplayPrice('');
        setLink('');
        setSeletedImg(null);
        setImgPreview(null);

        navigate(`/profile`);
      }
    }
  };

  useEffect(() => {
    return () => {
      if(objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  }, [objectUrl]);

  useEffect(() => {
    if(isLoading) {
      setDisabled(true);
    }
  }, [isLoading]);


  return (
    <>
      <Header title={'상품 등록'} type={'product'} onClick={handleSave} disabled={disabled} />
      <main className={styles["content"]}>
        <section className={styles["image-section"]}>
          <h2 className={styles["section-title"]}>이미지 등록</h2>
          <figure className={styles["image-upload"]}>
            <img className={`${styles.image} ${imgPreview ? '' : styles.hidden}`} src={imgPreview} alt="업로드 이미지" crossOrigin='anonymous' />
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
            <input type="text" className={styles["form-input"]} id="price" name="price" placeholder="숫자만 입력 가능합니다." required value={displayPrice} onChange={handlePrice} inputMode="numeric" />
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
