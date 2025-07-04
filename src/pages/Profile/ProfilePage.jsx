import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import actionSheetStyles from '../../components/common/ActionSheet.module.css';
import modalStyles from '../../components/common/Modal.module.css';
import styles from './ProfilePage.module.css';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';

import PostList from '../../components/ProfileView/PostList';
import ProfileStore from '../../components/ProfileView/ProfileStore';
import ProfileInfo from '../../components/common/ProfileInfo';
import { useProfileRefetch } from '../../contexts/ProfileRefetchContext';
import { useFetchApi } from '../../hooks/useFetchApi';
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
  const { fetchData } = useFetchApi();
  const { refetchKey, refetch } = useProfileRefetch();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const targetAccountname = isMyProfile ? myAccountname : accountname;
      const token = localStorage.getItem('token');
      const commonHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [profileData, profileErr] = await fetchData(
        `/profile/${targetAccountname}`,
        { headers: commonHeaders }
      );
      const [productData] = await fetchData(`/product/${targetAccountname}`, {
        headers: commonHeaders,
      });
      const [postData] = await fetchData(
        `/post/${targetAccountname}/userpost`,
        { headers: commonHeaders }
      );

      if (profileErr) {
        console.error('프로필 정보 로딩 실패:', profileData.message);
        setProfile(null);
      } else {
        setProfile(profileData.profile);
      }

      setProducts(productData.product || []);
      setPosts(postData.post || []);
      setLoading(false);
    };

    fetchAllData();
  }, [
    accountname,
    myAccountname,
    isMyProfile,
    navigate,
    refetchKey,
    fetchData,
  ]);

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
    const token = localStorage.getItem('token');
    const [data, isErr] = await fetchData(`/product/${selectedProduct.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (isErr) {
      alert(data.message || '상품 삭제에 실패했습니다.');
    } else {
      alert('상품이 삭제되었습니다.');
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
    }
    setConfirmModalConfig(null);
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
    const token = localStorage.getItem('token');
    const [data, isErr] = await fetchData(`/post/${selectedPost.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (isErr) {
      alert(data.message || '게시글 삭제에 실패했습니다.');
    } else {
      alert('게시글이 삭제되었습니다.');
      setPosts(posts.filter((p) => p.id !== selectedPost.id));
    }
    setConfirmModalConfig(null);
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

    const token = localStorage.getItem('token');
    const path = `/profile/${profile.accountname}/${
      profile.isfollow ? 'unfollow' : 'follow'
    }`;
    const method = profile.isfollow ? 'DELETE' : 'POST';

    const [data, isErr] = await fetchData(path, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (isErr) {
      alert('팔로우 상태 변경에 실패했습니다.');
      return;
    }

    const updatedProfile = data.profile ? data.profile : data;
    setProfile(updatedProfile);
    refetch();
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
        <div className={actionSheetStyles.actionSheet}>
          <div className={actionSheetStyles.handle}></div>
          <ul className={actionSheetStyles.menuList}>
            <li>
              <button
                type="button"
                className={actionSheetStyles.menuButton}
                onClick={handleOpenDeleteProductConfirm}
              >
                삭제
              </button>
            </li>
            <li>
              <button type="button" className={actionSheetStyles.menuButton}>
                수정
              </button>
            </li>
            <li>
              <button type="button" className={actionSheetStyles.menuButton}>
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
        <div className={actionSheetStyles.actionSheet}>
          <div className={actionSheetStyles.handle}></div>
          <ul className={actionSheetStyles.menuList}>
            <li>
              <button type="button" className={actionSheetStyles.menuButton}>
                설정 및 개인정보
              </button>
            </li>
            <li>
              <button
                type="button"
                className={actionSheetStyles.menuButton}
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
        <div className={actionSheetStyles.actionSheet}>
          <div className={actionSheetStyles.handle}></div>
          <ul className={actionSheetStyles.menuList}>
            <li>
              <button
                type="button"
                className={actionSheetStyles.menuButton}
                onClick={handleOpenDeletePostConfirm}
              >
                삭제
              </button>
            </li>
            <li>
              <button type="button" className={actionSheetStyles.menuButton}>
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
