import React from "react";
import styles from "./SnsButton.module.css";

function SnsButton({ icon, text, type = "kakao" }) {
  return (
    <button
      className={`${styles["sns-button"]} ${styles[type]}`}
      type="button"
    >
      <img src={icon} alt="" className={styles.icon} />
      <span className={styles["sns-text"]}>{text}</span>
    </button>
  );
}

export default SnsButton;