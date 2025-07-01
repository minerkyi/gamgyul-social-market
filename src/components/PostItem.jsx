import React, { useEffect, useRef, useState } from 'react';
import styles from './PostItem.module.css';

import profileImg from '../assets/Ellipse-1.png';
import iconMoreButtonS from '../assets/icon/s-icon-more-vertical.png';
import iconHeart from '../assets/icon/icon-heart.png';
import iconHeartActive from '../assets/icon/icon-heart-active.png';
import iconMessageCircle from '../assets/icon/icon-message-circle.svg';
import { useFetchApi } from '../hooks/useFetchApi';
import { useLocation } from 'react-router-dom';
import BottomModal from './BottomModal';

export default function PostItem({data, commentsCount = 0}) {

  const {fetchData} = useFetchApi();
  const [postData, setPostData] = useState(data.post);
  const authorData = postData.author;
  const [image, setImage] = useState(profileImg);
  const [heart, setHeart] = useState(iconHeart);
  const [current, setCurrent] = useState(0);

  const [isOpenPostModal, setIsOpenPostModal] = useState(false);
  
  const token = localStorage.getItem('token');
  
  const handleDelete = () => {
    console.log('delete', postData.id)
  };
  const handleUpdate = () => {
    console.log('Update', postData.id)
  };
  const children = [
    {title:'삭제', event:handleDelete},
    {title:'수정', event:handleUpdate}
  ];

  const handleHearted = async () => {
    let path = 'heart';
    let method = 'POST';

    if(postData.hearted) {
      path = 'unheart';
      method = 'DELETE';
    }
    const [data, isErr] = await fetchData(`/post/${postData.id}/${path}`, {
      method: method,
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-type" : "application/json"
      }
    });

    if(isErr) {
      alert(data.message);
      return;
    } else {
      console.log(data);
      if(data.post.hearted) {
        setHeart(iconHeartActive);
      } else {
        setHeart(iconHeart);
      }
      setPostData(data.post);
    }
  };

  const handlePostMorBtn = () => {};
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);

    return `${year}년 ${month}월 ${day}일`;
  };

  useEffect(() => {
    const profileImage = localStorage.getItem('profileimage');
    if(profileImage) {
      setImage(profileImage);
    }

    if(postData.hearted) {
      setHeart(iconHeartActive);
    } else {
      setHeart(iconHeart);
    }
  }, []);

  const images = postData.image.split(',');

  return (
    <>
      <article className={`${styles.post} ${commentsCount > 0 || postData.commentCount > 0 ? '' : styles["no-comments"]}`}>
        <header className={styles["post-header"]}>
          <div className={styles["user-info"]}>
            <img className={styles["profile-img"]} src={image} alt="이미지 첨부" crossOrigin='anonymous' />
            <div className={styles["user-details"]}>
              <strong className={styles.username}>{authorData.username}</strong>
              <span className={styles.handle}>@ {authorData.accountname}</span>
            </div>
          </div>
          <button className={styles["empty-button"]}>
            <img className={styles["icon-small"]} src={iconMoreButtonS} alt="게시글 더 보기 버튼" onClick={() => setIsOpenPostModal(true)} />
          </button>
        </header>
        
        <section className={styles["post-content"]}>
          {postData.content}
        </section>

      {images.length > 0 && (
        <figure className={styles.carousel}>
          <div className={styles["image-container"]}>
          {images.map((img, idx) => (
            <img key={idx} className={`${styles.image} ${current === idx ? styles.active : ''}`} src={img} alt="" crossOrigin="anonymous" />
          ))}
          </div>
          <figcaption className={styles.dots}>
          {images.map((_, idx) => (
            <span key={idx} className={`${styles.dot} ${current === idx ? styles.activeDot : ''}`} onClick={() => setCurrent(idx)} />
          ))}
          </figcaption>
        </figure>
      )}
        <nav className={styles["post-actions"]}>
          <button className={styles["action-button"]} onClick={handleHearted}>
            <img className={styles["icon-small"]} src={heart} alt="좋아요 개수" />
            <span>{postData.heartCount}</span>
          </button>
          <button className={styles["action-button"]}>
            <img className={styles["icon-small"]} src={iconMessageCircle} alt="댓글 개수" />
            <span>{commentsCount > 0 ? commentsCount : postData.commentCount}</span>
          </button>
        </nav>
        <footer className={styles["post-date"]}>
          <time dateTime={postData.updatedAt}>
            {formatDate(postData.updatedAt)}
          </time>
        </footer>
      </article>
      <BottomModal isOpen={isOpenPostModal} setIsOpen={setIsOpenPostModal} children={children} />
    </>
  );
}
