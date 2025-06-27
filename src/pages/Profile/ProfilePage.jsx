import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import modalStyles from '../../components/common/Modal.module.css';
import styles from './ProfilePage.module.css';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ConfirmModal from '../../components/common/ConfirmModal';
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
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [confirmModalConfig, setConfirmModalConfig] = useState(null);

  const { accountname } = useParams();
  const navigate = useNavigate();
  const myAccountname = localStorage.getItem('accountname');
  const isMyProfile = !accountname || accountname === myAccountname;

  useEffect(() => {
    const fetchAllData = async () => {
      const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
      const token = localStorage.getItem('token');
      const targetAccountname = isMyProfile ? myAccountname : accountname;

      if (!targetAccountname) {
        console.error('계정 정보가 없어 데이터를 조회할 수 없습니다.');
        alert('계정 정보가 없습니다.');
        navigate('/');
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

        if (!profileRes.ok) {
          throw new Error(`프로필 API 요청 실패: ${profileRes.status}`);
        }

        const profileData = await profileRes.json();
        const productData = await productRes.json();
        const postData = await postRes.json();

        setProfile(profileData.profile);
        setProducts(productData.product || []);
        setPosts(postData.post || []);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [accountname, myAccountname, isMyProfile, navigate]);

  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const handleOpenPostModal = (post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountname');
    navigate('/login');
  };

  const handleOpenLogoutConfirm = () => {
    setIsSettingsModalOpen(false);
    setConfirmModalConfig({
      message: '로그아웃하시겠어요?',
      confirmText: '로그아웃',
      onConfirm: handleConfirmLogout,
    });
  };

  const handleConfirmDeleteProduct = async () => {
    if (!selectedProduct) return;
    const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
    const token = localStorage.getItem('token');
    const requestUrl = `${API_URL}/product/${selectedProduct.id}`;
    try {
      const response = await fetch(requestUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert('상품이 삭제되었습니다.');
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        setConfirmModalConfig(null);
      } else {
        throw new Error(data.message || '상품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 삭제 처리 중 오류:', error);
      alert(error.message);
      setConfirmModalConfig(null);
    }
  };

  const handleOpenDeleteProductConfirm = () => {
    setIsProductModalOpen(false);
    setConfirmModalConfig({
      message: '상품을 삭제할까요?',
      confirmText: '삭제',
      onConfirm: handleConfirmDeleteProduct,
    });
  };

  const handleConfirmDeletePost = async () => {
    if (!selectedPost) return;

    const API_URL = 'https://dev.wenivops.co.kr/services/mandarin';
    const token = localStorage.getItem('token');
    const requestUrl = `${API_URL}/post/${selectedPost.id}`;

    try {
      const response = await fetch(requestUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        setPosts(posts.filter((p) => p.id !== selectedPost.id));
        setConfirmModalConfig(null);
      } else {
        throw new Error(data.message || '게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 처리 중 오류:', error);
      alert(error.message);
      setConfirmModalConfig(null);
    }
  };

  const handleOpenDeletePostConfirm = () => {
    setIsPostModalOpen(false);
    setConfirmModalConfig({
      message: '게시글을 삭제할까요?',
      confirmText: '삭제',
      onConfirm: handleConfirmDeletePost,
    });
  };

  const handleFollowToggle = async () => {
    if (!profile) return;
  };

  if (loading) return null;
  if (!profile) return <div>프로필 정보를 불러올 수 없습니다.</div>;

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
        <PostList posts={posts} onMoreClick={handleOpenPostModal} />
      </main>

      <Footer />

      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        className={modalStyles.productModal}
      >
        <div className={styles.actionSheet}>
          <div className={styles.handle}></div>
          <ul className={styles.menuList}>
            <li>
              <button
                type="button"
                className={styles.menuButton}
                onClick={handleOpenDeleteProductConfirm}
              >
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

      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        className={modalStyles.settingsModal}
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
              <button
                type="button"
                className={styles.menuButton}
                onClick={handleOpenLogoutConfirm}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </Modal>

      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        className={modalStyles.settingsModal}
      >
        <div className={styles.actionSheet}>
          <div className={styles.handle}></div>
          <ul className={styles.menuList}>
            <li>
              <button
                type="button"
                className={styles.menuButton}
                onClick={handleOpenDeletePostConfirm}
              >
                삭제
              </button>
            </li>
            <li>
              <button type="button" className={styles.menuButton}>
                수정
              </button>
            </li>
          </ul>
        </div>
      </Modal>

      {confirmModalConfig && (
        <ConfirmModal
          isOpen={!!confirmModalConfig}
          onClose={() => setConfirmModalConfig(null)}
          message={confirmModalConfig.message}
          confirmText={confirmModalConfig.confirmText}
          onConfirm={confirmModalConfig.onConfirm}
        />
      )}
    </div>
  );
}

export default ProfilePage;
