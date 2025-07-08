import React, { useEffect, useRef, useState } from 'react';
import styles from './PostItem.module.css';

import { useLocation, useNavigate } from 'react-router-dom';
import profileImg from '../assets/Ellipse-1.png';
import iconHeartActive from '../assets/icon/icon-heart-active.png';
import iconHeart from '../assets/icon/icon-heart.png';
import iconMessageCircle from '../assets/icon/icon-message-circle.svg';
import iconMoreButtonS from '../assets/icon/s-icon-more-vertical.png';
import { useFetchApi } from '../hooks/useFetchApi';
import BottomModal from './BottomModal';
import ConfirmModal from './common/ConfirmModal';
import { useUser } from '../contexts/userContext';

export default function PostItem({
  data,
  isComments = false,
  commentsCount = 0,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchData } = useFetchApi();
  const [postData, setPostData] = useState(data);
  const authorData = postData.author;
  const [heart, setHeart] = useState(iconHeart);
  const [current, setCurrent] = useState(0);

  const [isOpenPostModal, setIsOpenPostModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const {user} = useUser();
  const accountname = user.accountname;
  const token = user.token;

  const handleDelete = async () => {
    const [data, isErr] = await fetchData(`/post/${postData.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (isErr) {
      alert(data.message);
      return;
    } else {
      if (location.pathname === `/profile/${accountname}`) {
        navigate(0);
      } else {
        navigate(`/profile/${accountname}`);
      }
    }
  };
  const handleUpdate = () => {
    navigate(`/post/update/${postData.id}`);
  };
  const children = [
    { title: '삭제', event: () => setIsOpenConfirmModal(true) },
    { title: '수정', event: handleUpdate },
  ];

  const handleHearted = async () => {
    let path = 'heart';
    let method = 'POST';

    if (postData.hearted) {
      path = 'unheart';
      method = 'DELETE';
    }
    const [data, isErr] = await fetchData(`/post/${postData.id}/${path}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (isErr) {
      alert(data.message);
      return;
    } else {
      if (data.post.hearted) {
        setHeart(iconHeartActive);
      } else {
        setHeart(iconHeart);
      }
      setPostData(data.post);
    }
  };

  const handlePostMore = (account) => {
    if (accountname === account) {
      setIsOpenPostModal(true);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}년 ${month}월 ${day}일`;
  };

  useEffect(() => {
    if (postData.hearted) {
      setHeart(iconHeartActive);
    } else {
      setHeart(iconHeart);
    }
  }, []);

  const handleComments = (id) => {
    navigate(`/post/comments/${id}`);
  };

  let images = [];
  if (postData.image) {
    images = postData.image.split(',');
  }

  let contents = [];
  if (postData.content) {
    contents = postData.content.split('\n');
  }

  const startX = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!isSwiping.current) return;

    const endX = e.changedTouches[0].clientX;
    const diffX = startX.current - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        setCurrent((prev) => (prev + 1) % images.length);
      } else {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    isSwiping.current = false;
  };

  return (
    <>
      <article
        className={`${styles.post} ${
          commentsCount > 0 || !isComments ? '' : styles['no-comments']
        }`}
      >
        <header className={styles['post-header']}>
          <div className={styles['user-info']}>
            <img
              className={styles['profile-img']}
              src={authorData.image || profileImg}
              alt={`${authorData.accountname} 프로필`}
              crossOrigin="anonymous"
            />
            <div className={styles['user-details']}>
              <strong className={styles.username}>{authorData.username}</strong>
              <span className={styles.handle}>@ {authorData.accountname}</span>
            </div>
          </div>
          {authorData.accountname === accountname && (
            <button className={styles['empty-button']}>
              <img
                className={styles['icon-small']}
                src={iconMoreButtonS}
                alt="게시글 더 보기 버튼"
                onClick={() => handlePostMore(authorData.accountname)}
              />
            </button>
          )}
        </header>

        <section className={styles['post-content']}>
          {contents.map((content, idx) => (
            <React.StrictMode key={idx}>
              {content}
              {idx < contents.length - 1 && <br />}
            </React.StrictMode>
          ))}
        </section>

        {images.length > 0 && (
          <figure className={styles.carousel}>
            <div
              className={styles['image-container']}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  className={`${styles.image} ${
                    current === idx ? styles.active : ''
                  }`}
                  src={img}
                  alt=""
                  crossOrigin="anonymous"
                />
              ))}
            </div>
            {images.length > 1 && (
              <figcaption className={styles.dots}>
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`${styles.dot} ${
                      current === idx ? styles['active-dot'] : ''
                    }`}
                    onClick={() => setCurrent(idx)}
                  />
                ))}
              </figcaption>
            )}
          </figure>
        )}
        <nav className={styles['post-actions']}>
          <button className={styles['action-button']} onClick={handleHearted}>
            <img
              className={styles['icon-small']}
              src={heart}
              alt="좋아요 개수"
            />
            <span>{postData.heartCount}</span>
          </button>
          <button
            className={styles['action-button']}
            onClick={isComments ? null : () => handleComments(postData.id)}
          >
            <img
              className={styles['icon-small']}
              src={iconMessageCircle}
              alt="댓글 개수"
            />
            <span>
              {commentsCount > 0 ? commentsCount : postData.commentCount}
            </span>
          </button>
        </nav>
        <footer className={styles['post-date']}>
          <time dateTime={postData.updatedAt}>
            {formatDate(postData.createdAt)}
          </time>
        </footer>
      </article>
      <BottomModal
        isOpen={isOpenPostModal}
        setIsOpen={setIsOpenPostModal}
        children={children}
      />
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        message="게시글을 삭제할까요?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </>
  );
}
