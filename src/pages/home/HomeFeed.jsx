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
  const token = localStorage.getItem('token');

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

      console.log(data);
      setPosts(data.posts);
    };
    postData(data);
  }, []);

  return (
    <>
      <Header title="감귤마켓 피드" type="home" />
      <main className={styles.main}>
        <h2 className="sr-only">홈 피드</h2>
        {posts.length > 0 ? posts.map((post) => (
            <PostItem key={post.id} data={post} />
          )) : (
            <div className={styles.container}>
              <div className={styles["red-dot"]}></div>
              <div className={styles["error-icon"]} />
              <p className={styles["error-message"]}>유저를 검색해 팔로우 해보세요!</p>
              <button className={styles["retry-button"]} onClick={() => {navigate('/profile/test2')}}>검색하기</button>
          </div>
        )}
      </main>
    </>
  )
}