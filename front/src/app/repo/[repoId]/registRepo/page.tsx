"use client";
import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import styles from "./page.module.scss";
import Image from "next/image";
import {
  conventionType,
  PageProps,
  RandomRepoType,
  Todo,
} from "@/types/repoRegist";
import "animate.css";
import GitTable from "@/components/GitTable";
import Button_OK from "@/components/Button_OK";
import Button_NO from "@/components/Button_NO";
import {
  getRandomRepo,
  getRepoDetail,
  setCommitConvention,
  setRepoInit,
} from "@/api/userRepo";
import { Canvas } from "@react-three/fiber";
import { Model1 } from "./Model1";
import { Model2 } from "./Model2";
import { Model3 } from "./Model3";
import InputField from "@/components/UI/InputField";
import { RepoInitType } from "@/types/repoRegist";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import ArrowDown from "@/components/UI/ArrowDown";
import StatsChart from "./StatsChart";
import { statsData } from "@/types/repoInfo";
import { pretreatModelUrl } from "@/app/utils/PretreatModelUrl";

const Page: NextPage<PageProps> = ({ params }) => {
  const [numArr, setNumArr] = useState([0, 0, 0, 0, 0]);
  const dice = useRef<HTMLImageElement>(null);
  const diceShadow = useRef<HTMLDivElement>(null);
  const [repoName, setRepoName] = useState<string>("");
  const [selectedChar, setSelectedChar] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [repoInitData, setRepoInitData] = useState<RepoInitType>({
    repoId: parseInt(params.repoId),
    repomonId: 0,
    repomonNickname: "",
    startAtk: 0,
    startCritical: 0,
    startDef: 0,
    startDodge: 0,
    startHit: 0,
  });
  const [conventionData, setConventionData] = useState<conventionType[]>([
    { type: "", desc: "" },
  ]);

  const router = useRouter();
  const localUserId = localStorage.getItem("userId");

  // 레포 정보 조회
  useEffect(() => {
    getRepoDetail(parseInt(params.repoId))
      .then((response) => {
        const res = response.data;
        setRepoName(res.repoName);
        console.log("레포 정보 조회: ", repoName);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 이름 설정 시 유효성 검사
  async function handlePostClick() {
    if (isReady && selectedChar !== 0) {
      setRepoInit(repoInitData);
      setCommitConvention(conventionData, parseInt(params.repoId));
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
        router.push(`/user/${localUserId}`);
      }, 2000);
      console.log("post done");
    } else {
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
  }

  // 레포지토리 초기 설정값
  useEffect(() => {
    setRepoInitData({
      repoId: parseInt(params.repoId),
      repomonId: selectedChar,
      repomonNickname: repoName,
      startAtk: numArr[0],
      startCritical: numArr[3],
      startDef: numArr[2],
      startDodge: numArr[1],
      startHit: numArr[4],
    });
  }, [numArr, repoName, selectedChar]);

  useEffect(() => {
    console.log("레포데이터", repoInitData);
  }, [repoInitData]);

  // 난수 생성 후 Stats 설정
  function generateRandomNumArr() {
    const MAX_VALUE = 10;
    const MIN_VALUE = 1;
    const NUM_ELEMENTS = 5;
    const MAX_SUM = 31;

    let sum = 0;
    let newArr = [];
    let i = 0;

    // 무작위로 요소의 값을 지정하되, 요소의 합이 MAX_SUM 이하가 되도록 한다.
    while (i < NUM_ELEMENTS) {
      // 다음 요소에 지정될 값의 범위를 설정한다.
      const remainingElements = NUM_ELEMENTS - i;
      const minValue = Math.max(
        MIN_VALUE,
        MAX_SUM - sum - MAX_VALUE * remainingElements
      );
      const maxValue = Math.min(
        MAX_VALUE,
        MAX_SUM - sum - MIN_VALUE * remainingElements
      );

      // 요소의 값을 무작위로 선택한다.
      const newValue =
        Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

      // 새로운 요소를 배열에 추가한다.
      newArr.push(newValue);

      // 합을 계산한다.
      sum += newValue;
      i++;
    }

    // 배열을 설정한다.
    setNumArr(newArr);
  }

  // 주사위 클릭 시 실행
  const diceClick = () => {
    const audio = new Audio("/static/sound/Dice.mp3");
    const randomNumArr = numArr.map(() => Math.floor(Math.random() * 10) + 1);
    setNumArr(randomNumArr);
    generateRandomNumArr();

    if (dice.current && diceShadow.current) {
      dice.current.style.transform = `translate(-50%, -300%) rotate(720deg)`;
      dice.current.style.filter = `blur(0.1em)`;
      diceShadow.current.style.transform = "translate(-50%, -50%) scaleX(0.7)";

      setTimeout(() => {
        if (dice.current && diceShadow.current) {
          dice.current.style.transform =
            "translate(-50%, -50%) rotate(-1440deg)";
          dice.current.style.filter = `blur(0em)`;
          diceShadow.current.style.transform =
            "translate(-50%, -50%) scaleX(1)";
        }
        audio.play();
      }, 200);
    }
  };

  const attackRef = useRef<any>(null);
  const avoidanceRef = useRef<any>(null);
  const enduranceRef = useRef<any>(null);
  const criticalRef = useRef<any>(null);
  const hitRef = useRef<any>(null);

  useEffect(() => {
    // numArr의 값이 바뀔 때마다 호출
    const [attack, avoidance, endurance, critical, hit] = numArr;
    // 최대치를 달성하면 해당 숫자의 색깔을 붉은색으로 변경
    if (
      !attackRef.current ||
      !avoidanceRef.current ||
      !enduranceRef.current ||
      !criticalRef.current ||
      !hitRef.current
    )
      return;

    const setStatStyle = (
      stat: number,
      statRef: React.MutableRefObject<any | null>
    ) => {
      const isMax = stat === 10;
      statRef.current!.style.color = isMax ? "red" : "black";
      statRef.current!.style.fontWeight = isMax ? "700" : "500";
      statRef.current!.style.fontSize = isMax ? "1.2em" : "1em";
      if (isMax) {
        statRef.current!.classList.add("animate__animated", "animate__shakeX");
        setTimeout(() => {
          statRef.current!.classList.remove(
            "animate__animated",
            "animate__shakeX"
          );
        }, 80);
      }
    };

    setStatStyle(attack, attackRef);
    setStatStyle(avoidance, avoidanceRef);
    setStatStyle(endurance, enduranceRef);
    setStatStyle(critical, criticalRef);
    setStatStyle(hit, hitRef);
  }, [numArr]);

  // 랜덤 3개의 레포몬 요청
  const [randomRepos, setRandomRepos] = useState<RandomRepoType>({
    selectRepomonList: [
      {
        repomonId: 0,
        repomonUrl: "",
        repomonName: "",
      },
    ],
  });
  const [isClickOne, setIsClickOne] = useState<boolean>(false);
  const [isClickTwo, setIsClickTwo] = useState<boolean>(false);
  const [isClickThree, setIsClickThree] = useState<boolean>(false);
  const [isHoveredOne, setIsHoveredOne] = useState<boolean>(false);
  const [isHoveredTwo, setIsHoveredTwo] = useState<boolean>(false);
  const [isHoveredThree, setIsHoveredThree] = useState<boolean>(false);
  const monRef1 = useRef<HTMLDivElement>(null);
  const monRef2 = useRef<HTMLDivElement>(null);
  const monRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = getRandomRepo()
      .then((response) => {
        const res = response.data.data;
        setRandomRepos(res);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 레포몬 선택 시 스포트라이트
  const [selCharUrl, setSelCharUrl] = useState<string>(
    "/static/models/tempLoader.glb"
  );
  function clickMonHandle(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    refDiv: React.RefObject<HTMLDivElement>
  ) {
    event.preventDefault();
    if (
      refDiv.current &&
      monRef1.current &&
      monRef2.current &&
      monRef3.current
    ) {
      if (refDiv === monRef1) {
        (refDiv.current.style as CSSStyleDeclaration).backgroundColor =
          "rgba(201,199,194,255)";
        (monRef2.current.style as CSSStyleDeclaration).backgroundColor =
          "inherit";
        (monRef3.current.style as CSSStyleDeclaration).backgroundColor =
          "inherit";
        setIsClickOne(true);
        setIsClickTwo(false);
        setIsClickThree(false);
        setSelectedChar(randomRepos?.selectRepomonList[0].repomonId);
        setSelCharUrl(randomRepos?.selectRepomonList[0].repomonUrl);
      } else if (refDiv === monRef2) {
        (refDiv.current.style as CSSStyleDeclaration).backgroundColor =
          "rgba(201,199,194,255)";
        (monRef1.current.style as CSSStyleDeclaration).backgroundColor =
          "inherit";
        (monRef3.current.style as CSSStyleDeclaration).backgroundColor =
          "inherit";
        setIsClickOne(false);
        setIsClickTwo(true);
        setIsClickThree(false);
        setSelectedChar(randomRepos?.selectRepomonList[1].repomonId);
        setSelCharUrl(randomRepos?.selectRepomonList[1].repomonUrl);
      } else if (refDiv === monRef3) {
        (refDiv.current.style as CSSStyleDeclaration).backgroundColor =
          "rgba(201,199,194,255)";
        (monRef1.current.style as CSSStyleDeclaration).backgroundColor =
          "inherit";
        (monRef2.current.style as CSSStyleDeclaration).backgroundColor =
          "inherit";
        setIsClickOne(false);
        setIsClickTwo(false);
        setIsClickThree(true);
        setSelectedChar(randomRepos?.selectRepomonList[2].repomonId);
        setSelCharUrl(randomRepos?.selectRepomonList[2].repomonUrl);
      }
    }
  }
  // Modal
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  const customStyles = {
    content: {
      zIndex: "10_000_000",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "370px",
      height: "190px",
      display: "flex",
      justifyContent: "center",
    },
  };
  const afterOpenModal = () => {};

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    Modal.setAppElement("#pageContainer");
  }, []);

  const setBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isClickOne || isClickTwo || isClickThree) {
      if (setBox.current) {
        const rect = setBox.current.getBoundingClientRect();
        setBox.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        const mediaQuery = window.matchMedia(
          "(min-width: 1160px) and (max-width: 1600px)"
        );
        if (mediaQuery.matches) {
          console.log("125");
          window.scrollBy(0, rect.top - 10);
        } else {
          console.log("100");
          window.scrollBy(0, rect.top - 20);
        }
      }
    }
  }, [isClickOne, isClickTwo, isClickThree]);

  // props consts 모음
  const stats: statsData = {
    attackStat: numArr[0],
    avoidStat: numArr[1],
    enduranceStat: numArr[2],
    criticalStat: numArr[3],
    hitStat: numArr[4],
  };

  return (
    <div className={styles.pageContainer} id="pageContainer">
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel=""
      >
        <p
          className={`text-center flex items-center justify-center text-2xl antialiased font-semibold ${
            isReady ? "text-sky-600" : "text-red-600"
          }`}
        >
          {selectedChar === 0
            ? "레포몬을 선택해주세요"
            : isReady
            ? "레포몬이 등록되었습니다."
            : "레포몬 이름을 확정해주세요"}
        </p>
      </Modal>
      <div className={styles.selectBox}>
        <p
          className={
            isClickOne || isClickTwo || isClickThree
              ? styles.repoTitleSelected
              : styles.repoTitle
          }
        >
          {isClickOne || isClickTwo || isClickThree ? (
            <div style={{ display: "flex" }}>
              <div id={styles.arrowDown}>
                <ArrowDown num={12} />
              </div>
              <p>아래로 이동해 특성을 설정하세요</p>
              <div id={styles.arrowDown}>
                <ArrowDown num={12} />
              </div>
            </div>
          ) : (
            `${repoName}을(를) 대표할 레포몬을 선택해주세요!`
          )}
        </p>
        <div style={{ display: "flex" }}>
          <div
            className={styles.monChar}
            ref={monRef1}
            onClick={(event) => clickMonHandle(event, monRef1)}
            onMouseOver={() => setIsHoveredOne(true)}
            onMouseLeave={() => setIsHoveredOne(false)}
          >
            <Canvas>
              {" "}
              <ambientLight intensity={0.03} />
              <directionalLight
                color={
                  isClickOne || (isHoveredOne && !isClickTwo && !isClickThree)
                    ? "white"
                    : "black"
                }
                position={[0, 0, 5]}
                intensity={0.5}
              />
              <directionalLight
                color={
                  isClickOne || (isHoveredOne && !isClickTwo && !isClickThree)
                    ? "white"
                    : "black"
                }
                position={[-5, 0, -5]}
                intensity={0.5}
              />
              <Model1
                repomonUrl={randomRepos?.selectRepomonList[0]?.repomonUrl}
              />
            </Canvas>
          </div>
          <div
            className={styles.monChar}
            ref={monRef2}
            onClick={(e) => clickMonHandle(e, monRef2)}
            onMouseOver={() => setIsHoveredTwo(true)}
            onMouseLeave={() => setIsHoveredTwo(false)}
          >
            <Canvas>
              {" "}
              <ambientLight intensity={0.03} />
              <directionalLight
                color={
                  isClickTwo || (isHoveredTwo && !isClickOne && !isClickThree)
                    ? "white"
                    : "black"
                }
                position={[0, 0, 5]}
                intensity={0.5}
              />
              <directionalLight
                color={
                  isClickTwo || (isHoveredTwo && !isClickOne && !isClickThree)
                    ? "white"
                    : "black"
                }
                position={[-5, 0, -5]}
                intensity={0.5}
              />
              <Model2
                repomonUrl={randomRepos?.selectRepomonList[1]?.repomonUrl}
              />
            </Canvas>
          </div>
          <div
            className={styles.monChar}
            ref={monRef3}
            onClick={(event) => clickMonHandle(event, monRef3)}
            onMouseOver={() => setIsHoveredThree(true)}
            onMouseLeave={() => setIsHoveredThree(false)}
          >
            <Canvas>
              {" "}
              <ambientLight intensity={0.03} />
              <directionalLight
                color={
                  isClickThree || (isHoveredThree && !isClickOne && !isClickTwo)
                    ? "white"
                    : "black"
                }
                position={[0, 0, 5]}
                intensity={0.5}
              />
              <directionalLight
                color={
                  isClickThree || (isHoveredThree && !isClickOne && !isClickTwo)
                    ? "white"
                    : "black"
                }
                position={[-5, 0, -5]}
                intensity={0.5}
              />
              <Model3
                repomonUrl={randomRepos?.selectRepomonList[2]?.repomonUrl}
              />
            </Canvas>
          </div>
        </div>
      </div>
      <div className={styles.settingBox} ref={setBox}>
        <div className={styles.repomonCanvas}>
          <div
            style={{
              backgroundColor: "#EFF0FF",
              width: "90%",
              height: "80%",
              borderRadius: "10px",
              marginTop: "5%",
            }}
          >
            <Image
              src={`/static/models_png/${pretreatModelUrl(selCharUrl)}.png`}
              sizes="100vw"
              width={0}
              height={0}
              alt="레포몬"
              style={{ width: "100%", height: "100%", borderRadius: "10px" }}
            />
          </div>
        </div>
        <div className={styles.conventionBox}>
          <div
            style={{
              display: "flex",
              marginLeft: "10%",
              marginTop: "5%",
              alignItems: "center",
              fontWeight: "700",
              fontSize: "1.7em",
              color: "#7291fa",
              justifyContent: "flex-start",
            }}
          >
            <p style={{ width: "25%" }} id={styles.repomonNameTitle}>
              레포몬 이름 설정
            </p>
            <InputField setRepoName={setRepoName} setIsReady={setIsReady} />
          </div>
          <div>
            <p style={{ width: "25%" }} id={styles.repomonConventionTitle}>
              컨벤션 초기 등록
            </p>
            <GitTable setConventionData={setConventionData} />
          </div>
        </div>
      </div>
      <div className={styles.diceBlock}>
        <div className={styles.chartBox}>
          <div className={styles.titlebox}>스탯 설정하기</div>
          <div className={styles.chartWrapper}>
            <StatsChart {...stats} />
          </div>
          <div className={styles.statsWrapper}>
            <div className="flex flex-col" style={{ width: "100%" }}>
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="rounded-lg overflow-hidden">
                    <table
                      className="min-w-full border  text-center dark:border-neutral-500  "
                      id={styles.tableText}
                    >
                      <tbody
                        style={{ textAlign: "center", fontSize: "1.2em" }}
                        id={styles.tableBody}
                      >
                        <tr
                          className="border-stone-500 dark:border-neutral-500"
                          style={{ borderWidth: "3px", height: "4em" }}
                        >
                          <td
                            className=" border-stone-500 whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "3px" }}
                            id={styles.tableHead}
                          >
                            공격력
                          </td>
                          <td
                            id={styles.ranNumber}
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={attackRef}
                          >
                            {numArr[0]}
                          </td>
                        </tr>
                        <tr
                          className="border-stone-500 dark:border-neutral-500"
                          style={{ borderWidth: "3px", height: "4em" }}
                        >
                          <td
                            className="border-stone-500 whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "3px" }}
                            id={styles.tableHead}
                          >
                            회피
                          </td>
                          <td
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={avoidanceRef}
                            id={styles.ranNumber}
                          >
                            {numArr[1]}
                          </td>
                        </tr>
                        <tr
                          className="border-stone-500 dark:border-neutral-500"
                          style={{ borderWidth: "3px", height: "4em" }}
                        >
                          <td
                            className=" border-stone-500 whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "3px" }}
                            id={styles.tableHead}
                          >
                            방어력
                          </td>
                          <td
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={enduranceRef}
                            id={styles.ranNumber}
                          >
                            {numArr[2]}
                          </td>
                        </tr>
                        <tr
                          className="border-stone-500 dark:border-neutral-500"
                          style={{ borderWidth: "3px", height: "4em" }}
                        >
                          <td
                            className="border-stone-500 whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "3px" }}
                            id={styles.tableHead}
                          >
                            치명타
                          </td>
                          <td
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={criticalRef}
                            id={styles.ranNumber}
                          >
                            {numArr[3]}
                          </td>
                        </tr>
                        <tr
                          className="border-stone-500 dark:border-neutral-500"
                          style={{ borderWidth: "3px", height: "4em" }}
                        >
                          <td
                            className="border-stone-500 whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "3px" }}
                            id={styles.tableHead}
                          >
                            명중수치
                          </td>
                          <td
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={hitRef}
                            id={styles.ranNumber}
                          >
                            {numArr[4]}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.diceBox}>
          <p className={styles.diceTitle}>초기 능력치 설정</p>
          <div className={styles.diceBox} style={{ marginBottom: "15%" }}>
            <Image
              src="/static/images/dice.png"
              alt="dice"
              width={200}
              height={200}
              className={styles[`dice`]}
              onClick={diceClick}
              ref={dice}
            />
            <div className={styles.diceShadow} ref={diceShadow} />
          </div>
          <p className={styles.diceDetail}>
            주사위를 굴려 초기 능력치를 설정하세요!
          </p>
        </div>
      </div>
      <div style={{ display: "flex", marginBlock: "3%" }}>
        <div onClick={handlePostClick}>
          <Button_OK msg={"결정하기"} />
        </div>
        <div
          onClick={() => {
            router.push(`/user/${localUserId}`);
          }}
        >
          <Button_NO msg={"취소하기"} />
        </div>
      </div>
    </div>
  );
};

export default Page;
