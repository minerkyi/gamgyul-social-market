import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './FollowListPage.module.css';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import UserListItem from '../../components/common/UserListItem';
import { useFetchApi } from '../../hooks/useFetchApi';

function FollowListPage() {
  const [userList, setUserList] = useState([]);
  const { accountname } = useParams();
  const location = useLocation();
  const { fetchData } = useFetchApi();

  const isFollowersPage = location.pathname.includes('followers');
  const pageTitle = isFollowersPage ? 'Followers' : 'Followings';

  useEffect(() => {
    const fetchFollowData = async () => {
      const token = localStorage.getItem('token');
      const path = `/profile/${accountname}/${
        isFollowersPage ? 'follower' : 'following'
      }`;

      const [data, isErr] = await fetchData(path, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(data)) {
        setUserList(data);
      } else {
        console.error('팔로워/팔로잉 목록을 불러오는 중 오류:', data?.message);
        setUserList([]);
      }
    };

    fetchFollowData();
  }, [accountname, isFollowersPage, fetchData]);

  return (
    <div className={styles.pageContainer}>
      <Header type="title-with-back" title={pageTitle} isTitleVisible={true} />

      <main className={styles.mainContent}>
        <ul className={styles.userList}>
          {userList.map((user) => (
            <UserListItem key={user._id} user={user} />
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
}

export default FollowListPage;
