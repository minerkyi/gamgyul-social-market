import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import InputField from "../../components/common/Input/InputField";
import { useFetchApi } from "../../hooks/useFetchApi";
import styles from "./SignupPage.module.css";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState("");

  const { fetchData } = useFetchApi();

  useEffect(() => {
    window.history.forward();
  }, []);

  const debounceEmailValidation = useRef(
    debounce(async (newEmail) => {
      if (newEmail === "") {
        setIsEmailValid("");
        return;
      }

      const path = "/user/emailvalid";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            email: newEmail,
          },
        }),
      };

      const [data, isErr] = await fetchData(path, options);
      console.log("데이터 :", data);
      console.log("에러 : ", isErr);

      if (data.message === "사용 가능한 이메일 입니다.") {
        setIsEmailValid("");
        return;
      }
      setIsEmailValid(data.message);
    }, 500)
  ).current;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    debounceEmailValidation(e.target.value);
  };

  const passwordValidation = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setIsPasswordValid("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    setIsPasswordValid("");
  };

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/login/signup/profile", { state: { email, password } });
  };

  const isFormValid =
    email && password && isEmailValid === "" && isPasswordValid === "";

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2 className={styles.title}>이메일로 회원가입</h2>
        <form className={styles.form} onSubmit={handleNext}>
          <InputField
            type="email"
            value={email}
            labelText="이메일"
            placeholder="이메일 주소를 입력해 주세요."
            onChange={handleEmailChange}
            error={isEmailValid}
          />
          <InputField
            type="password"
            value={password}
            labelText="비밀번호"
            placeholder="비밀번호를 설정해 주세요."
            onChange={passwordValidation}
            error={isPasswordValid}
          />
          <Button text="다음" disabled={!isFormValid} />
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
