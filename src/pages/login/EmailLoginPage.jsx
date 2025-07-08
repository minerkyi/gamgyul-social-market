import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import InputField from "../../components/common/Input/InputField";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useUser } from "../../contexts/userContext";
import styles from "../../pages/login/EmailLoginPage.module.css";

function EmailLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const { fetchData } = useFetchApi();

  useEffect(() => {
    window.history.forward();
  }, []);

  const goToSignupPage = () => {
    navigate("/login/signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const path = "/user/login";
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email: email,
          password: password,
        },
      }),
    };

    const [data, isErr] = await fetchData(path, options);
    console.log("데이터 :", data);
    console.log("에러 : ", isErr);

    if (!isErr) {
      saveUser(data);
      setLoginError("");
      const from = location.state?.from?.pathname || '/home';
      navigate(from, {replace: true});
    } else {
      setLoginError(data.message);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2 className={styles.title}>로그인</h2>
        <form className={styles.form} onSubmit={handleLogin}>
          <InputField
            type="email"
            value={email}
            labelText="이메일"
            inputId="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            value={password}
            labelText="비밀번호"
            inputId="password"
            onChange={(e) => setPassword(e.target.value)}
            error={loginError}
          />
          <Button text="로그인" disabled={!email || !password} />
          <button
            className={styles["signup-btn"]}
            type="button"
            onClick={goToSignupPage}
          >
            이메일로 회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailLoginPage;
