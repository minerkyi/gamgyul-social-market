import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import InputField from "../../components/common/Input/InputField";
import { useFetchApi } from "../../hooks/useFetchApi";
import styles from "./SignupPage.module.css";

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState("");

  const { fetchData } = useFetchApi();

  const emailValidation = async (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    console.log(newEmail);

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
        {/* <div> */}
        <h2 className={styles.title}>회원가입</h2>
        <form className={styles.form} onSubmit={handleNext}>
          <InputField
            type="email"
            value={email}
            labelText="이메일"
            placeholder="이메일 주소를 입력해 주세요."
            onChange={emailValidation}
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
