"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/24/solid";
import styles from "./ExportModal.module.scss";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";

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
    height: "500px",
  },
};

const ExportModal = ({
  repoId,
  userId,
  isTeam,
}: {
  repoId: number;
  userId: number;
  isTeam: boolean;
}) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [kind, setKind] = useState<string>("레포 카드");
  const [showKind, setShowKind] = useState<boolean>(false);
  const [markdownSource, setMarkdownSource] = useState<string>(
    `![RepomonRepoCard](https://repomon.kr/card/repo?repoId=${repoId}`
  );

  /** ============================== useEffect ============================== */

  useEffect(() => {
    if (isTeam) {
      setMarkdownSource(markdownSource + `&userId=${userId})`);
    } else {
      setMarkdownSource(markdownSource + `)`);
    }
  }, []);

  /** ============================== 함수, Event Handler ============================== */
  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {};

  const closeModal = () => {
    setIsOpen(false);
  };

  const onClickKindItem = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLElement;
    setKind(target.id);
    setShowKind(false);
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
            {isTeam && (
              <li id="개인 레포 카드" onClick={onClickKindItem}>
                개인 레포 카드
              </li>
            )}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default ExportModal;
