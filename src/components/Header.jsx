import { useNavigate } from 'react-router-dom';

import styles from './Header.module.css';

import iconArrow from '../assets/icon/icon-arrow-left.png';
import iconMore from '../assets/icon/icon-more-vertical.png';
import iconSearch from '../assets/icon/icon-search.png';

import BottomModal from './BottomModal';
import ConfirmModal from './common/ConfirmModal';
import { useState } from 'react';
import { useUser } from '../contexts/userContext';

export default function Header(props) {
  const {
    title,
    type,
    onClick,
    disabled = false,
    isTitleVisible = false,
    value,
    onChange,
  } = props;
  const navigate = useNavigate();

  const {clearUser} = useUser();
  const [isOpenPostModal, setIsOpenPostModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const children = [
    {title:'설정 및 개인정보', event:() => navigate('/profile/edit')},
    {title:'로그아웃', event:() => setIsOpenConfirmModal(true)}
  ];

  const handleLogout = () => {
    clearUser();
    navigate('/login');
  };

  const DefaultH1 = () => {
    return (
      <h1 className={`${styles['header-title']} ${isTitleVisible ? '' : 'sr-only'}`}>{title}</h1>
    );
  };

  const HomeH1 = () => {
    return (
      <h1 className={`${styles['header-title']} ${styles.home}`}>{title}</h1>
    );
  };

  const RoomH1 = () => {
    return (
      <h1 className={`${styles['header-title']} ${styles.room}`}>{title}</h1>
    );
  }
  
  const SearchImg = () => {
    return (
      <img className={styles['search-icon']} src={iconSearch} alt="검색" />
    );
  };
  
  const BackImg = () => {
    return (
      <img src={iconArrow} alt="뒤로가기" />
    );
  };

  const MoreImg = () => {
    return (
      <img src={iconMore} alt="더 보기" />
    );
  }

  const BackButton = () => {
    return (
      <button className={styles['back-button']} onClick={() => navigate(-1)}>
        <BackImg />
      </button>
    );
  };

  const DefaultButton = () => {
    return (
      <button className={styles['empty-button']} onClick={onClick}>
        <SearchImg />
      </button>
    );
  };

  const NavigateButton = ({path}) => {
    return (
      <button className={styles['empty-button']} onClick={() => navigate(path)}>
        <SearchImg />
      </button>
    );
  };

  const TitleButton = ({titleBtn}) => {
    return (
      <button className={styles['save-button']} onClick={onClick} disabled={disabled}>
        {titleBtn}
      </button>
    );
  };

  const MoreButton = () => {
    return (
      <>
        <button className={styles['empty-button']} onClick={() => setIsOpenPostModal(true)}>
          <MoreImg />
        </button>
        <BottomModal isOpen={isOpenPostModal} setIsOpen={setIsOpenPostModal} children={children} />
        <ConfirmModal isOpen={isOpenConfirmModal} onClose={() => setIsOpenConfirmModal(false)} message="로그아웃하시겠어요?" confirmText="로그아웃" onConfirm={handleLogout} />
      </>
    );
  }

  // 카멜케이스-> 코드 컨벤션스타일로 수정
  if (type === 'search-input') {
    return (
      <header className={styles.searchHeader}>
        <BackButton />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="계정 검색"
          value={value}
          onChange={onChange}
        />
      </header>
    );
  }

  if (type === 'product') {
    return (
      <header className={styles.header}>
        <BackButton />
        <DefaultH1 />
        <TitleButton titleBtn="저장" />
      </header>
    );
  } else if (type === 'profile') {
    return (
      <header className={styles.container}>
        <div className={styles.header}>
          <BackButton />
          <DefaultH1 />
          <MoreButton />
        </div>
      </header>
    );
  } else if (type === 'room') {
    return (
      <header className={styles.container}>
        <div className={styles.header}>
          <BackButton />
          <RoomH1 />
          <MoreButton />
        </div>
      </header>
    );
  } else if (type === 'title-with-back') {
    return (
      <header className={styles.container}>
        <div className={styles.header}>
          <BackButton />
          <DefaultH1 />
        </div>
      </header>
    );
  } else if (type === 'back-only') {
    return (
      <header className={styles.header}>
        <BackButton />
        <DefaultH1 />
      </header>
    );
  } else if(type === 'home') {
    return (
      <header className={styles.container}>
        <div className={styles.header}>
          <HomeH1 />
          <NavigateButton path="/search" />
        </div>
      </header>
    );
  } else if (type === 'post') {
    return (
      <header className={styles.header}>
        <BackButton />
        <DefaultH1 />
        <TitleButton titleBtn="업로드" />
      </header>
    );
  } else {
    return (
      <header className={styles.header}>
        <DefaultH1 />
        <DefaultButton />
      </header>
    );
  }
}