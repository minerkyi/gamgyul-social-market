import React from "react";
import styles from "./Button.module.css";

function Button({ text, disabled }) {
    return (
        <button
            className={`${styles["btn"]} ${!disabled ? styles["active"] : ""}`}
            type="submit"
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;