import styles from './ViewToggleHeader.module.css';

//이미지 경로
import albumIconOff from '../../assets/icon/icon-post-album-off.png';
import albumIconOn from '../../assets/icon/icon-post-album-on.png';
import listIconOff from '../../assets/icon/icon-post-list-off.png';
import listIconOn from '../../assets/icon/icon-post-list-on.png';

function ViewToggleHeader({ view, setView }) {
  return (
    <header className={styles.viewHeader}>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setView('list')}
      >
        <img
          src={view === 'list' ? listIconOn : listIconOff}
          alt="리스트로 보기"
        />
      </button>

      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setView('album')}
      >
        <img
          src={view === 'album' ? albumIconOn : albumIconOff}
          alt="앨범형으로 보기"
        />
      </button>
    </header>
  );
}

export default ViewToggleHeader;
