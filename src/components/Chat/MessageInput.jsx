import { useState } from 'react';
import styles from './MessageInput.module.css';

const iconUploadUrl = new URL(
  '../../assets/icon/icon-upload.png',
  import.meta.url
).href;

function MessageInput() {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const isSendButtonActive = message.length > 0;

  return (
    <div className={styles.inputContainer}>
      <label htmlFor="image-upload" className={styles.imageUploadLabel}>
        <img src={iconUploadUrl} alt="이미지 업로드" />
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className={styles.imageUploadInput}
      />

      <input
        type="text"
        className={styles.textInput}
        placeholder="메시지 입력하기..."
        value={message}
        onChange={handleMessageChange}
      />

      <button
        type="button"
        className={`${styles.sendButton} ${
          isSendButtonActive ? styles.active : ''
        }`}
        disabled={!isSendButtonActive}
      >
        전송
      </button>
    </div>
  );
}

export default MessageInput;
