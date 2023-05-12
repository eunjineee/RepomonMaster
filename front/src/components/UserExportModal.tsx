"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { XMarkIcon } from "@heroicons/react/24/solid";
import styles from "./UserExportModal.module.scss";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { languageColor } from "@/styles/colors";

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
    height: "470px",
  },
};

const UserExportModal = ({ userId }: { userId: string }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const cardSource = `![RepomonUserCard](https://repomon.kr/card/user?userId=${userId})`;
  const [applied, setApplied] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  /** ============================== 함수, Event Handler ============================== */
  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {};

  const closeModal = () => {
    setIsOpen(false);
  };

  /** ============================== Axios ============================== */

  return (
    <>
      <button className={styles.open}>추출하기</button>
      <div
        className={`${styles.userCardExport} border-2 rounded-lg flex justify-center my-2 py-1 font-bold`}
        onClick={openModal}
      >
        <p>Export User Card</p>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel=""
      ></Modal>
    </>
  );
};

export default UserExportModal;
