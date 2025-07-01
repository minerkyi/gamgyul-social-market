import React, { useEffect, useRef, useState } from 'react';
import styles from './Post.module.css';
import Header from '../../components/Header';

import profileImg from '../../assets/Ellipse-1.png';
import iconMoreButton from '../../assets/icon/icon-more-vertical.png';
import BottomModal from '../../components/BottomModal';
import PostItem from '../../components/PostItem';
import { useLocation, useParams } from 'react-router-dom';
import { useFetchApi } from '../../hooks/useFetchApi';

export default function Post() {

  const [inputComment, setInputComment] = useState('');
  const [commentsCount, setCommentsCount] = useState();
  const [image, setImage] = useState(profileImg);
  const [modalTitle, setModalTitle] = useState('신고하기');
  const [modalEvnet, setModalEvent] = useState(null);
  const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);

  const [postData, setPostData] = useState(null);
  const [commentsData, setCommentsData] = useState([]);

  const {id} = useParams();
  const token = localStorage.getItem('token');
  const accountname = localStorage.getItem('accountname');
  const {fetchData} = useFetchApi();
  
  const getComments = async () => {
    const [data, isErr] = await fetchData(`/post/${id}/comments/?limit=50`, {
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-type" : "application/json"
      }
    });

    if(isErr) {
      alert(data.message);
      return;
    } else {
      setCommentsData(data.comments);
      setCommentsCount(data.comments.length);
    }
  };

  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    let diff = now - date;
    if(diff < 0) {
      diff = 0;
    }

    const rtf = new Intl.RelativeTimeFormat('ko', {numeric: 'auto'});

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if(seconds < 60) return rtf.format(-seconds, 'second');
    if(minutes < 60) return rtf.format(-minutes, 'minute');
    if(hours < 24) return rtf.format(-hours, 'hour');
    return rtf.format(-days, 'day');
  };

  const handleReport = () => {
    console.log('report');
  };  
  const handleDelete = () => {
    console.log('delete');
  };
  
  const children = [{title:modalTitle, event:modalEvnet}];
  const hadleCommentMore = (account) => {
    console.log(account);
    if(account !== accountname) {
      setModalEvent(() => handleDelete);
      setModalTitle('삭제');
    } else {
      setModalEvent(() => handleReport);
      setModalTitle('신고하기');
    }
    setIsOpenCommentModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(inputComment) {
      const [data, isErr] = await fetchData(`/post/${id}/comments`, {
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${token}`,
          "Content-type" : "application/json"
        },
        body: JSON.stringify({
          "comment": {"content":inputComment}
        })
      });
  
      if(isErr) {
        alert(data.message);
        return;
      } else {
        setInputComment('');
        getComments();
      }
    }
  };

  const handleInputComment = (e) => {
    setInputComment(e.target.value);
  };

  useEffect(() => {
    const postData = async () => {
      const [data, isErr] = await fetchData(`/post/${id}`, {
        method: "GET",
        headers: {
          "Authorization" : `Bearer ${token}`,
          "Content-type" : "application/json"
        }
      });
      console.log(data);
      if(isErr) {
        alert(data.message);
        return;
      } else {
        setPostData(data);
      }
    };
    postData();
    getComments();

    const profileImage = localStorage.getItem('profileimage');
    if(profileImage) {
      setImage(profileImage);
    }
  }, []);

  return (
    <>
      <Header title="게시글" type="profile" />
      <main className={styles.container}>
        <h2 className="sr-only">게시물 댓글 작성</h2>
        {postData ? <PostItem data={postData} commentsCount={commentsCount} /> : ''}
        {commentsData.length > 0 ? (
          <section className={styles.comments}>
          {commentsData.map((comment, idx) => (
            <article key={comment.id} className={styles.comment}>
              <img className={styles["comment-profile-image"]} src={comment.author.image} alt={comment.author.accountname} crossOrigin="anonymous" />
              <div className={styles["comment-content"]}>
                <div className={styles["comment-header"]}>
                  <span className={styles["comment-username"]}>{comment.author.username}</span>
                  <span className={styles["comment-time"]}>· {getRelativeTime(comment.createdAt)}</span>
                </div>
                <div className={styles["comment-text"]}>
                  {comment.content}
                </div>
              </div>
              <button className={styles["empty-button"]}>
                <img className={styles["comment-image-more"]} src={iconMoreButton} alt="댓글 더 보기 버튼" onClick={() => hadleCommentMore(comment.author.accountname)} />
              </button>
            </article>
          ))}
          </section>
        ) : ''}
        <form className={styles["input-section"]} onSubmit={(e) => handleSubmit(e)}>
          <figure>
            <img className={styles["input-avatar"]} src={image} alt="" crossOrigin="anonymous" />
          </figure>
          <label htmlFor="inputComment" className="sr-only">댓글 작성</label>
          <input className={styles.input} id="inputComment" name="inputComment" placeholder="댓글 달아보기..." value={inputComment} onChange={handleInputComment} />
          <button className={`${styles["send-button"]} ${inputComment? styles.active : ''}`} type="submit">게시</button>
        </form>
      </main>
      <BottomModal isOpen={isOpenCommentModal} setIsOpen={setIsOpenCommentModal} children={children} />
    </>
  );
}
