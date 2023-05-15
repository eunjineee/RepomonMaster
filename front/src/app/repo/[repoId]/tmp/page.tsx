"use client";

import DetailRepomon from "@/components/Detail/DetailRepomon";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import Modal from "react-modal";
import ExportModal from "@/components/Detail/ExportModal";
import Spinner from "@/components/Spinner";
import LoadingSpinner from "@/components/Skeletons/LoadingSpinner";
import DetailConvention from "@/components/Detail/DetailConvention";
import { RepoDetailConventionInfoType } from "@/types/repoDetail";
import { axiosRequestRepoDetailConvention } from "@/api/repoDetail";
import MatchModal from "@/components/Detail/MatchModal";
import { HeartIcon } from "@heroicons/react/24/solid";

function Page() {
  const [repomonUrl, setRepomonUrl] = useState(
    "https://repomon.s3.ap-northeast-2.amazonaws.com/models/Dora_1.glb"
  );
  const [repomonTier, setrepomonTier] = useState(1);
  const [repoDetailConventionInfo, setRepoDetailConventionInfo] =
    useState<RepoDetailConventionInfoType>();

  const [cardUpdated, setCardUpdated] = useState<number>(2);
  const [exportModalIsOpen, setExportModalIsOpen] = useState<boolean>(false);
  const openModal = () => {
    setExportModalIsOpen(true);
  };

  const closeModal = () => {
    setExportModalIsOpen(false);
  };

  const divRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   Modal.setAppElement("#repo-detail");
  //   requestRepoDetailConvention(4);
  // }, []);

  // const requestRepoDetailConvention = async (repoId: number) => {
  //   try {
  //     const res = await axiosRequestRepoDetailConvention(repoId);
  //     console.log("레포 디테일 컨벤션: ", res);
  //     setRepoDetailConventionInfo(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const onClickSibal = () => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.pageContainer} id="repo-detail">
      <HeartIcon style={{ color: "red" }} />
      <button onClick={onClickSibal}>시발</button>
      {/* <div className={styles.info}>
        <div className={styles["repo-mon-card-div"]}>
          <div className={styles["repo-mon-card"]}> */}
      {/* <DetailRepomon repomonUrl={repomonUrl} repomonTier={repomonTier} /> */}
      {/* </div>
        </div>
      </div> */}
      {/* <button className={styles.btn}>
        <LoadingSpinner ml={4} mr={4} size={6} />
      </button> */}
      {/* <ExportModal
        repoId={4}
        userId={3}
        isTeam={true}
        lans={[
          "TypeScript",
          "Java",
          "Dockerfile",
          "CSS",
          "Shell",
          "SCSS",
          "JavaScript",
          "HTML",
        ]}
      /> */}
      <MatchModal repoId={"4"} />
      <div style={{ height: "500px" }}></div>
      <div
        ref={divRef}
        style={{ height: "500px", backgroundColor: "skyblue" }}
      ></div>
    </div>
  );
}

export default Page;
