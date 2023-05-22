"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { XMarkIcon } from "@heroicons/react/24/solid";
import styles from "./ExportModal.module.scss";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import {
  axiosRequestPersonalLans,
  axiosRequestSetPersonalLans,
  axiosRequestUpdateRepoCard,
  axiosRequestUpdateRepoPersonalCard,
} from "@/api/repoDetail";
import { languageColor } from "@/styles/colors";
import LoadingSpinner from "../Skeletons/LoadingSpinner";

const customStyles = {
  content: {
    zIndex: "10000000",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "490px",
  },
};

const ExportModal = ({
  repoId,
  userId,
  isTeam,
  lans,
}: {
  repoId: number;
  userId: number;
  isTeam: boolean;
  lans: string[];
}) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [repoCardUpdated, setRepoCardUpdated] = useState<boolean>(false);
  const [repoPersonalCardUpdated, setRepoPersonalCardUpdated] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [kind, setKind] = useState<string>("레포 카드");
  const [showKind, setShowKind] = useState<boolean>(false);
  const [applied, setApplied] = useState<string[]>([]);
  const teamSource = `![RepomonRepoCard](https://repomon.kr/card/repo?repoId=${repoId})`;
  const personalSource = `![RepomonRepoPersonalCard](https://repomon.kr/card/repo_personal?repoId=${repoId}&userId=${userId}) `;
  const [selected, setSelected] = useState<string[]>([]);
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [updateRepoPersonalLoading, setUpdateRepoPersonalLoading] =
    useState<boolean>(false);

  /** ============================== useEffect ============================== */
  useEffect(() => {
    if (repoCardUpdated && repoPersonalCardUpdated) {
      setLoading(false);
      setIsOpen(true);
      setIsFirst(false);
    }
  }, [repoCardUpdated, repoPersonalCardUpdated]);

  /** ============================== 함수, Event Handler ============================== */
  const openModal = () => {
    if (loading) {
      return;
    }
    requestUpdateRepoCard();
    requestUpdateRepoPersonalCard();
  };

  const afterOpenModal = () => {
    requestPersonalLans();
  };

  const closeModal = () => {
    setIsOpen(false);
    setRepoCardUpdated(false);
    setRepoPersonalCardUpdated(false);
    setLoading(false);
    setKind("레포 카드");
    setShowKind(false);
    setSelected([]);
    setIsFirst(true);
    setUpdateRepoPersonalLoading(false);
  };

  const onClickKindItem = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement;
    setKind(target.id);
    setShowKind(false);
  };

  const onClickCopy = () => {
    if (kind === "개인 레포 카드" && applied.length === 0) {
      alert("언어를 설정해주세요.");
      return;
    }

    let copyUrl: string;

    if (kind === "레포 카드") {
      copyUrl = `[![RepomonRepoCard](https://repomon.kr/card/repo?repoId=${repoId})](https://repomon.kr/repo/${repoId})`;
    } else {
      copyUrl = `[![RepomonRepoPersonalCard](https://repomon.kr/card/repo_personal?repoId=${repoId}&userId=${userId})](https://repomon.kr/repo/${repoId})`;
    }

    window.navigator.clipboard.writeText(copyUrl).then(() => {
      alert("✅ 카드 URL이 복사되었습니다.");
    });
  };

  const onClickLan = (lan: string) => {
    if (selected.includes(lan)) {
      const newSelected = selected.filter((item) => item !== lan);

      setSelected(newSelected);
      return;
    }

    if (selected.length == 6) {
      return;
    }

    setSelected([...selected, lan]);
  };

  const onClickApplyBtn = () => {
    requestSetPersonalLans();
  };

  const onClickClearBtn = () => {
    setSelected([]);
  };

  /** ============================== Axios ============================== */
  const requestUpdateRepoCard = async () => {
    setLoading(true);
    try {
      const res = await axiosRequestUpdateRepoCard(repoId);
      setRepoCardUpdated(true);
    } catch (err) {}
  };

  const requestUpdateRepoPersonalCard = async () => {
    if (isFirst) {
      setLoading(true);
    } else {
      setUpdateRepoPersonalLoading(true);
    }

    try {
      const res = await axiosRequestUpdateRepoPersonalCard(repoId, userId);
      if (isFirst) {
        setRepoPersonalCardUpdated(true);
      } else {
        setUpdateRepoPersonalLoading(false);
      }
    } catch (err) {}
  };

  const requestPersonalLans = async () => {
    try {
      const res = await axiosRequestPersonalLans(repoId);
      setApplied(res.data.data);
    } catch (err) {}
  };

  const requestSetPersonalLans = async () => {
    try {
      const res = await axiosRequestSetPersonalLans(repoId, selected);
      if (res.data.resultCode === "SUCCESS") {
        setSelected([]);
        requestPersonalLans();
        requestUpdateRepoPersonalCard();
      }
    } catch (err) {}
  };

  return (
    <>
      <button onClick={openModal} className={styles.open}>
        {loading && <LoadingSpinner ml={2} mr={2} size={4} />}
        {!loading && <span>추출하기</span>}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel=""
      >
        <p className={styles.title}>
          레포지토리 카드 추출
          <XMarkIcon onClick={closeModal} />
        </p>
        <div className={styles["kind-select"]}>
          <div className={styles["btn-div"]}>
            <button
              onClick={() => setShowKind(!showKind)}
              className={styles["cur-kind"]}
            >
              {kind}
              {!showKind && <ChevronDownIcon />}
              {showKind && <ChevronUpIcon />}
            </button>
          </div>

          {showKind && (
            <ul className={styles.option}>
              <li id="레포 카드" onClick={onClickKindItem}>
                레포 카드
              </li>
              {isTeam && (
                <li id="개인 레포 카드" onClick={onClickKindItem}>
                  개인 레포 카드
                </li>
              )}
            </ul>
          )}
        </div>
        {kind === "레포 카드" && (
          <p className={styles.comment}>
            <p>
              레포 카드를 통해 레포지토리의 정보를 한 눈에 확인할 수 있습니다.
            </p>
            <p>README에 URL을 입력하면, 레포 카드를 생성할 수 있습니다.</p>
          </p>
        )}
        {kind === "개인 레포 카드" && (
          <p className={styles.comment}>
            <p>
              개인 레포 카드를 통해 나의 기여 정보를 한 눈에 확인할 수 있습니다.
            </p>
            <p>README에 URL을 입력하면, 개인 레포 카드를 생성할 수 있습니다.</p>
          </p>
        )}
        <p className={styles.exam}>
          <span>*</span> {"하단의 예시 카드를 누르면 URL이 복사됩니다."}
        </p>
        {kind === "개인 레포 카드" && (
          <>
            <p className={styles["set-lan-title"]}>언어 설정</p>
            <p className={styles["set-lan-com"]}>
              카드에 표시할 언어를 최대 6개까지 선택해주세요.
            </p>
            <div className={styles["set-lan-div"]}>
              {lans?.map((lan, index) => (
                <span
                  key={index}
                  onClick={() => onClickLan(lan)}
                  className={
                    selected.includes(lan) ? styles.selected : undefined
                  }
                >
                  {lan}
                </span>
              ))}
            </div>
            {selected.length >= 1 && (
              <div className={styles["btn-div"]}>
                <button className={styles.clear} onClick={onClickClearBtn}>
                  취소
                </button>
                <button className={styles.apply} onClick={onClickApplyBtn}>
                  적용
                </button>
              </div>
            )}
            <p className={styles["set-lan-title"]}>적용 중인 언어</p>
            <p className={styles["lan-div"]}>
              {applied.length > 0 &&
                applied.map((lan, index) => (
                  <span
                    key={index}
                    style={
                      languageColor[lan].color
                        ? {
                            backgroundColor: languageColor[lan].color as string,
                          }
                        : { backgroundColor: "gray" }
                    }
                  >
                    {lan}
                  </span>
                ))}
              {applied.length === 0 && (
                <p>카드를 추출하려면 언어를 설정해주세요.</p>
              )}
            </p>
          </>
        )}

        {updateRepoPersonalLoading && (
          <div className={styles["spinner-div"]}>
            <LoadingSpinner ml={3} mr={3} size={5} />
          </div>
        )}
        {!updateRepoPersonalLoading && kind === "개인 레포 카드" && (
          <div
            style={
              kind === "개인 레포 카드"
                ? { display: "hidden" }
                : { display: "block" }
            }
            className={styles["card-div"]}
            onClick={onClickCopy}
          >
            <ReactMarkdown>{personalSource}</ReactMarkdown>
          </div>
        )}
        {kind === "레포 카드" && (
          <div
            style={
              kind === "레포 카드"
                ? { display: "hidden" }
                : { display: "block" }
            }
            className={styles["card-div"]}
            onClick={onClickCopy}
          >
            <ReactMarkdown>{teamSource}</ReactMarkdown>
          </div>
        )}
        <p className={styles.docs}>
          추가적인 정보는 <Link href="/docs/#RepoTeamCard">Docs</Link>를
          참고해주세요.
        </p>
      </Modal>
    </>
  );
};

export default ExportModal;
