import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../contexts/userContext';
import { useFetchApi } from '../../hooks/useFetchApi';
import styles from './Post.module.css';

import basicProfileImg from '../../assets/basic-profile-img.png';
import iconMoreButton from '../../assets/icon/icon-more-vertical.png';
import BottomModal from '../../components/BottomModal';
import Header from '../../components/Header';
import PostItem from '../../components/PostItem';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function Post() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const { fetchData } = useFetchApi();

  const [postData, setPostData] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [inputComment, setInputComment] = useState('');
  const [commentId, setCommentId] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);
  const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const token = user ? user.token : '';
  const myAccountname = user ? user.accountname : '';
  const myProfileImage = user ? user.image : basicProfileImg;

  const getComments = async () => {
    const [data, isErr] = await fetchData(`/post/${id}/comments/?limit=100`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (isErr) {
      console.error(data.message);
      setCommentsData([]);
      return;
    }
    setCommentsData(data.comments);
  };

  useEffect(() => {
    if (!token) return;

    const fetchPostAndComments = async () => {
      const [data, isErr] = await fetchData(`/post/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      });

      if (isErr) {
        alert(data.message);
        navigate(-1);
        return;
      }
      setPostData(data.post);
      getComments();
    };

    fetchPostAndComments();
  }, [id, token]);

  const getRelativeTime = (timestamp) => {
    const diff = new Date() - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  const handleReport = async (commentIdToReport) => {
    const [data, isErr] = await fetchData(
      `/post/${id}/comments/${commentIdToReport}/report`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      }
    );

    if (isErr) {
      alert(data.message);
    } else {
      alert('신고가 접수되었습니다.');
      setIsOpenCommentModal(false);
    }
  };

  const handleDelete = async () => {
    if (!commentId) return;
    const [data, isErr] = await fetchData(`/post/${id}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (isErr) {
      alert(data.message);
    } else {
      getComments();
      setIsOpenConfirmModal(false);
      setIsOpenCommentModal(false);
    }
  };

  const handleCommentMore = (authorAccountname, idOfComment) => {
    setCommentId(idOfComment);
    if (authorAccountname === myAccountname) {
      setModalInfo({ title: '삭제', event: () => setIsOpenConfirmModal(true) });
    } else {
      setModalInfo({
        title: '신고하기',
        event: () => handleReport(idOfComment),
      });
    }
    setIsOpenCommentModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputComment.trim()) return;

    const [data, isErr] = await fetchData(`/post/${id}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        comment: { content: inputComment },
      }),
    });

    if (isErr) {
      alert(data.message);
      return;
    }
    setInputComment('');
    getComments();
  };

  return (
    <>
      <Header title="게시글" type="profile" />
      <main className={styles.container}>
        <h2 className="sr-only">게시물 댓글 작성</h2>
        {postData && (
          <PostItem
            data={postData}
            commentsCount={commentsData.length}
            isComments={true}
          />
        )}
        {commentsData.length > 0 && (
          <section className={styles.comments}>
            {commentsData.map((comment) => (
              <article key={comment.id} className={styles.comment}>
                <img
                  className={styles['comment-profile-image']}
                  src={comment.author.image || basicProfileImg}
                  alt={comment.author.accountname}
                  crossOrigin="anonymous"
                  onError={(e) => (e.target.src = basicProfileImg)}
                />
                <div className={styles['comment-content']}>
                  <div className={styles['comment-header']}>
                    <span className={styles['comment-username']}>
                      {comment.author.username}
                    </span>
                    <span className={styles['comment-time']}>
                      · {getRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <div className={styles['comment-text']}>
                    {comment.content}
                  </div>
                </div>
                <button
                  className={styles['empty-button']}
                  onClick={() =>
                    handleCommentMore(comment.author.accountname, comment.id)
                  }
                >
                  <img
                    className={styles['comment-image-more']}
                    src={iconMoreButton}
                    alt="댓글 더 보기 버튼"
                  />
                </button>
              </article>
            ))}
          </section>
        )}
        <form className={styles['input-section']} onSubmit={handleSubmit}>
          <figure>
            <img
              className={styles['input-avatar']}
              src={myProfileImage}
              alt="내 프로필"
              crossOrigin="anonymous"
            />
          </figure>
          <label htmlFor="inputComment" className="sr-only">
            댓글 작성
          </label>
          <input
            className={styles.input}
            id="inputComment"
            name="inputComment"
            placeholder="댓글 달아보기..."
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
          />
          <button
            className={`${styles['send-button']} ${
              inputComment ? styles.active : ''
            }`}
            type="submit"
            disabled={!inputComment.trim()}
          >
            게시
          </button>
        </form>
      </main>
      <BottomModal
        isOpen={isOpenCommentModal}
        setIsOpen={setIsOpenCommentModal}
        children={children}
      />
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        message="댓글을 삭제할까요?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </>
  );
}
