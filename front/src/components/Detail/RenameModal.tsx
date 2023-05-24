"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { customAlert } from "@/app/utils/CustomAlert";
import styles from "./RenameModal.module.scss";
import {
  axiosRequestChangeNickname,
  axiosRequestCheckNicknameDuplicated,
} from "@/api/repoDetail";

const customStyles = {
  content: {
    zIndex: "10000000",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "370px",
    height: "190px",
  },
};

const RenameModal = ({
  repoId,
  setIsUpdated,
}: {
  repoId: string;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [nickName, setNickName] = useState<string>("");
  const [isDuplicated, setIsDuplicated] = useState<boolean>(true);

  /** ============================== useEffect ============================== */
  useEffect(() => {}, []);

  /** ============================== 함수, Event Handler ============================== */
  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {};

  const closeModal = () => {
    setIsDuplicated(true);
    setIsOpen(false);
  };

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDuplicated(true);

    setNickName(e.target.value);
  };

  const onClickCheckBtn = () => {
    if (nickName.length > 10) {
      customAlert("10자 이하로 입력해주세요.");
      return;
    }

    requestCheckNicknameDuplicated();
  };

  const onClickApplyBtn = () => {
    if (isDuplicated) {
      customAlert("중복체크를 완료해주세요.");
      return;
    }

    requestChangeNickname();
  };

  /** ============================== Axios ============================== */
  const requestCheckNicknameDuplicated = async () => {
    try {
      const res = await axiosRequestCheckNicknameDuplicated(nickName);
      setIsDuplicated(false);
    } catch (err) {
      customAlert("중복된 레포몬 닉네임입니다.");
    }
  };

  const requestChangeNickname = async () => {
    try {
      const res = await axiosRequestChangeNickname(
        parseInt(repoId, 10),
        nickName
      );
      setIsUpdated((prev) => !prev);
      closeModal();
    } catch (err) {}
  };

  return (
    <div>
      <Cog8ToothIcon
        onClick={openModal}
        type="button"
        className={styles.open}
      />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel=""
      >
        <p className={styles.title}>
          <span>레포몬 닉네임 변경</span>
          <XMarkIcon onClick={closeModal} />
        </p>
        <div className={styles["input-div"]}>
          <input type="text" onChange={onChangeNickname} />
          {isDuplicated && (
            <button className={styles.check} onClick={onClickCheckBtn}>
              중복 확인
            </button>
          )}
          {!isDuplicated && <p className={styles.checked}>중복체크 완료</p>}
        </div>
        <div className={styles["apply-div"]}>
          <button className={styles.apply} onClick={onClickApplyBtn}>
            적용
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RenameModal;
