import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineRollback } from "react-icons/ai";
import styles from "./Error.module.scss";

function Error() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <p className={styles.comment}>매칭 상대가 없습니다.</p>
      <p
        className={styles.back}
        onClick={() => {
          navigate("/main");
        }}
      >
        <AiOutlineRollback />
        뒤로가기
      </p>
    </div>
  );
}

export default Error;
