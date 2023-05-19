"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "./MatchModal.module.scss";
import { axiosRequestMatchBattle } from "@/api/repoBattle";
import { RepomonType } from "@/types/repoDetail";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { pretreatModelUrl } from "@/app/utils/PretreatModelUrl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { customAlert } from "@/app/utils/CustomAlert";

const customStyles = {
  content: {
    zIndex: "10000000",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "320px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgb(200, 200, 200)",
    backgroundColor: "rgb(30, 30, 30)",
  },
};

const MatchModal = ({ repoId }: { repoId: string }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [oppoRepoId, setOppoRepoId] = useState<number>();
  const [oppoInfo, setOppoInfo] = useState<RepomonType>();
  const router = useRouter();

  /** ============================== useEffect ============================== */
  useEffect(() => {
    if (oppoRepoId && oppoInfo) {
      setIsOpen(true);
    }
  }, [oppoRepoId, oppoInfo]);

  useEffect(() => {}, []);

  /** ============================== 함수, Event Handler ============================== */
  const closeModal = () => {
    setIsOpen(false);
  };

  const afterOpenModal = () => {
    setTimeout(() => {
      router.push(`repo/${repoId}/repoBattle/${oppoRepoId}`);
    }, 2000);
  };

  const onClickMatchBtn = async () => {
    requestMatchBattle();
  };

  /** ============================== Axios ============================== */
  const requestMatchBattle = async () => {
    try {
      const res = await axiosRequestMatchBattle(repoId);
      setOppoInfo(res.data.data.repomon);
      setOppoRepoId(res.data.data.repoId);
      setIsOpen(true);
    } catch (err) {
      console.error(err);
      customAlert("매칭 상대가 없습니다.");
    }
  };

  return (
    <div>
      <button onClick={onClickMatchBtn} className={styles["match-btn"]}>
        배틀 매칭
        <span>
          <ChevronDoubleRightIcon />
        </span>
      </button>
      {oppoRepoId && oppoInfo && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          onAfterOpen={afterOpenModal}
          style={customStyles}
          contentLabel=""
        >
          <div className={styles.oppo}>
            <span>VS</span>
            <Image
              alt="상대 레포몬"
              src={`/static/models_png/${pretreatModelUrl(
                oppoInfo.repomonUrl
              )}.png`}
              width={100}
              height={100}
            ></Image>
          </div>
          <p className={styles.notice}>상대 정보를 불러오고 있습니다.</p>
        </Modal>
      )}
    </div>
  );
};

export default MatchModal;
