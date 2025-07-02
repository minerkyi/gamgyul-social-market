import { useEffect, useState } from 'react';
import styles from './SearchPage.module.css';

import { dummyUsers } from '../../data/dummyUsers';

import Header from '../../components/Header';
import UserListItem from '../../components/Search/UserListItem';

function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (keyword) {
      const filteredUsers = dummyUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(keyword.toLowerCase()) ||
          user.accountname.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  }, [keyword]);

  return (
    <div className={styles.pageContainer}>
      <Header
        type="search-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <main className={styles.mainContent}>
        <ul className={styles.userList}>
          {searchResults.map((user) => (
            <UserListItem
              key={user.accountname}
              user={user}
              keyword={keyword}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default SearchPage;
