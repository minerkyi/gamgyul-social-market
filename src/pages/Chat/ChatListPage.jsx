import actionSheetStyles from '../../components/common/ActionSheet.module.css';
import modalStyles from '../../components/common/Modal.module.css';
import styles from './ChatListPage.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChatListItem from '../../components/Chat/ChatListItem';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const dummyChatList = [
  {
    id: 'chat1',
    userName: '애월읍 위니브 감귤농장',
    lastMessage: '이번에 정정 언제하맨마씸?',
    timestamp: '2020.10.25',
    profileImage: '',
    unreadCount: 1,
  },
  {
    id: 'chat2',
    userName: '제주감귤마을',
    lastMessage: '깊은 어둠의 존재감, 롤스로이스 뉴 블랙 배지...',
    timestamp: '2020.10.25',
    profileImage: '',
    unreadCount: 1,
  },
  {
    id: 'chat3',
    userName: '누구네 농장 친환경 한라봉',
    lastMessage: '내 차는 내가 평가한다. 오픈 이벤트에 참여 하...',
    timestamp: '2020.10.25',
    profileImage: '',
    unreadCount: 0,
  },
];

function ChatListPage() {
  const navigate = useNavigate();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState(null);

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
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

  return (
    <div className={styles.pageContainer}>
      <Header type="profile" onClick={handleOpenSettingsModal} />
      <main className={styles.mainContent}>
        <ul className={styles.chatList}>
          {dummyChatList.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} />
          ))}
        </ul>
      </main>
      <Footer />

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

export default ChatListPage;
