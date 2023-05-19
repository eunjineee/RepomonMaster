import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.scss";

function Footer() {
  const navigate = useNavigate();

  const onClickFooter = () => {};

  return (
    <div className={styles.footer} onClick={onClickFooter}>
      <a href="https://repomon.kr" target="_blank">
        repomon.kr
      </a>
    </div>
  );
}

export default Footer;
