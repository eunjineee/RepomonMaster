"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import {
  ArrowPathIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/solid";
import Lottie from "react-lottie-player";
import rankingLottie from "public/static/lotties/ranking.json";
import RepomonRank from "@/components/Rank/RepomonRank";
import BattleRank from "@/components/Rank/BattleRank";
import UserRank from "@/components/Rank/UserRank";

const Page = () => {
  const [tabIndex, setTabIndex] = useState<string>("레포몬");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchRequestSign, setSearchRequestSign] = useState<boolean>(false);

  /** 탭 인덱스 정보 */
  useEffect(() => {
    if (document.referrer !== window.location.href) {
      setTabIndex("레포몬");
    } else {
      setTabIndex(sessionStorage.getItem("rankTabIndex") as string);
    }
  }, []);

  /** 탭 버튼 클릭 시 */
  const onClickTabBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;

    setTabIndex(target.id);
    sessionStorage.setItem("rankTabIndex", target.id);
    setSearchInput("");
  };

  /** 검색 입력 값 변경 시 */
  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  /** 검색 창에서 엔터키 입력 시 */
  const onKeyDownInSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchRequestSign(!searchRequestSign);
    }
  };

  /** 검색 버튼 클릭 시 */
  const onClickSearchBtn = (e: React.MouseEvent<SVGSVGElement>) => {
    setSearchRequestSign(!searchRequestSign);
  };

  /** 초기화 버튼 클릭 시 */
  const onClickClearBtn = (e: React.MouseEvent<SVGSVGElement>) => {
    setSearchInput("");
    setSearchRequestSign(!searchRequestSign);
  };

  return (
    <div>
      <div className={styles.banner}>
        <div className={styles["banner-inner"]}>
          <div className={styles["banner-text"]}>
            <p className={styles["banner-title"]}>{tabIndex} 랭킹</p>
            {tabIndex === "레포몬" && (
              <p className={styles["banner-comment"]}>
                레포지토리 경험치 기준으로 메겨진 순위입니다.
              </p>
            )}
            {tabIndex === "배틀" && (
              <p className={styles["banner-comment"]}>
                배틀 레이팅 기준으로 메겨진 순위입니다.
              </p>
            )}
            {tabIndex === "유저" && (
              <p className={styles["banner-comment"]}>
                레포지토리 경험치의 총합으로 메겨진 순위입니다.
              </p>
            )}
          </div>
          <div className={styles["banner-search-div"]}>
            <input
              type="text"
              className={styles["banner-search"]}
              value={searchInput}
              onChange={onChangeSearchInput}
              onKeyDown={onKeyDownInSearch}
            />
            <MagnifyingGlassCircleIcon
              onClick={onClickSearchBtn}
              className={styles["search-icon"]}
            />
            <ArrowPathIcon
              onClick={onClickClearBtn}
              className={styles["clear-icon"]}
            />
          </div>
          <div className={styles["banner-lottie"]}>
            <Lottie loop={false} animationData={rankingLottie} play />
          </div>
        </div>
      </div>
      <div className={styles.tab}>
        <button
          id="레포몬"
          onClick={onClickTabBtn}
          className={tabIndex === "레포몬" ? styles.selected : undefined}
        >
          레포몬
        </button>
        <button
          id="배틀"
          onClick={onClickTabBtn}
          className={tabIndex === "배틀" ? styles.selected : undefined}
        >
          배틀
        </button>
        <button
          id="유저"
          onClick={onClickTabBtn}
          className={tabIndex === "유저" ? styles.selected : undefined}
        >
          유저
        </button>
      </div>
      <div className={styles.content}>
        {tabIndex === "레포몬" && (
          <RepomonRank
            searchInput={searchInput}
            searchRequestSign={searchRequestSign}
          />
        )}
        {tabIndex === "배틀" && (
          <BattleRank
            searchInput={searchInput}
            searchRequestSign={searchRequestSign}
          />
        )}
        {tabIndex === "유저" && (
          <UserRank
            searchInput={searchInput}
            searchRequestSign={searchRequestSign}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
