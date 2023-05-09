"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import styles from "./DetailBattle.module.scss";
import heartIcon from "public/static/icons/heart_icon.png";
import attackIcon from "public/static/icons/attack_icon.png";
import avoidIcon from "public/static/icons/avoid_icon.png";
import criticalIcon from "public/static/icons/critical_icon.png";
import hitIcon from "public/static/icons/hit_icon.png";
import shieldIcon from "public/static/icons/shield_icon.png";
import {
  BattleRecordType,
  RepoDetailBattleType,
  StatType,
} from "@/types/repoDetail";
import { axiosRequestUpStat } from "@/api/repoDetail";
import { useRouter } from "next/navigation";
import sword from "public/static/icons/sword_icon.png";
import bronze from "public/static/tier/bronze.svg";
import silver from "public/static/tier/silver.svg";
import gold from "public/static/tier/gold.svg";
import platinum from "public/static/tier/platinum.svg";
import diamond from "public/static/tier/diamond.svg";
import { pretreatModelUrl } from "@/app/utils/PretreatModelUrl";

const DetailBattle = ({
  battleInfo,
  rank,
  battleRecords,
  myRepomonNickname,
  repoId,
  setStatUpdated,
  myRepo,
}: {
  battleInfo: RepoDetailBattleType;
  rank: number;
  battleRecords: BattleRecordType[];
  myRepomonNickname: string;
  repoId: string;
  setStatUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  myRepo: boolean;
}) => {
  const [restStatPoint, setRestStatPoint] = useState<number>(
    battleInfo.statPoint
  );
  const defaultPointStats: StatType = {
    atkPoint: 0,
    criticalPoint: 0,
    defPoint: 0,
    dodgePoint: 0,
    hitPoint: 0,
  };
  const [pointStats, setPointStats] = useState<StatType>(defaultPointStats);
  const [statChanged, setStatChanged] = useState<boolean>(false);
  const router = useRouter();
  const [tier, setTier] = useState<string>("");
  const [tierImg, setTierImg] = useState<string>("");
  const [tierColor, setTierColor] = useState<string>("");

  useEffect(() => {
    if (battleInfo.rating >= 1300) {
      setTier("Diamond");
      setTierImg(diamond);
      setTierColor("#CBD9FE");
    } else if (battleInfo.rating >= 1150) {
      setTier("Platinum");
      setTierImg(platinum);
      setTierColor("#25BBA2");
    } else if (battleInfo.rating >= 1050) {
      setTier("Gold");
      setTierImg(gold);
      setTierColor("#D7BC6A");
    } else if (battleInfo.rating >= 950) {
      setTier("Silver");
      setTierImg(silver);
      setTierColor("#B1B1B1");
    } else {
      setTier("Bronze");
      setTierImg(bronze);
      setTierColor("#BD6E40");
    }
  }, []);

  const onClickStatPlus = (e: React.MouseEvent<HTMLButtonElement>) => {
    setStatChanged(true);
    setRestStatPoint(restStatPoint - 1);

    const target = e.target as HTMLElement;

    setPointStats({
      ...pointStats,
      [target.id]: pointStats[target.id] + 1,
    });
  };

  const onClickReset = () => {
    setStatChanged(false);
    setRestStatPoint(battleInfo.statPoint);
    setPointStats(defaultPointStats);
  };

  const onClickStatApply = async () => {
    try {
      const res = await axiosRequestUpStat(parseInt(repoId, 10), pointStats);
      console.log("스탯 변경 응답: ", res);
      setStatChanged(false);
      setStatUpdated((prev) => !prev);
    } catch (err) {
      console.error("스탯 변경 에러", err);
    }
  };

  const onClickRepominNickname = (mine: boolean, repoId: number) => {
    if (mine) {
      return;
    }

    router.push(`/repo/${repoId}`);
  };

  return (
    <div>
      <p className={styles["tab-title"]}>레포몬 배틀 정보</p>
      <p className={styles["tab-des"]}>
        레포몬의 배틀에 관한 정보를 볼 수 있어요.
      </p>
      <div className={styles.top}>
        <div>
          <div className={styles.att}>
            <span>레이팅</span>
            <span>티어</span>
            <span>배틀 랭킹</span>
            <span>승</span>
            <span>패</span>
          </div>
          <div className={styles.att} style={{ color: "red" }}>
            <span>{battleInfo.rating}</span>
            <span
              style={{
                fontSize: "14px",
                color: tierColor,
              }}
            >
              <Image
                src={tierImg}
                alt="티어"
                width={40}
                height={40}
                className={styles.image}
              ></Image>
              {tier}
            </span>
            <span>{rank}위</span>
            <span>{battleInfo.winCnt}</span>
            <span>{battleInfo.loseCnt}</span>
          </div>
        </div>
        {myRepo && (
          <button>
            배틀 매칭
            <span>
              <ChevronDoubleRightIcon />
            </span>
          </button>
        )}
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <p className={styles["left-title"]}>
            능력치
            {myRepo && (
              <span>
                스탯 포인트:
                <span style={{ color: "blue" }}> {restStatPoint}</span>
              </span>
            )}
          </p>
          <div className={styles["stat-line"]}>
            <p style={{ marginTop: "2rem" }}>
              <Image
                src={heartIcon}
                alt="heart"
                className={styles.icon}
              ></Image>
              생명력: <span>{battleInfo.hp}</span>
            </p>
            <p>
              <Image
                src={attackIcon}
                alt="attack"
                className={styles.icon}
              ></Image>
              공격력: <span>{battleInfo.atk}</span>
              {pointStats.atkPoint > 0 && myRepo && (
                <span style={{ color: "#FFB800" }}>
                  (+ {pointStats.atkPoint * battleInfo.increaseAtk})
                </span>
              )}
              {restStatPoint > 0 && myRepo && (
                <button id="atkPoint" onClick={onClickStatPlus}>
                  +
                </button>
              )}
            </p>
            <p>
              <Image
                src={shieldIcon}
                alt="shieldPoint"
                className={styles.icon}
              ></Image>
              방어율: <span>{battleInfo.def}</span>
              {pointStats.defPoint > 0 && myRepo && (
                <span style={{ color: "#76E250" }}>
                  (+ {pointStats.defPoint * battleInfo.increaseDef})
                </span>
              )}
              %
              {restStatPoint > 0 && myRepo && (
                <button id="defPoint" onClick={onClickStatPlus}>
                  +
                </button>
              )}
            </p>
            <p>
              <Image
                src={criticalIcon}
                alt="critical"
                className={styles.icon}
              ></Image>
              치명타율: <span>{battleInfo.critical}</span>
              {pointStats.criticalPoint > 0 && myRepo && (
                <span style={{ color: "#C846F5" }}>
                  (+ {pointStats.criticalPoint * battleInfo.increaseCritical})
                </span>
              )}
              %
              {restStatPoint > 0 && myRepo && (
                <button id="criticalPoint" onClick={onClickStatPlus}>
                  +
                </button>
              )}
            </p>
            <p>
              <Image
                src={avoidIcon}
                alt="avoid"
                className={styles.icon}
              ></Image>
              회피율: <span>{battleInfo.dodge}</span>
              {pointStats.dodgePoint > 0 && myRepo && (
                <span style={{ color: "#83BCFF" }}>
                  (+ {pointStats.dodgePoint * battleInfo.increaseDodge})
                </span>
              )}
              %
              {restStatPoint > 0 && myRepo && (
                <button id="dodgePoint" onClick={onClickStatPlus}>
                  +
                </button>
              )}
            </p>
            <p>
              <Image src={hitIcon} alt="hit" className={styles.icon}></Image>
              명중율: <span>{battleInfo.hit}</span>
              {pointStats.hitPoint > 0 && myRepo && (
                <span style={{ color: "#6FD9E8" }}>
                  (+ {pointStats.hitPoint * battleInfo.increaseHit})
                </span>
              )}
              %
              {restStatPoint > 0 && myRepo && (
                <button id="hitPoint" onClick={onClickStatPlus}>
                  +
                </button>
              )}
            </p>
            <div style={{ minHeight: "80px", margin: "2.5rem 0 0 0" }}>
              {statChanged && (
                <div className={styles["btn-div"]}>
                  <button onClick={onClickReset}>취소</button>
                  <button onClick={onClickStatApply}>적용</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <p style={{ margin: "6rem 0 1.5rem 0", fontSize: "1.75rem" }}>
            최근 전적
          </p>
          <div>
            {battleRecords.length === 0 && (
              <p style={{ color: "grey", fontSize: "1.5rem" }}>
                배틀 기록이 없어요.
              </p>
            )}
            {battleRecords &&
              battleRecords.slice(0, 5).map((record, index) => (
                <div
                  key={index}
                  className={
                    myRepomonNickname === record.attackRepo.repomonNickname &&
                    record.isWin
                      ? `${styles["record-item"]} ${styles["win-record-item"]}`
                      : myRepomonNickname ===
                          record.defenseRepo.repomonNickname && !record.isWin
                      ? `${styles["record-item"]} ${styles["win-record-item"]}`
                      : `${styles["record-item"]} ${styles["lose-record-item"]}`
                  }
                >
                  <div
                    className={styles["result-div"]}
                    style={{ margin: "0 2rem 0 0" }}
                  >
                    {record.attackRepo.repomonNickname ===
                      myRepomonNickname && (
                      <>
                        <p className={record.isWin ? styles.win : styles.lose}>
                          {record.isWin ? "승리" : "패배"}
                        </p>
                        <p className={record.isWin ? styles.win : styles.lose}>
                          {record.attackPoint}
                        </p>
                      </>
                    )}
                    {record.defenseRepo.repomonNickname ===
                      myRepomonNickname && (
                      <>
                        <p className={!record.isWin ? styles.win : styles.lose}>
                          {!record.isWin ? "승리" : "패배"}
                        </p>
                        <p className={!record.isWin ? styles.win : styles.lose}>
                          {record.defensePoint}
                        </p>
                      </>
                    )}
                  </div>
                  <div id="left">
                    <Image
                      src={`/static/models_png/${pretreatModelUrl(
                        record.attackRepo.repomon.repomonUrl
                      )}.png`}
                      alt="공격 레포몬"
                      width={50}
                      height={50}
                    ></Image>
                    <div
                      className={`${styles["record-refo-info"]} ${styles.attack}`}
                    >
                      <p>공격 레포몬</p>
                      <p
                        className={
                          myRepomonNickname ===
                          record.attackRepo.repomonNickname
                            ? `${styles["repomon-nickname"]} ${styles.mine}`
                            : `${styles["repomon-nickname"]} ${styles["not-mine"]}`
                        }
                        onClick={() =>
                          onClickRepominNickname(
                            myRepomonNickname ===
                              record.attackRepo.repomonNickname,
                            record.attackRepo.repoId
                          )
                        }
                      >
                        {record.attackRepo.repomonNickname}
                      </p>
                    </div>
                  </div>
                  <Image
                    src={sword}
                    alt="무시무시한 칼"
                    className={styles.sword}
                  ></Image>
                  <div id="right">
                    <div
                      className={`${styles["record-refo-info"]} ${styles.defense}`}
                    >
                      <p>방어 레포몬</p>
                      <p
                        className={
                          myRepomonNickname ===
                          record.defenseRepo.repomonNickname
                            ? `${styles["repomon-nickname"]} ${styles.mine}`
                            : `${styles["repomon-nickname"]} ${styles["not-mine"]}`
                        }
                        onClick={() =>
                          onClickRepominNickname(
                            myRepomonNickname ===
                              record.defenseRepo.repomonNickname,
                            record.defenseRepo.repoId
                          )
                        }
                      >
                        <p>{record.defenseRepo.repomonNickname}</p>
                      </p>
                    </div>
                    <Image
                      src={`/static/models_png/${pretreatModelUrl(
                        record.defenseRepo.repomon.repomonUrl
                      )}.png`}
                      alt="방어 레포몬"
                      width={50}
                      height={50}
                    ></Image>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBattle;
