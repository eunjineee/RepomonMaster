import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import horizonLogo from "../assets/horizon_logo.svg";

function Navbar() {
  const navigate = useNavigate();

  const onClickLogo = () => {
    navigate("/");
  };

  return (
    <div className={styles.navbar}>
      <img src={horizonLogo} onClick={onClickLogo} />
    </div>
  );
}

export default Navbar;
