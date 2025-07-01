import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginMain.module.css";
import symbolLogoW from "../../assets/symbol-logo-W.png";
import iconKakao from "../../assets/message-circle.png";
import iconGoogle from "../../assets/google.png";
import iconFacebook from "../../assets/facebook.png";
import SnsButton from "../../components/common/Button/SnsButton";

function LoginMain() {
  const navigate = useNavigate();

  const goToEmailLoginPage = () => {
    navigate("/login/email");
  };

  const goToSignupPage = () => {
    navigate("/login/signup");
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles["login-main"]}>
          <img className={styles.logo} src={symbolLogoW} alt="로고" />
          <div className={styles.snscontainer}>
            <SnsButton
              icon={iconKakao}
              text="카카오톡 계정으로 로그인"
              type="kakao"
            />
            <SnsButton
              icon={iconGoogle}
              text="구글 계정으로 로그인"
              type="google"
            />
            <SnsButton
              icon={iconFacebook}
              text="페이스북 계정으로 로그인"
              type="facebook"
            />
            <div className={styles["email-login"]}>
              <button
                className={styles["email-btn"]}
                type="button"
                onClick={goToEmailLoginPage}
              >
                이메일로 로그인
              </button>
              <button
                className={styles["signup-btn"]}
                type="button"
                onClick={goToSignupPage}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginMain;
