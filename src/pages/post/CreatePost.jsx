import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import styles from './CreatePost.module.css';
import uploadImg from '../../assets/upload-file.png';
import profileImg from '../../assets/Ellipse-1.png';
import deleteImg from '../../assets/icon/icon-delete.svg';
import { useNavigate } from 'react-router-dom';
import { useFetchApi } from '../../hooks/useFetchApi';

export default function CreatePost() {

  const [disabled, setDisabeld] = useState(true);
  const [post, setPost] = useState('');
  const fileInputRef = useRef(null);
  const [seletedImgs, setSeletedImgs] = useState([]);
  const [previewImgs, setPreviewImgs] = useState([]);
  const [imageNames, setImageNames] = useState([]);

  const [image, setImage] = useState(profileImg);
  const {fetchData} = useFetchApi();
  
  const token = localStorage.getItem('token');

  const handleUpload = async () => {
    let [data, isErr] = [];
    const names = [];

    if(seletedImgs.length > 0 && imageNames.length === 0) {
      const formData = new FormData();
      seletedImgs.forEach((file) => {
        formData.append('image', file);
      });

      [data, isErr] = await fetchData('/image/uploadfiles', {method: 'POST', body: formData});

      if(isErr) {
        alert(data.message);
        return;
      }

      data.info.forEach((item) => {
        names.push(`https://dev.wenivops.co.kr/services/mandarin/${item.filename}`);
        setImageNames(prev => [...prev, `https://dev.wenivops.co.kr/services/mandarin/${item.filename}`]);
      });
    }

    [data, isErr] = await fetchData('/post', {
      method: 'POST',
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-type" : "application/json"
      },
      body: JSON.stringify({
        "post": {
          "content": post,
          "image": names.join(',')
        }
      })
    });

    console.log(data);
    if(isErr) {
      alert(data.message);
      return;
    }

    setPost('');
    setSeletedImgs([]);
    setPreviewImgs([]);
    setImageNames([]);
    fileInputRef.current.value = '';
    setDisabeld(true);

    previewImgs.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  };

  const handlePost = (e) => {
    const value = e.target.value;

    if(value !== '') {
      setDisabeld(false);
    } else if(seletedImgs.length === 0) {
      setDisabeld(true);
    }
    setPost(e.target.value);
  }

  const handleUploadImg = () => {
    fileInputRef.current.click();
  };

  const handleImgChange = (e) => {
    let totalLength = seletedImgs.length;
    const files = e.target.files;
    totalLength += files.length;
    
    if(totalLength > 3) {
      alert('최대 3개의 이미지만 업로드할 수 있습니다.');
      fileInputRef.current.value = '';
      return;
    }
    
    if(files.length > 0) {
      handleImageSelect(files);
    }

    if(!post && totalLength === 0) {
      setDisabeld(true);
    } else {
      setDisabeld(false);
    }
  };

  const handleImageSelect = (files) => {
    const arrayFile = Array.from(files);
    const previewUrls = [];
    setImageNames([]);

    arrayFile.forEach((file, idx) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrls.push(previewUrl);
    });

    setSeletedImgs(prev => [...prev, ...arrayFile]);
    setPreviewImgs(prev => [...prev, ...previewUrls]);
  };

  const handleDeleteImg = (idx) => {
    URL.revokeObjectURL(previewImgs[idx]);
    setSeletedImgs(prev => prev.filter((_, i) => {
      return i !== idx;
    }));
    setPreviewImgs(prev => prev.filter((_, i) => {
      return i !== idx;
    }));
    setImageNames([]);
    fileInputRef.current.value = '';
  };

  useEffect(() => {
    if(!post && seletedImgs.length === 0) {
      setDisabeld(true);
    }
  }, [seletedImgs]);

  useEffect(() => {
    setImage(localStorage.getItem('profileimg'));
  }, []);

  return (
    <>
      <Header title={'게시글 작성'} type={'products'} onClick={handleUpload} disabled={disabled} />
      <div className={styles.inputArea}>
        <div className={styles.profileIcon}>
          <div className={styles.profileInner}>
            <img src={image} alt="이미지 첨부" crossOrigin='anonymous' />
          </div>
        </div>
        <textarea        
          className={styles.postInput}
          name="post-text"
          value={post}
          onChange={handlePost}
          placeholder="게시글 입력하기..."
          rows={8}
        />
      </div>
      <div
      className={`${styles.previewContainer} ${previewImgs.length > 1 ? styles.multi : styles.single}`}>
      {previewImgs.map((url, idx) => (
        <div key={idx} className={styles.previewImg}>
          <button type="button" className={styles.removeBtn} onClick={() => handleDeleteImg(idx)}>
            <img src={deleteImg} alt="이미지 삭제" />
          </button>
          <img src={url} alt="이미지 첨부" />
        </div>
      ))}
      </div>

      <button className={styles.fabButton} onClick={handleUploadImg}>
        <img src={uploadImg} alt="이미지 첨부" />
      </button>
      <input type="file" className={styles.hidden} ref={fileInputRef} onChange={handleImgChange} accept="image/jpg, image/gif, image/png, image/jpeg, image/bmp, image/tif, image/heic" multiple />
    </>
  )
}
