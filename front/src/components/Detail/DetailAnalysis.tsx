import React from "react";
import ExpAnalysis from "./ExpAnalysis";
import GrowthChart from "./GrowthChart";
import { RepoDetailResearchType } from "@/types/repoDetail";
import Image from "next/image";
import styles from "./DetailAnalysis.module.scss";
import bulb from "public/static/icons/bulb_icon.svg";

function DetailAnalysis({
  researchInfo,
}: {
  researchInfo?: RepoDetailResearchType;
}) {
  if (!researchInfo) {
    return null;
  }

  return (
    <div>
      <p className={styles["tab-title"]}>레포지토리 분석</p>
      <p className={styles["tab-des"]}>
        레포몬 성장의 근거와 일기를 볼 수 있어요.
      </p>
      <div style={{ margin: "3rem 0 0 0" }}>
        <div className={styles.att}>
          <span>총 경험치</span>
          <span>레포지토리 랭킹</span>
        </div>
        <div className={styles.att} style={{ color: "rgba(90, 167, 255, 1)" }}>
          <span>{researchInfo.repoExp} EXP</span>
          <span>{researchInfo.rank}위</span>
        </div>
      </div>
      <div className={styles["chart-div"]}>
        <ExpAnalysis growthFactor={researchInfo.growthFactor} />
        <span>성장 요소</span>
      </div>
      <p className={styles["chart-des"]}>
        <Image src={bulb} alt="bulb"></Image> 차트 영역을 누르면 누적 차트로
        전환 가능해요.
      </p>
      <div className={styles["chart-div"]} style={{ margin: "1rem 0 0 0" }}>
        <GrowthChart histories={researchInfo.histories} />
        <span>성장 일기</span>
      </div>
    </div>
  );
}

export default DetailAnalysis;
