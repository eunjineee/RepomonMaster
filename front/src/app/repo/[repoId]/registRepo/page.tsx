"use client";
import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import styles from "./page.module.scss";
import Image from "next/image";
import { PageProps, RandomRepoType, Todo } from "@/types/repoRegist";
import "animate.css";
import GitTable from "@/components/GitTable";
import Button_OK from "@/components/Button_OK";
import Button_NO from "@/components/Button_NO";
import { getRandomRepo } from "@/api/userRepo";
import { Canvas } from "@react-three/fiber";
import { Model1 } from "./Model1";
import { Model2 } from "./Model2";
import { Model3 } from "./Model3";
import InputField from "@/components/UI/InputField";

const Page: NextPage<PageProps> = ({ params }) => {
  const [numArr, setNumArr] = useState([0, 0, 0, 0, 0]);
  const dice = useRef<HTMLImageElement>(null);
  const diceShadow = useRef<HTMLDivElement>(null);

  // Post 데이터
  const [repoName, setRepoName] = useState<string>("");
  useEffect(() => {
    console.log(repoName);
  }, [repoName]);

  function generateRandomNumArr() {
    const MAX_VALUE = 10;
    const MIN_VALUE = 1;
    const NUM_ELEMENTS = 5;
    const MAX_SUM = 30;

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
      dice.current.style.transform = `translate(-50%, -250%) rotate(720deg)`;
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
      statRef.current!.style.color = isMax ? "red" : "white";
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
  const [randomRepos, setRandomRepos] = useState<RandomRepoType>();
  const [isHoverOne, setIsHoverOne] = useState<boolean>(false);
  const [isClickOne, setIsClickOne] = useState<boolean>(false);
  const [isClickTwo, setIsClickTwo] = useState<boolean>(false);
  const [isClickThree, setIsClickThree] = useState<boolean>(false);
  const [isHoverTwo, setIsHoverTwo] = useState<boolean>(false);
  const [isHoverThree, setIsHoverThree] = useState<boolean>(false);
  const [selectedRef, setSelectedRef] =
    useState<React.RefObject<HTMLDivElement>>();
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
  function clickMonHandle(refDiv: React.RefObject<HTMLDivElement>) {
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
      }
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.selectBox}>
        <p className={styles.repoTitle}>함께할 레포몬을 선택해주세요!</p>
        <div style={{ display: "flex" }}>
          <div
            className={styles.monChar}
            ref={monRef1}
            onClick={() => clickMonHandle(monRef1)}
          >
            <Canvas>
              {" "}
              <ambientLight intensity={0.1} />
              <ambientLight intensity={0.1} />
              <directionalLight
                color={isClickOne ? "white" : "black"}
                position={[0, 0, 5]}
                intensity={0.5}
              />
              <directionalLight
                color={isClickOne ? "white" : "black"}
                position={[-5, 0, -5]}
                intensity={0.5}
              />
              <Model1
                repomonUrl={randomRepos?.selectRepomonList[0].repomonUrl || ""}
              />
            </Canvas>
          </div>
          <div
            className={styles.monChar}
            ref={monRef2}
            onClick={() => clickMonHandle(monRef2)}
          >
            <Canvas>
              {" "}
              <ambientLight intensity={0.1} />
              <ambientLight intensity={0.1} />
              <directionalLight
                color={isClickTwo ? "white" : "black"}
                position={[0, 0, 5]}
                intensity={0.5}
              />
              <directionalLight
                color={isClickTwo ? "white" : "black"}
                position={[-5, 0, -5]}
                intensity={0.5}
              />
              <Model2
                repomonUrl={randomRepos?.selectRepomonList[1].repomonUrl || ""}
              />
            </Canvas>
          </div>
          <div
            className={styles.monChar}
            ref={monRef3}
            onClick={() => clickMonHandle(monRef3)}
          >
            <Canvas>
              {" "}
              <ambientLight intensity={0.1} />
              <ambientLight intensity={0.1} />
              <directionalLight
                color={isClickThree ? "white" : "black"}
                position={[0, 0, 5]}
                intensity={0.5}
              />
              <directionalLight
                color={isClickThree ? "white" : "black"}
                position={[-5, 0, -5]}
                intensity={0.5}
              />
              <Model3
                repomonUrl={randomRepos?.selectRepomonList[2].repomonUrl || ""}
              />
            </Canvas>
          </div>
        </div>
      </div>
      <div className={styles.settingBox}>
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
            <p style={{ width: "25%" }}>레포몬 이름 설정</p>
            <InputField setRepoName={setRepoName} />
          </div>
          <GitTable />
        </div>
        <div className={styles.diceContainer}>
          <p className={styles.diceTitle}>초기 능력치 설정</p>
          <div className={styles.diceBox} style={{ marginBottom: "15%" }}>
            <Image
              src="/static/images/dice.png"
              alt="dice"
              width={100}
              height={100}
              className={styles[`dice`]}
              onClick={diceClick}
              ref={dice}
            />
            <div className={styles.diceShadow} ref={diceShadow} />
          </div>
          <div className={styles.statusBox}>
            <div className="flex flex-col" style={{ width: "80%" }}>
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="rounded-lg overflow-hidden">
                    <table
                      className="min-w-full border  text-center dark:border-neutral-500  "
                      id={styles.tableText}
                    >
                      <tbody
                        style={{ textAlign: "center" }}
                        id={styles.tableBody}
                      >
                        <tr
                          className="border-white dark:border-neutral-500"
                          style={{ borderWidth: "5px", height: "4em" }}
                        >
                          <td
                            className=" border-white whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "5px" }}
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
                          className="border-white dark:border-neutral-500"
                          style={{ borderWidth: "5px", height: "4em" }}
                        >
                          <td
                            className="border-white whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "5px" }}
                          >
                            회피
                          </td>
                          <td
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={avoidanceRef}
                          >
                            {numArr[1]}
                          </td>
                        </tr>
                        <tr
                          className="border-white dark:border-neutral-500"
                          style={{ borderWidth: "5px", height: "4em" }}
                        >
                          <td
                            className=" border-white whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "5px" }}
                          >
                            방어력
                          </td>
                          <td
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={enduranceRef}
                          >
                            {numArr[2]}
                          </td>
                        </tr>
                        <tr
                          className="border-white dark:border-neutral-500"
                          style={{ borderWidth: "5px", height: "4em" }}
                        >
                          <td
                            className="border-white whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "5px" }}
                          >
                            치명타
                          </td>
                          <td
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={criticalRef}
                          >
                            {numArr[3]}
                          </td>
                        </tr>
                        <tr
                          className="border-white dark:border-neutral-500"
                          style={{ borderWidth: "5px", height: "4em" }}
                        >
                          <td
                            className="border-white whitespace-nowrap border-r px-6 py-4  dark:border-neutral-500"
                            style={{ width: "50%", borderWidth: "5px" }}
                          >
                            명중수치
                          </td>
                          <td
                            className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                            ref={hitRef}
                          >
                            {numArr[4]}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      style={{
                        fontSize: "0.8em",
                        color: "#4e4e4e",
                        textAlign: "center",
                        marginTop: "5%",
                      }}
                    >
                      <p>(모든 능력치는 1~10 사이의 무작위 수치로 설정되며)</p>
                      <p>(5개 능력치의 총합은 30 이하입니다.)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginBlock: "3%" }}>
        <Button_OK msg={"결정하기"} />
        <Button_NO msg={"취소하기"} />
      </div>
    </div>
  );
};

export default Page;
