import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  axiosGetBattleInfo,
  axiosGetBattleRanking,
  axiosGetBattleRecord,
  axiosGetOppo,
  axiosGetRepoList,
} from "../api/api";
import Loading from "../components/Loading";
import {
  RepomonBattleInfoType,
  BattleRecordType,
  RepoType,
} from "../types/type";
import styles from "./Main.module.scss";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { pretreatModelUrl } from "../utils/PretreatModelUrl";
import { ImSpinner2 } from "react-icons/im";

function Main() {
  /** ================================== 변수, useState ================================== */
  const navigate = useNavigate();
  const [repoList, setRepoList] = useState<RepoType[]>();
  const [selectedRepo, setSelectedRepo] = useState<RepoType>();
  const [showSelectList, setShowSelectList] = useState<boolean>(false);
  const [repomonBattleInfo, setRepomonBattleInfo] =
    useState<RepomonBattleInfoType>();
  const [rank, setRank] = useState<number>();
  const [battleRecords, setBattleRecords] = useState<BattleRecordType[]>();
  const [battleLoading, setBattleLoading] = useState<boolean>(false);
  const [tier, setTier] = useState<string>("");
  const [tierColor, setTierColor] = useState<string>("");
  const [matchLoading, setMatchLoading] = useState<boolean>(false);

  /** ================================== useEffect ================================== */
  useEffect(() => {
    if (!localStorage || !localStorage.getItem("accessToken")) {
      navigate("/");
    }

    getRepoList(localStorage.getItem("userId") as string);
  }, []);

  useEffect(() => {
    if (localStorage && localStorage.getItem("selectedRepoId")) {
      const localRepo: RepoType = {
        repoId: parseInt(localStorage.getItem("selectedRepoId") as string, 10),
        repoName: localStorage.getItem("selectedRepoName") as string,
        repomonName: localStorage.getItem("selectedRepomonName") as string,
        repomonUrl: localStorage.getItem("selectedRepomonUrl") as string,
      };

      setSelectedRepo(localRepo);
      getBattleInfo(localRepo.repoId);
    }
  }, []);

  useEffect(() => {
    if (repomonBattleInfo && rank && battleRecords) {
      setTimeout(() => {
        setBattleLoading(false);
      }, 500);
    }
  }, [repomonBattleInfo, rank, battleRecords]);

  useEffect(() => {
    if (repomonBattleInfo) {
      if (repomonBattleInfo.rating >= 1600) {
        setTier("다이아몬드");
        setTierColor("#85CCFF");
      } else if (repomonBattleInfo.rating >= 1400) {
        setTier("플래티넘");
        setTierColor("#25BBA2");
      } else if (repomonBattleInfo.rating >= 1200) {
        setTier("골드");
        setTierColor("#D7BC6A");
      } else if (repomonBattleInfo.rating >= 1000) {
        setTier("실버");
        setTierColor("gray");
      } else {
        setTier("브론즈");
        setTierColor("#BD6E40");
      }
    }
  }, [repomonBattleInfo]);

  /** ================================== 함수, Event Handler ================================== */
  const onClickRepoItem = (repo: RepoType) => {
    setShowSelectList(false);
    setSelectedRepo(repo);
    getBattleInfo(repo.repoId);

    localStorage.setItem("selectedRepoId", repo.repoId.toString());
    localStorage.setItem("selectedRepoName", repo.repoName);
    localStorage.setItem("selectedRepomonName", repo.repomonName);
    localStorage.setItem("selectedRepomonUrl", repo.repomonUrl);
  };

  const onClickRepomonNickname = (mine: boolean, repoId: number) => {
    if (mine) {
      return;
    }

    const url = `https://repomon.kr/repo/${repoId}`;

    window.open(url, "_blank");
  };

  const onClickMatch = () => {
    if (matchLoading || !selectedRepo) {
      return;
    }

    getOppo(selectedRepo.repoId);
  };

  const onClickLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /** ================================== Axios ================================== */
  const getRepoList = async (userId: string) => {
    try {
      const res = await axiosGetRepoList(userId);
      console.log("레포 리스트: ", res);
      setRepoList(res.data.repoList);
    } catch (err) {
      console.error(err);
    }
  };

  const getBattleInfo = async (repoId: number) => {
    setBattleLoading(true);
    try {
      const res1 = await axiosGetBattleInfo(repoId);
      const res2 = await axiosGetBattleRanking(repoId);
      const res3 = await axiosGetBattleRecord(repoId);
      console.log("배틀 정보: ", res1);
      console.log("배틀 랭킹: ", res2);
      console.log("배틀 전적: ", res3);
      setRepomonBattleInfo(res1.data.data);
      setRank(res2.data.rank);
      setBattleRecords(res3.data.data.battleLogList);
    } catch (err) {
      console.error(err);
    }
  };

  const getOppo = async (repoId: number) => {
    setMatchLoading(true);
    try {
      const res = await axiosGetOppo(repoId);
      console.log("매칭: ", res);
      setTimeout(() => {
        navigate("/battle", {
          state: {
            repoId,
            oppoId: res.data.data.repoId as number,
          },
        });
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "500px" }}>
      <p className={styles.logout} onClick={onClickLogout}>
        로그아웃
      </p>
      <div className={styles["user-div"]}>
        <img
          alt="profile image"
          src={localStorage.getItem("avatarUrl") as string}
        />
        <span>
          <a
            href={`https://repomon.kr/user/${
              localStorage.getItem("userId") as string
            }`}
            target="_blank"
          >
            {localStorage.getItem("userName")}
          </a>{" "}
          님, 어서오세요.
        </span>
      </div>
      {repoList && (
        <div className={styles["select-div"]}>
          <button
            className={
              showSelectList ? `${styles.select} ${styles.show}` : styles.select
            }
            onClick={() => {
              setShowSelectList(!showSelectList);
            }}
          >
            {!selectedRepo && !showSelectList && (
              <p className={styles.placeholder}>배틀 레포몬을 설정해주세요.</p>
            )}
            {selectedRepo && (
              <div className={styles.selected}>
                <img
                  alt="repomon image"
                  src={`/models_png/${pretreatModelUrl(
                    selectedRepo.repomonUrl
                  )}.png`}
                />
                <span>
                  {selectedRepo.repomonName} (
                  <span>{selectedRepo.repoName}</span>)
                </span>
              </div>
            )}
            {!showSelectList && <IoIosArrowUp />}
            {showSelectList && <IoIosArrowDown />}
          </button>
          {showSelectList && (
            <div className={styles["repo-list"]}>
              {repoList.map((repo, index) => (
                <div
                  className={styles.repo}
                  key={index}
                  onClick={() => onClickRepoItem(repo)}
                >
                  <img
                    alt="repomon image"
                    src={`/models_png/${pretreatModelUrl(repo.repomonUrl)}.png`}
                  />
                  <span>
                    {repo.repomonName} (<span>{repo.repoName}</span>)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {battleLoading && (
        <div className={styles["loading-container"]}>
          <Loading />
        </div>
      )}
      {!battleLoading && selectedRepo && (
        <div className={styles["battle-repo-div"]}>
          <div className={styles.card}>
            <div className={styles.left}>
              <img
                alt="repomon image"
                src={`/models_png/${pretreatModelUrl(
                  selectedRepo.repomonUrl
                )}.png`}
              />
              <p className={styles["repomon-name"]}>
                {selectedRepo.repomonName.substring(0, 30)}{" "}
                {selectedRepo.repomonName.length > 30 && <span>...</span>}{" "}
              </p>
            </div>
            <div className={styles.right}>
              <div>
                <p>레포지토리</p>
                <p className={styles.content}>
                  {selectedRepo.repoName.substring(0, 30)}{" "}
                  {selectedRepo.repoName.length > 30 && <span>...</span>}{" "}
                </p>
              </div>
              <div>
                <p>레이팅</p>
                <p className={styles.content}> {repomonBattleInfo?.rating} </p>
              </div>
              <p>티어</p>
              <p className={styles.content}>
                <span style={{ color: tierColor }}>{tier}</span>
              </p>
            </div>
            <button className={styles.match} onClick={onClickMatch}>
              {!matchLoading && <span>배틀 매칭</span>}
              {matchLoading && <ImSpinner2 />}
            </button>
          </div>
          <div className={styles.records}>
            {!battleRecords && (
              <p className={styles["no-record"]}>배틀 기록이 없어요.</p>
            )}
            {battleRecords &&
              battleRecords.slice(0, 5).map((record, index) => (
                <div
                  key={index}
                  className={
                    selectedRepo.repomonName ===
                      record.attackRepo.repomonNickname && record.isWin
                      ? `${styles["record-item"]} ${styles["win-record-item"]}`
                      : selectedRepo.repomonName ===
                          record.defenseRepo.repomonNickname && !record.isWin
                      ? `${styles["record-item"]} ${styles["win-record-item"]}`
                      : `${styles["record-item"]} ${styles["lose-record-item"]}`
                  }
                >
                  <div id="left">
                    <div
                      className={styles["result-div"]}
                      style={{ margin: "0 2rem 0 0" }}
                    >
                      {record.attackRepo.repomonNickname ===
                        selectedRepo.repomonName && (
                        <>
                          <p
                            className={record.isWin ? styles.win : styles.lose}
                          >
                            {record.isWin ? "승리" : "패배"}
                          </p>
                          <p
                            className={record.isWin ? styles.win : styles.lose}
                          >
                            {record.attackPoint > 0 && "+"}
                            {record.attackPoint}
                          </p>
                        </>
                      )}
                      {record.defenseRepo.repomonNickname ===
                        selectedRepo.repomonName && (
                        <>
                          <p
                            className={!record.isWin ? styles.win : styles.lose}
                          >
                            {!record.isWin ? "승리" : "패배"}
                          </p>
                          <p
                            className={!record.isWin ? styles.win : styles.lose}
                          >
                            {record.defensePoint > 0 && "+"}
                            {record.defensePoint}
                          </p>
                        </>
                      )}
                    </div>
                    <img
                      src={`/models_png/${pretreatModelUrl(
                        record.attackRepo.repomon.repomonUrl
                      )}.png`}
                      alt="attack repomon"
                    ></img>
                    <div
                      className={`${styles["record-refo-info"]} ${styles.attack}`}
                    >
                      <p
                        className={
                          selectedRepo.repomonName ===
                          record.attackRepo.repomonNickname
                            ? `${styles["repomon-nickname"]} ${styles.mine}`
                            : `${styles["repomon-nickname"]} ${styles["not-mine"]}`
                        }
                        onClick={() =>
                          onClickRepomonNickname(
                            selectedRepo.repomonName ===
                              record.attackRepo.repomonNickname,
                            record.attackRepo.repoId
                          )
                        }
                      >
                        {record.attackRepo.repomonNickname}{" "}
                        {selectedRepo.repomonName ===
                          record.attackRepo.repomonNickname && "(나)"}
                      </p>
                    </div>
                  </div>
                  <img
                    src="/sword.png"
                    alt="sword"
                    className={styles.sword}
                  ></img>
                  <div id="right">
                    <div
                      className={`${styles["record-refo-info"]} ${styles.defense}`}
                    >
                      <p
                        className={
                          selectedRepo.repomonName ===
                          record.defenseRepo.repomonNickname
                            ? `${styles["repomon-nickname"]} ${styles.mine}`
                            : `${styles["repomon-nickname"]} ${styles["not-mine"]}`
                        }
                        onClick={() =>
                          onClickRepomonNickname(
                            selectedRepo.repomonName ===
                              record.defenseRepo.repomonNickname,
                            record.defenseRepo.repoId
                          )
                        }
                      >
                        <p>
                          {record.defenseRepo.repomonNickname}{" "}
                          {selectedRepo.repomonName ===
                            record.defenseRepo.repomonNickname && "(나)"}
                        </p>
                      </p>
                    </div>
                    <img
                      src={`/models_png/${pretreatModelUrl(
                        record.defenseRepo.repomon.repomonUrl
                      )}.png`}
                      alt="defense repomon"
                    ></img>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
