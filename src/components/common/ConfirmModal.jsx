import styles from './ConfirmModal.module.css';
import Modal from './Modal';
import modalStyles from './Modal.module.css';

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  cancelText = '취소',
  confirmText = '확인',
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered
      className={modalStyles.confirmationDialog}
    >
      <div className={styles.confirmModal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button onClick={onClose}>{cancelText}</button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
