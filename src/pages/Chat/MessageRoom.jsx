import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import actionSheetStyles from '../../components/common/ActionSheet.module.css';
import modalStyles from '../../components/common/Modal.module.css';
import styles from './MessageRoom.module.css';

import MessageInput from '../../components/Chat/MessageInput';
import Modal from '../../components/common/Modal';
import Header from '../../components/Header';

const basicProfileImageUrl = new URL(
  '../../assets/basic-profile-img.png',
  import.meta.url
).href;

const dummyMessage = [
  {
    id: 'msg1',
    type: 'other',
    content:
      '옷을 인생을 그러므로 없으면 것은 이상은 것은 우리의 위하여, 뿐이다. 이상의 청춘의 뼈 따뜻한 그들의 그와 약동하다. 대고, 못할 넣는 풍부하게 뛰노는 인생의 힘있다.',
    time: '12:39',
  },
  {
    id: 'msg2',
    type: 'other',
    content: '안녕하세요! 감귤 사고싶어요요요',
    time: '12:41',
  },
  { id: 'msg3', type: 'me', content: '네 말씀하세요', time: '12:50' },
  {
    id: 'msg4',
    type: 'me',
    image: 'https://i.pravatar.cc/240?img=5',
    time: '12:51',
  },
];

function MessageRoom() {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const chatPartner = {
    userName: location.state?.userName || '대화상대',
    profileImage: location.state?.profileImage || basicProfileImageUrl,
  };

  const handleOpenLeaveModal = () => {
    setIsLeaveModalOpen(true);
  };

  const handleLeaveChat = () => {
    console.log('채팅방 나가기 실행');
    setIsLeaveModalOpen(false);
    navigate('/chat');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <Header type="room" title={chatPartner.userName} onClick={handleOpenLeaveModal} isTitleVisible={true} />
      </div>

      <main className={styles.mainContent}>
        {dummyMessage.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageRow} ${
              msg.type === 'me' ? styles.myMessageRow : styles.otherMessageRow
            }`}
          >
            {msg.type === 'other' && (
              <img
                src={chatPartner.profileImage}
                alt="상대방 프로필"
                className={styles.profileImage}
                crossOrigin="anonymous"
              />
            )}
            <div className={styles.messageContent}>
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="채팅 이미지"
                  className={styles.chatImage}
                />
              ) : (
                <p className={styles.bubble}>{msg.content}</p>
              )}
            </div>
            <span className={styles.time}>{msg.time}</span>
          </div>
        ))}
      </main>
      <MessageInput />

      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        className={modalStyles.leaveChatModal}
      >
        <div className={actionSheetStyles.actionSheet}>
          <div className={actionSheetStyles.handle}></div>
          <ul className={actionSheetStyles.menuList}>
            <li>
              <button
                type="button"
                className={actionSheetStyles.menuButton}
                onClick={handleLeaveChat}
              >
                채팅방 나가기
              </button>
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
}

export default MessageRoom;
