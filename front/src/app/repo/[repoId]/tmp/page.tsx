"use client";

import DetailRepomon from "@/components/Detail/DetailRepomon";
import React, { useState } from "react";
import styles from "./page.module.scss";

function Page() {
  const [repomonUrl, setRepomonUrl] = useState(
    "https://repomon.s3.ap-northeast-2.amazonaws.com/models/Dora_1.glb"
  );
  const [repomonTier, setrepomonTier] = useState(1);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.info}>
        <div className={styles["repo-mon-card-div"]}>
          <div className={styles["repo-mon-card"]}>
            <DetailRepomon repomonUrl={repomonUrl} repomonTier={repomonTier} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
