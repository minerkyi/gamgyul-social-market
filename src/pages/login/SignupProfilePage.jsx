import { useEffect, useState, useRef } from "react";
import styles from "./SignupProfilePage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useUser } from "../../contexts/userContext";

import basicProfileImage from "../../assets/basic-profile-img.png";
import imageUploadIcon from "../../assets/icon/icon-upload.png";
import Button from "../../components/common/Button/Button";
import InputField from "../../components/common/Input/InputField";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

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

  const { saveUser } = useUser();

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] =
    useState(basicProfileImage);
  const fileInputRef = useRef(null);

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

  // 계정ID 유효성 디바운싱
  const debounceAccountnameValidation = useRef(
    debounce(async (accountname) => {
      const regex = /^[a-zA-Z0-9_.]+$/;
      if (!regex.test(accountname) || accountname.length === 0) {
        setIsAccountIdValid("영문, 숫자, 밑줄, 마침표만 사용할 수 있습니다.");
        return;
      }

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
    }, 500)
  ).current;

  const handleAccountnameChange = (e) => {
    setAccountname(e.target.value);
    debounceAccountnameValidation(e.target.value);
    // console.log("start", e.target.value, new Date());
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }

    //이미지 처리
    let imageUrl = basicProfileImage;
    if (profileImageFile) {
      const formData = new FormData();
      formData.append("image", profileImageFile);
      try {
        const res = await fetch("https://dev.wenivops.co.kr/services/mandarin/image/uploadfile", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        const filename = data?.info?.filename;
        if (filename) {
          imageUrl = `https://dev.wenivops.co.kr/services/mandarin/${filename}`;
        }
      } catch {
        //
      }
    }
    // 회원가입
    const signupPath = "/user";
    const signupOptions = {
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
          image: imageUrl,
        },
      }),
    };

    const [data, isErr] = await fetchData(signupPath, signupOptions);
    console.log("데이터 :", data);
    console.log("에러 : ", isErr);

    // 자동 로그인
    const loginPath = "/user/login";
    const loginOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: { email, password },
      }),
    };

    const [loginData] = await fetchData(loginPath, loginOptions);

    saveUser(loginData);
    navigate("/");
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2 className={styles.title}>프로필 설정</h2>
        <h3 className={styles.text}>나중에 언제든지 변경할 수 있습니다.</h3>
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.imageSection}>
            <img
              src={profileImagePreview}
              alt="현재 프로필 이미지"
              className={styles.profileImage}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleProfileFileChange}
            />
            <button
              type="button"
              className={styles.imageUploadButton}
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={imageUploadIcon}
                alt="프로필 이미지 업로드 아이콘"
                className={styles.imageUploadIcon}
              />
            </button>
          </div>
          <InputField
            type="text"
            value={username}
            labelText="사용자 이름"
            inputId="username"
            placeholder="2~10자 이내여야 합니다."
            error={username ? isUsernameValid : ""}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type="text"
            value={accountname}
            labelText="계정 ID"
            inputId="accountname"
            placeholder="영문, 숫자, 밑줄, 마침표만 사용 가능합니다."
            error={accountname ? isAccountIdValid : ""}
            onChange={handleAccountnameChange}
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
