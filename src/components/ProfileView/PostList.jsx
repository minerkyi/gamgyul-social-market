import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PostList.module.css';

import PostItem from '../PostItem';
import ViewToggleHeader from './ViewToggleHeader';

function PostList({ posts }) {
  const [view, setView] = useState('list');
  if (!posts || posts.length === 0) {
    return (
      <section>
        <ViewToggleHeader view={view} setView={setView} />
        <p className={styles.noPostMessage}>게시물이 없습니다.</p>
      </section>
    );
  }

  return (
    <section className={styles.postSection}>
      <ViewToggleHeader view={view} setView={setView} />

      {view === 'album' ? (
        <div className={styles.albumView}>
          {posts
            .filter((post) => post.image)
            .map((post) => (
              <Link
                to={`/post/comments/${post.id}`}
                key={post.id}
                className={styles.albumItem}
              >
                <img
                  src={post.image.split(',')[0]}
                  alt="게시물 썸네일"
                  crossOrigin="anonymous"
                />
              </Link>
            ))}
        </div>
      ) : (
        <div className={styles.listView}>
          {posts.map((post) => (
            <article key={post.id} className={styles.listItem}>
              <PostItem data={post} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default PostList;
