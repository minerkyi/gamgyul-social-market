import styles from './Modal.module.css';

// isOpen 모달 열려있는지
// onClose 모달 닫기
// children 모달 내부
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
