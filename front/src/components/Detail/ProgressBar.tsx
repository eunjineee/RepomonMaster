import React from "react";
import styles from "./ProgressBar.module.scss";

function ProgressBar({ restExp }: { restExp: number }) {
  return (
    <div className={styles.component}>
      <div style={{ width: `${restExp}%` }}>
        <div className={styles.inner}></div>
        <span className={styles.rest}>{restExp}%</span>
      </div>
    </div>
  );
}

export default ProgressBar;
