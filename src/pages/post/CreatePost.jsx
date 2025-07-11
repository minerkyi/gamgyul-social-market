import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import styles from './CreatePost.module.css';
import uploadImg from '../../assets/upload-file.png';
import profileImg from '../../assets/Ellipse-1.png';
import deleteImg from '../../assets/icon/icon-delete.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchApi } from '../../hooks/useFetchApi';

export default function CreatePost() {

  const navigate = useNavigate();
  const [disabled, setDisabeld] = useState(true);
  const [post, setPost] = useState('');
  const fileInputRef = useRef(null);
  const [seletedImgs, setSeletedImgs] = useState([]);
  const [previewImgs, setPreviewImgs] = useState([]);
  const [imageNames, setImageNames] = useState([]);

  const [image, setImage] = useState(profileImg);
  const {fetchData, isLoading} = useFetchApi();

  const {id} = useParams();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;

  const handleUpload = async () => {
    let [data, isErr] = [];
    const names = [];

    if(seletedImgs.length > 0 && imageNames.length === 0) {
      const formData = new FormData();
      seletedImgs.forEach((file) => {
        if(typeof file === 'string') {
          names.push(file);
        } else {
          formData.append('image', file);
        }
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

    let path = '/post';
    let method = 'POST';
    if(id) {
      path = `/post/${id}`;
      method = 'PUT';
    }
    [data, isErr] = await fetchData(path, {
      method: method,
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

    if(isErr) {
      navigate('/error', {state:{message: data.message.message}});
      return;
    }

    if(id) {
      navigate(-1);
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
    
    navigate(`/profile/${user.accountname}`);
  };

  const handlePost = (e) => {
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
    } else {
      setDisabeld(false);
    }
  }, [seletedImgs, post]);

  useEffect(() => {
    const profileImg = user.image;
    if(profileImg) {
      setImage(profileImg);
    }

    if(id) {
      console.log('update');
      const postData = async () => {
        const [data, isErr] = await fetchData(`/post/${id}`, {
          method: "GET",
          headers: {
            "Authorization" : `Bearer ${token}`,
            "Content-type" : "application/json"
          }
        });

        if(isErr) {
          navigate('/error', {state:{message: data.message.message}, replace: true});
          return;
        } else {
          const updateData = data.post;
          setPost(updateData.content);
          if(updateData.image) {
            setPreviewImgs(updateData.image.split(','));
            setSeletedImgs(updateData.image.split(','));
          }
        }
      };
      postData();
    }
  }, []);

  useEffect(() => {
    if(isLoading) {
      setDisabeld(true);
    }
  }, [isLoading]);

  return (
    <>
      <Header title={id ? '게시글 수정' : '게시글 작성'} type="post" onClick={handleUpload} disabled={disabled} />
      <h2 className="sr-only">{id ? '게시글 수정' : '게시글 작성'}</h2>
      <section className={styles["input-area"]}>
        <aside className={styles["profile-icon"]}>
          <div className={styles["profile-inner"]}>
            <img src={image} alt={`${user.accountname} 프로필`} crossOrigin='anonymous' onError={(e) => {
              e.target.onerror = null;
              e.target.src = profileImg;
            }} />
          </div>
        </aside>
        <label className="sr-only" htmlFor="postText">게시글 입력하기</label>
        <textarea className={styles["post-input"]} id="postText" name="postText" value={post} onChange={handlePost} placeholder="게시글 입력하기..." rows={8} />
      </section>

      <section className={`${styles["preview-container"]} ${previewImgs.length > 1 ? styles.multi : styles.single}`}>
      {previewImgs.map((url, idx) => (
        <div key={idx} className={styles["preview-img"]}>
          <button type="button" className={styles["remove-btn"]} onClick={() => handleDeleteImg(idx)}>
            <img src={deleteImg} alt="이미지 삭제" />
          </button>
          <img src={url} alt="이미지 첨부" crossOrigin="anonymous" />
        </div>
      ))}
      </section>

      <footer>
        <button className={styles["fab-button"]} onClick={handleUploadImg}>
          <img src={uploadImg} alt="이미지 선택 버튼" />
        </button>
        <input type="file" className={styles.hidden} ref={fileInputRef} onChange={handleImgChange} accept="image/jpg, image/gif, image/png, image/jpeg, image/bmp, image/tif, image/heic" multiple />
      </footer>
    </>
  )
}
