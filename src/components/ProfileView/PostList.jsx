import { useState } from 'react';
import styles from './PostList.module.css';

// 상단 보기버튼
import ViewToggleHeader from './ViewToggleHeader';
import PostItem from '../PostItem';

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

      {/* view 상태에 따라 앨범형 또는 목록형을 조건부로 렌더링합니다. */}
      {view === 'album' ? (
        <div className={styles.albumView}>
          {posts.map((post) => (
            <div key={post.id} className={styles.albumItem}>
              <img src={post.imageUrl} alt="게시물 썸네일" />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.listView}>
          <p>목록형 보기 UI가 여기에 표시됩니다.</p>
          {posts.map((post) => (
            <PostItem key={post.id} data={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default PostList;
