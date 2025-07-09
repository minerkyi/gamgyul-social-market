import actionSheetStyles from '../../components/common/ActionSheet.module.css';
import modalStyles from '../../components/common/Modal.module.css';
import styles from './ChatListPage.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyUsers } from '../../data/dummyUsers';

import ChatListItem from '../../components/Chat/ChatListItem';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const dummyLastMessages = [
  '이번에 주문 가능한가요?',
  '좋은 하루 보내세요. 콜스프레소 뉴 블랙 해...',
  '내 차는 내가 평가한다. 오픈 이벤트에 참여 하...',
  '저도 같이 참여하고 싶어요!',
];
const dummyTimestamps = [
  '2025.07.02',
  '2025.07.02',
  '2025.07.02',
  '2020.07.02',
];

const dummyChatList = dummyUsers.map((user, index) => ({
  id: `chat${index + 1}`,
  userName: user.username,
  profileImage: user.image,
  lastMessage: dummyLastMessages[index],
  timestamp: dummyTimestamps[index],
  unreadCount: index < 2 ? 2 - index : 0,
})).filter((_, index) => index < 4);

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
