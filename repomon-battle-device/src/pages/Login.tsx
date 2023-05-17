import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import githubLoginBtn from "../assets/github_login_button.svg";
import Repomon from "../components/Repomon";
import { aixosRequestLogin } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { UserType } from "../types/type";

function Login() {
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

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

  const onClickLogin = async () => {
    try {
      const res1 = await aixosRequestLogin(userName);
      console.log("로그인: ", res1);
      setUserInfo(res1.data).then(() => setIsLogin(true));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles["text-div"]}>
        <h3>Repomon Battle Device</h3>
        <p>
          레포몬의 배틀 서비스를 <br /> 사이드바 앱에서 편리하게 이용해보세요.
        </p>
      </div>
      <Repomon />
      <div className={styles.userName}>
        <input
          type="text"
          value={userName}
          placeholder="Github ID를 입력해주세요."
          onChange={onChangeUserName}
        />
      </div>
      <img
        alt="github login button"
        src={githubLoginBtn}
        className={styles["login-btn"]}
        onClick={onClickLogin}
      />
      <p className={styles.ver}>ver 1.0.0</p>
    </div>
  );
}

export default Login;
