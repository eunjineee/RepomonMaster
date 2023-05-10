"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Lottie from "react-lottie-player";
import cardLottie from "public/static/lotties/card.json";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Page = () => {
  const [kind, setKind] = useState<string>("레포 카드");
  const [showKind, setShowKind] = useState<boolean>(false);
  const [markdownSource, setMarkdownSource] = useState<string>("");

  const onClickKindItem = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement;
    setKind(target.id);
    setShowKind(false);
  };

  const a = `
  [![RepomonRepoCard](https://repomon.kr/card/repo?repoId=14)](https://repomon.kr)
  `;

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles["banner-inner"]}>
          <div className={styles["banner-text"]}>
            <p className={styles["banner-title"]}>레포지토리 카드 추출</p>
            <p className={styles["banner-comment"]}>
              Github README에 활용 가능한 레포지토리 분석 카드를 추출할 수
              있어요.
            </p>
          </div>
          <div className={styles["banner-lottie"]}>
            <Lottie loop={false} animationData={cardLottie} play />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.kind}>
          <p className={styles["kind-title"]}>카드 유형</p>
          <div className={styles["kind-select"]}>
            <button
              onClick={() => setShowKind(!showKind)}
              className={styles["cur-kind"]}
            >
              {kind}
              {!showKind && <ChevronDownIcon />}
              {showKind && <ChevronUpIcon />}
            </button>
            {showKind && (
              <ul className={styles.option}>
                <li id="레포 카드" onClick={onClickKindItem}>
                  레포 카드
                </li>
                <li id="개인 레포 카드" onClick={onClickKindItem}>
                  개인 레포 카드
                </li>
              </ul>
            )}
          </div>
        </div>
        {kind === "레포 카드" && <p></p>}
        <ReactMarkdown>{a}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Page;
