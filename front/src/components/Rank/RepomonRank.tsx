"use client";

import React, { useEffect, useState } from "react";
import { axiosRequestRepoRank } from "@/api/rank";
import { RepomonRankContentType, RepomonRankInfoType } from "@/types/rank";
import styles from "./RepomonRank.module.scss";
import Image from "next/image";
import Pagination from "@/components/UI/Pagination";
import top1Icon from "public/static/rank/1.png";
import top2Icon from "public/static/rank/2.png";
import top3Icon from "public/static/rank/3.png";
import { pretreatModelUrl } from "@/app/utils/PretreatModelUrl";
import { useRouter } from "next/navigation";

const RepomonRank = ({
  searchInput,
  searchRequestSign,
}: {
  searchInput: string;
  searchRequestSign: boolean;
}) => {
  const [page, setPage] = useState<number>(0);
  const [top3, setTop3] = useState<RepomonRankContentType[]>([]);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [repomonRankInfo, setRepomonRankInfo] = useState<RepomonRankInfoType>();
  const router = useRouter();

  useEffect(() => {
    requestRepoRank();
  }, [page, searchRequestSign]);

  const onClickRepoItem = (repoId: number) => {
    router.push(`/repo/${repoId}`);
  };

  const requestRepoRank = async () => {
    try {
      const res = await axiosRequestRepoRank(page, searchInput);
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
    <div>
      <div className={styles["top-3-div"]}>
        {top3.map((data, index) => (
          <div key={index} className={styles[`top-${index + 1}`]}>
            <div className={styles.border} />
            <div className={styles["main-element"]} />
            <Image
              alt={`top${index}icon`}
              src={index === 0 ? top1Icon : index === 1 ? top2Icon : top3Icon}
              width={35}
              height={35}
              className={styles["rank-icon"]}
            ></Image>
            <div className={styles["img-div"]}>
              <Image
                alt="top1"
                src={`/static/models_png/${pretreatModelUrl(
                  data.repomonUrl
                )}.png`}
                width={150}
                height={120}
              ></Image>
              <p className={styles["repomon-name"]}>{data.repomonNickname}</p>
            </div>
            <div className={styles["info-div"]}>
              <p className={styles["card-content"]}>{data.repoOwner}</p>
              <p className={styles["card-title"]}>레포지토리</p>
              <p className={styles["card-content"]}>{data.repoName}</p>
              <p className={styles["card-title"]}>경험치</p>
              <p className={styles["card-content"]}>
                {data.repoExp} <span>EXP</span>
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
          <div
            key={index}
            className={styles["list-item"]}
            onClick={() => onClickRepoItem(item.repoId)}
          >
            <span>{index + 1}</span>
            <span>
              <Image
                alt="레포몬"
                src={`/static/models_png/${pretreatModelUrl(
                  item.repomonUrl
                )}.png`}
                width={45}
                height={45}
              ></Image>
              {item.repomonNickname}
            </span>
            <span>{item.repoName}</span>
            <span>{item.repoOwner}</span>
            <span>
              {item.repoExp}
              <span
                style={{
                  color: "rgb(70, 70, 70)",
                  fontSize: "1rem",
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
          totalPage={repomonRankInfo?.totalPages!}
          totalElement={repomonRankInfo?.totalElements!}
        />
      </div>
    </div>
  );
};

export default RepomonRank;
