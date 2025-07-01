import { useEffect, useState } from "react";
import styles from "./SignupProfilePage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";

import basicProfileImage from "../../assets/basic-profile-img.png";
import Header from "../../components/Header";
import Button from "../../components/common/Button/Button";
import InputField from "../../components/common/Input/InputField";

function SignupProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [accountname, setAccountname] = useState("");
  const [intro, setIntro] = useState("");
  const { email, password } = location.state || { email: "", password: "" };

  const [isUsernameValid, setIsUsernameValid] = useState("");
  const [isAccountIdValid, setIsAccountIdValid] = useState("");

  const { fetchData } = useFetchApi();

  const isFormValid =
    isUsernameValid === "" &&
    isAccountIdValid === "" &&
    username &&
    accountname;
  console.log(isFormValid);

  // 유저네임 유효성
  useEffect(() => {
    if (username.length >= 2 && username.length <= 10) {
      setIsUsernameValid("");
    } else {
      setIsUsernameValid("2~10자 이내여야 합니다.");
    }
  }, [username]);

  // 계정ID 유효성
  useEffect(() => {
    const regex = /^[a-zA-Z0-9_.]+$/;
    if (regex.test(accountname) && accountname.length > 0) {
      accountnameValidation();
    } else {
      setIsAccountIdValid("영문, 숫자, 밑줄, 마침표만 사용할 수 있습니다.");
    }
  }, [accountname]);

  const accountnameValidation = async () => {
    const path = "/user/accountnamevalid";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          accountname: accountname,
        },
      }),
    };

    const [data, isErr] = await fetchData(path, options);

    console.log("데이터 :", data);
    console.log("데이터.메세지 :", data.message);
    console.log("에러 : ", isErr);

    if (data.message === "사용 가능한 계정ID 입니다.") {
      setIsAccountIdValid("");
    } else {
      setIsAccountIdValid("이미 사용 중인 ID입니다.");
    }
  };

  // 저장
  const handleSave = async (e) => {
    e.preventDefault();
    console.log(username, accountname, email, password, intro);
    if (!isFormValid) {
      return;
    }

    const path = "/user";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email: email,
          password: password,
          username: username,
          accountname: accountname,
          intro: intro,
          // TODO: 이미지 처리
          image:
            "https://dev.wenivops.co.kr/services/mandarin/1641906557953.png",
        },
      }),
    };

    const [data, isErr] = await fetchData(path, options);
    console.log("데이터 :", data);
    console.log("에러 : ", isErr);

    navigate("/login/email");
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.imageSection}>
            <img
              src={basicProfileImage}
              alt="현재 프로필 이미지"
              className={styles.profileImage}
            />
          </div>
          <InputField
            type="text"
            value={username}
            labelText="사용자 이름"
            inputId="username"
            placeholder="2~10자 이내여야 합니다."
            error={isUsernameValid}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type="text"
            value={accountname}
            labelText="계정 ID"
            inputId="accountname"
            placeholder="영문, 숫자, 밑줄, 마침표만 사용 가능합니다."
            error={isAccountIdValid}
            onChange={(e) => setAccountname(e.target.value)}
          />
          <InputField
            type="textarea"
            value={intro}
            labelText={"소개"}
            inputId="intro"
            placeholder="자신과 판매할 상품에 대해 소개해 주세요!"
            onChange={(e) => setIntro(e.target.value)}
          />
          <Button text="감귤 마켓 시작하기" disabled={!isFormValid} />
        </form>
      </div>
    </div>
  );
}

export default SignupProfilePage;
