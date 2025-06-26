import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProfilePage.module.css';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Modal from '../../components/common/Modal';

import PostList from '../../components/ProfileView/PostList';
import ProfileStore from '../../components/ProfileView/ProfileStore';
import ProfileInfo from '../../components/common/ProfileInfo';
import MyProfileAction from './Myview/MyProfileAction';
import YourProfileAction from './Yourview/YourProfileAction';

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { accountname } = useParams();
  const myAccountname = localStorage.getItem('accountname');
  const isMyProfile = !accountname || accountname === myAccountname;

  // --- API 데이터 요청 로직 ---
  useEffect(() => {
    const fetchAllData = async () => {
      const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
      const token = localStorage.getItem('token');
      const targetAccountname = isMyProfile ? myAccountname : accountname;

      if (!targetAccountname) {
        console.error('계정 정보가 없어 데이터를 조회할 수 없습니다.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [profileRes, productRes, postRes] = await Promise.all([
          fetch(`${API_URL}/profile/${targetAccountname}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/product/${targetAccountname}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/post/${targetAccountname}/userpost`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const profileData = await profileRes.json();
        const productData = await productRes.json();
        const postData = await postRes.json();

        setProfile(profileData.profile);
        setProducts(productData.product);
        setPosts(postData.post);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [accountname, myAccountname]);

  // --- 이벤트 핸들러 함수 ---
  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const handleFollowToggle = async () => {
    if (!profile) return;

    const targetAccountname = profile.accountname;
    const isFollowing = profile.isfollow;

    const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
    const token = localStorage.getItem('token');

    const requestUrl = `${API_URL}/profile/${targetAccountname}/${
      isFollowing ? 'unfollow' : 'follow'
    }`;
    const method = isFollowing ? 'DELETE' : 'POST';

    try {
      const response = await fetch(requestUrl, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('팔로우/언팔로우 API 요청 실패');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!profile) return <div>프로필 정보를 불러올 수 없습니다.</div>;

  // --- 최종 렌더링 ---
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWrapper}>
        <Header type="profile" onClick={handleOpenSettingsModal} />
      </div>

      <main className={styles.content}>
        <ProfileInfo
          image={profile.image}
          name={profile.username}
          accountname={profile.accountname}
          intro={profile.intro}
          followerCount={profile.followerCount}
          followingCount={profile.followingCount}
        />

        {isMyProfile ? (
          <MyProfileAction />
        ) : (
          <YourProfileAction
            isFollowed={profile.isfollow}
            onFollowToggle={handleFollowToggle}
          />
        )}

        <ProfileStore
          products={products}
          onProductClick={handleOpenProductModal}
        />

        <PostList posts={posts} />
      </main>

      <Footer />

      {/* 상품 메뉴 모달 */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      >
        <div className={styles.actionSheet}>
          <div className={styles.handle}></div>
          <ul className={styles.menuList}>
            <li>
              <button type="button" className={styles.menuButton}>
                삭제
              </button>
            </li>
            <li>
              <button type="button" className={styles.menuButton}>
                수정
              </button>
            </li>
            <li>
              <button type="button" className={styles.menuButton}>
                웹사이트에서 상품 보기
              </button>
            </li>
          </ul>
        </div>
      </Modal>

      {/* 설정 및 로그아웃 모달 */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      >
        <div className={styles.actionSheet}>
          <div className={styles.handle}></div>
          <ul className={styles.menuList}>
            <li>
              <button type="button" className={styles.menuButton}>
                설정 및 개인정보
              </button>
            </li>
            <li>
              <button type="button" className={styles.menuButton}>
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
}

export default ProfilePage;
