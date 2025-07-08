import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import basicProfileImg from '../assets/basic-profile-img.png';
import iconHeartActive from '../assets/icon/icon-heart-active.png';
import iconHeart from '../assets/icon/icon-heart.png';
import iconMessageCircle from '../assets/icon/icon-message-circle.svg';
import iconMoreButtonS from '../assets/icon/s-icon-more-vertical.png';
import { useUser } from '../contexts/userContext';
import { useFetchApi } from '../hooks/useFetchApi';
import BottomModal from './BottomModal';
import ConfirmModal from './common/ConfirmModal';
import styles from './PostItem.module.css';

export default function PostItem({
  data,
  isComments = false,
  commentsCount = 0,
}) {
  const navigate = useNavigate();
  const { fetchData } = useFetchApi();
  const { user } = useUser();

  const [postData, setPostData] = useState(data);
  const [isHearted, setIsHearted] = useState(data.hearted);
  const [isOpenPostModal, setIsOpenPostModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const myAccountname = user ? user.accountname : '';
  const token = user ? user.token : '';

  const handleDelete = async () => {
    const [response, isErr] = await fetchData(`/post/${postData.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (isErr) {
      alert(response.message);
      return;
    }
    navigate(`/profile/${myAccountname}`);
  };

  const handleUpdate = () => {
    navigate(`/post/update/${postData.id}`);
  };

  const children = [
    { title: '삭제', event: () => setIsOpenConfirmModal(true) },
    { title: '수정', event: handleUpdate },
  ];

  const handleHearted = async () => {
    const path = `/post/${postData.id}/${isHearted ? 'unheart' : 'heart'}`;
    const method = isHearted ? 'DELETE' : 'POST';

    const [response, isErr] = await fetchData(path, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (isErr) {
      alert(response.message);
      return;
    }
    setPostData(response.post);
    setIsHearted(response.post.hearted);
  };

  const handlePostMore = (authorAccountname) => {
    if (myAccountname === authorAccountname) {
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

  const handleComments = (id) => {
    navigate(`/post/comments/${id}`);
  };

  const authorData = postData.author || {};
  const images = postData.image ? postData.image.split(',') : [];
  const contents = postData.content ? postData.content.split('\n') : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <>
      <article
        className={`${styles.post} ${
          isComments || commentsCount > 0 ? '' : styles['no-comments']
        }`}
      >
        <header className={styles['post-header']}>
          <div className={styles['user-info']}>
            <img
              className={styles['profile-img']}
              src={authorData.image || basicProfileImg}
              alt="프로필 이미지"
              crossOrigin="anonymous"
              onError={(e) => (e.target.src = basicProfileImg)}
            />
            <div className={styles['user-details']}>
              <strong className={styles.username}>{authorData.username}</strong>
              <span className={styles.handle}>@ {authorData.accountname}</span>
            </div>
          </div>
          {myAccountname === authorData.accountname && (
            <button
              className={styles['empty-button']}
              onClick={() => handlePostMore(authorData.accountname)}
            >
              <img
                className={styles['icon-small']}
                src={iconMoreButtonS}
                alt="게시글 더 보기 버튼"
              />
            </button>
          )}
        </header>

        <section className={styles['post-content']}>
          {contents.map((content, idx) => (
            <React.Fragment key={idx}>
              {content}
              {idx < contents.length - 1 && <br />}
            </React.Fragment>
          ))}
        </section>

        {images.length > 0 && (
          <figure className={styles.carousel}>
            <div className={styles['image-container']}>
              <img
                className={styles.image}
                src={images[currentImageIndex]}
                alt="게시물 이미지"
                crossOrigin="anonymous"
              />
            </div>
            {images.length > 1 && (
              <figcaption className={styles.dots}>
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`${styles.dot} ${
                      currentImageIndex === idx ? styles['active-dot'] : ''
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
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
              src={isHearted ? iconHeartActive : iconHeart}
              alt="좋아요"
            />
            <span>{postData.heartCount}</span>
          </button>
          <button
            className={styles['action-button']}
            onClick={isComments ? null : () => handleComments(postData.id)}
            disabled={isComments}
          >
            <img
              className={styles['icon-small']}
              src={iconMessageCircle}
              alt="댓글"
            />
            <span>
              {commentsCount > 0 ? commentsCount : postData.commentCount}
            </span>
          </button>
        </nav>
        <footer className={styles['post-date']}>
          <time dateTime={postData.updatedAt}>
            {formatDate(postData.updatedAt)}
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
