import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import loginBtn from "../assets/login.svg";
import Repomon from "../components/Repomon";
import { aixosRequestLogin } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { UserType } from "../types/type";
import { AiFillQuestionCircle } from "react-icons/ai";

function Login() {
  const [userName, setUserName] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [showToolTip, setShowToolTip] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage && localStorage.getItem("accessToken")) {
      navigate("/main");
    }
  }, [isLogin]);

  const setUserInfo = async (userInfo: UserType) => {
    localStorage.setItem("accessToken", userInfo.accessToken);
    localStorage.setItem("refreshToken", userInfo.refreshToken);
    localStorage.setItem("userId", userInfo.userId.toString());
    localStorage.setItem("userName", userInfo.userName);
    localStorage.setItem("avatarUrl", userInfo.avatarUrl);

    const promise = new Promise<void>((resolve) => resolve());

    return promise;
  };

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const onChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  const onClickLogin = async () => {
    try {
      const res1 = await aixosRequestLogin(userName, key);
      console.log("로그인: ", res1);
      setUserInfo(res1.data).then(() => setIsLogin(true));
    } catch (err) {
      console.error(err);
      alert("유저명 또는 키를 다시 확인해주세요.");
    }
  };

  return (
    <div>
      <div className={styles["text-div"]}>
        <h3>Repomon Battle Device</h3>
        <p>
          레포몬의 배틀 서비스를 <br /> 확장 앱에서 편리하게 이용해보세요.
        </p>
      </div>
      <Repomon />
      <div className={styles.form}>
        <div>
          <input
            type="text"
            value={userName}
            placeholder="Github 유저명을 입력해주세요."
            onChange={onChangeUserName}
            style={{ margin: "0 0 0.5rem 0" }}
          />
        </div>
        <div className={styles["key-div"]}>
          <input
            type="password"
            value={key}
            placeholder="발급받은 Key를 입력해주세요."
            onChange={onChangeKey}
          />
          <AiFillQuestionCircle
            onClick={() => {
              setShowToolTip(!showToolTip);
            }}
          />
        </div>
      </div>
      {showToolTip && (
        <p className={styles["tool-tip"]}>
          repomon.kr - 내 프로필 - Key 아이콘을 눌러 발급받을 수 있어요.
        </p>
      )}
      <img
        alt="github login button"
        src={loginBtn}
        className={styles["login-btn"]}
        onClick={onClickLogin}
      />
      <p className={styles.ver}>ver 1.4</p>
    </div>
  );
}

export default Login;
