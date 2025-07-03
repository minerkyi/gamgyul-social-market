import { Link, useNavigate } from 'react-router-dom';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import styles from './HomePage.module.css';

import homeSymbol from '../../assets/symbol-logo-gray.png';

function HomePage() {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className={styles.pageContainer}>
      <Header title="감귤마켓 피드" onClick={handleSearchClick} />
      <main className={styles.mainContent}>
        <div className={styles.noFeedContainer}>
          <img src={homeSymbol} alt="홈 심볼" className={styles.symbol} />
          <p className={styles.message}>유저를 검색해 팔로우 해보세요!</p>
          <Link to="/search" className={styles.searchButton}>
            검색하기
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
