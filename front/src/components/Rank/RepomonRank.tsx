"use client";

import React, { useEffect, useState } from "react";
import { axiosRequestRepoRank } from "@/api/rank";
import { RepoRankContentType, RepoRankInfoType } from "@/types/rank";
import styles from "./RepomonRank.module.scss";
import Image from "next/image";
import Pagination from "@/components/UI/Pagination";
import top1Icon from "public/static/rank/1.png";
import top2Icon from "public/static/rank/2.png";
import top3Icon from "public/static/rank/3.png";
import { pretreatModelUrl } from "@/app/utils/PretreatModelUrl";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const RepomonRank = ({
  searchInput,
  searchRequestSign,
}: {
  searchInput: string;
  searchRequestSign: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [top3, setTop3] = useState<RepoRankContentType[]>([]);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [repomonRankInfo, setRepomonRankInfo] = useState<RepoRankInfoType>();
  const router = useRouter();

  useEffect(() => {
    if (repomonRankInfo) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [repomonRankInfo]);

  useEffect(() => {
    requestRepoRank();
  }, [page, searchRequestSign]);

  const onClickRepoItem = (repoId: number) => {
    router.push(`/repo/${repoId}`);
  };

  const onClickUserItem = (userId: number) => {
    router.push(`/user/${userId}`);
  };

  const requestRepoRank = async () => {
    try {
      const res = await axiosRequestRepoRank(page - 1, searchInput);
      console.log("레포몬 랭킹: ", res);
      setRepomonRankInfo(res.data);
      if (isInitial) {
        setTop3(res.data.content.slice(0, 3));
        setIsInitial(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          <div className={styles["top-3-div"]}>
            {top3.map((data, index) => (
              <div key={index} className={styles[`top-${index + 1}`]}>
                <div className={styles.border} />
                <div className={styles["main-element"]} />
                <Image
                  alt={`top${index + 1}icon`}
                  src={
                    index === 0 ? top1Icon : index === 1 ? top2Icon : top3Icon
                  }
                  width={35}
                  height={35}
                  className={styles["rank-icon"]}
                ></Image>
                <div className={styles["img-div"]}>
                  <Image
                    alt={`top${index + 1}`}
                    src={`/static/models_png/${pretreatModelUrl(
                      data.repomonUrl
                    )}.png`}
                    width={150}
                    height={120}
                  ></Image>
                  <p className={styles["repomon-name"]}>
                    {data.repomonNickname}
                  </p>
                </div>
                <div className={styles["info-div"]}>
                  <p className={styles["card-content"]}>{data.repoOwner}</p>
                  <p className={styles["card-title"]}>레포지토리</p>
                  <p className={styles["card-content"]}>{data.repoName}</p>
                  <p className={styles["card-title"]}>경험치</p>
                  <p className={styles["card-content"]}>
                    {data.repoExp.toLocaleString()} <span>EXP</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.list}>
            <div className={styles["list-title"]}>
              <span>순위</span>
              <span>레포몬</span>
              <span>레포지토리</span>
              <span>유저</span>
              <span>경험치</span>
            </div>
            {repomonRankInfo?.content.map((item, index) => (
              <div key={index} className={styles["list-item"]}>
                <span>{item.repoRank}</span>
                <span
                  style={{
                    justifyContent: "flex-start",
                    transform: "translateX(35%)",
                  }}
                  onClick={() => onClickRepoItem(item.repoId)}
                  className={styles.hover}
                >
                  <Image
                    alt="레포몬"
                    src={`/static/models_png/${pretreatModelUrl(
                      item.repomonUrl
                    )}.png`}
                    width={35}
                    height={35}
                  ></Image>
                  {item.repomonNickname}
                </span>
                <span
                  onClick={() => onClickRepoItem(item.repoId)}
                  className={styles.hover}
                >
                  {item.repoName}
                </span>
                <span
                  onClick={() => onClickUserItem(item.userId)}
                  className={styles.hover}
                >
                  {item.repoOwner}
                </span>
                <span>
                  {item.repoExp.toLocaleString()}
                  <span
                    style={{
                      margin: "0 0 0 0.3rem",
                    }}
                  >
                    EXP
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className={styles["pagination-div"]}>
            <Pagination
              size={15}
              currentPage={page}
              setCurrentPage={setPage}
              totalPage={repomonRankInfo?.totalPages!}
              totalElement={repomonRankInfo?.totalElements!}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RepomonRank;
