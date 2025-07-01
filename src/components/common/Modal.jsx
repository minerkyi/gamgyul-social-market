import styles from './Modal.module.css';

// isOpen 모달 열려있는지
// onClose 모달 닫기
// children 모달 내부
function Modal({
  isOpen,
  onClose,
  children,
  className = '',
  centered = false,
}) {
  if (!isOpen) {
    return null;
  }

  const backdropStyle = centered
    ? `${styles.modalBackdrop} ${styles.centerAlign}`
    : styles.modalBackdrop;

  return (
    <div className={backdropStyle} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
