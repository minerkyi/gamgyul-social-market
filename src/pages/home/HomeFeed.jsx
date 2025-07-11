import React, { useEffect, useState } from 'react';
import styles from './HomeFeed.module.css';
import { data, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useFetchApi } from '../../hooks/useFetchApi';
import PostItem from '../../components/PostItem';

export default function HomeFeed() {

  const navigate = useNavigate();
  const {fetchData} = useFetchApi();

  const [posts, setPosts] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const token = JSON.parse(localStorage.getItem('user')).token;

  useEffect(() => {
    const postData = async () => {
      const [data, isErr] = await fetchData('/post/feed', {
        method: 'GET',
        headers: {
          "Authorization" : `Bearer ${token}`,
          "Content-type" : "application/json"
        }
      });

      if(isErr) {
        alert(data.message);
        return;
      }

      setPosts(data.posts);
      setIsComplete(true);
    };
    postData(data);
  }, []);

  return (
    <>
      <Header title="동해마켓 피드" type="home" isTitleVisible={true} />
      <main className={styles.main}>
        <h2 className="sr-only">홈 피드</h2>
        {isComplete ? posts.length > 0 ? posts.map((post) => (
            <PostItem key={post.id} data={post} />
          )) : (
            <div className={styles.container}>
              <div className={styles["feed-icon"]} />
              <p className={styles["feed-message"]}>유저를 검색해 팔로우 해보세요!</p>
              <button className={styles["retry-button"]} onClick={() => {navigate('/search')}}>검색하기</button>
          </div>
        ) : ''}
      </main>
    </>
  )
}