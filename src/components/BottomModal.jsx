import styles from './BottomModal.module.css';

// isOpen 모달 열려있는지
// onClose 모달 닫기
// children 모달 내부
function BottomModal({ isOpen, setIsOpen, children }) {
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className={styles["modal-backdrop"]} onClick={() => setIsOpen(false)}>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["action-sheet"]}>
          <div className={styles.handle}></div>
          <ul className={styles["menu-list"]}>
          {children.map((item, idx) => (
            <li key={idx}>
              <button type="button" className={styles["menu-button"]} onClick={item.event}>
                {item.title}
              </button>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BottomModal;