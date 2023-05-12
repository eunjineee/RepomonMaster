"use client";

import { requestMatchResult } from "@/api/repoBattle";
import Spinner from "@/components/Spinner";
import { BattleResultResponseDataType, ScriptType } from "@/types/repoBattle";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import styles from "./page.module.scss";
import * as THREE from "three";
import { Html, OrbitControls } from "@react-three/drei";
import Loader from "@/components/threeLoader";
import HpBar from "@/components/HpBar";
import Image from "next/image";
import Lottie from "react-lottie-player";
import lottieJson from "public/static/lotties/battle.json";
import Panpare from "public/static/lotties/panpare.json";
import { BattleLogType } from "@/types/repoBattle";
import SoundOff from "@/components/UI/SoundOff";
import SoundOn from "@/components/UI/SoundOn";
import Modal from "react-modal";
import { useRouter } from "next/navigation";

const Page = () => {
  const [loadData, setLoadData] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<BattleResultResponseDataType>();
  const [opHp, setopHp] = useState<number | undefined>(
    matchData?.data.defenseRepo.hp
  );
  const firstMyHp: number | undefined = matchData?.data.attackRepo.hp;
  const firstOpHp: number | undefined = matchData?.data.defenseRepo.hp;
  const [myHp, setmyHp] = useState<number | undefined>(
    matchData?.data.attackRepo.hp
  );
  const router = useRouter();

  // 내 레포몬 출력
  const Model = (props: { url?: string }) => {
    const gltf = useLoader(GLTFLoader, props.url + "?id=1" ?? "");

    let mixer: THREE.AnimationMixer | undefined;
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.timeScale = 1;

      let clipIndex = 8;
      if (gltf.animations.length > clipIndex) {
        const action = mixer.clipAction(gltf.animations[clipIndex]);
        if (doMyAttack) {
          clipIndex = 11;
        }
        action.play();
      } else {
        console.warn("Animation clip not found");
      }
    }

    useFrame((state, delta) => {
      mixer?.update(delta);
    });

    return (
      <primitive
        object={gltf.scene}
        scale={[9, 9, 9]}
        position={[-4, -6, 0]}
        rotation={[0, 15, 0]}
      />
    );
  };

  // 상대 레포몬 출력
  const SecondModel = (props: { url?: string }) => {
    const gltf = useLoader(GLTFLoader, props.url + "?id=2" ?? "");

    let mixer: THREE.AnimationMixer | undefined;

    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.timeScale = 1;

      let clipIndex = 8;
      if (gltf.animations.length > clipIndex) {
        const action = mixer.clipAction(gltf.animations[clipIndex]);
        if (doMyAttack) {
          clipIndex = 11;
        }
        action.play();
      } else {
        console.warn("Animation clip not found");
      }
    }

    useFrame((state, delta) => {
      mixer?.update(delta);
    });

    return (
      <primitive
        object={gltf.scene}
        scale={[3, 3, 3]}
        position={[5, 0, 0]}
        rotation={[0, 5, 0]}
      />
    );
  };

  const customStyles: Modal.Styles = {
    content: {
      zIndex: 99999,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "500px",
      height: "250px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  const EndModal = () => {
    return (
      <Html style={{ position: "relative", zIndex: 999 }}>
        {modalIsOpen && (
          <div>
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel=""
            >
              <div>
                <p
                  style={{
                    fontSize: "1.5em",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  게임 종료
                </p>
                <div style={{ display: "flex" }}>
                  <Lottie
                    loop={true}
                    animationData={Panpare}
                    play
                    style={{
                      position: "absolute",
                      width: "5em",
                      height: "5em",
                      left: "2em",
                      top: "5.5em",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "2.5em",
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#1dbabf",
                    }}
                  >
                    승리했습니다!
                  </p>
                  <Lottie
                    loop={true}
                    animationData={Panpare}
                    play
                    style={{
                      position: "absolute",
                      width: "5em",
                      height: "5em",
                      right: "2em",
                      top: "5.5em",
                      transform: "scaleX(-1)",
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  router.push("/");
                }}
                style={{ fontWeight: "600", marginTop: "2em", width: "auto" }}
              >
                <p id={styles.backTo}>유저 페이지로</p>
              </button>
            </Modal>
          </div>
        )}
      </Html>
    );
  };
  const MyUI = () => {
    return (
      <Html style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: "10px",
            width: "550px",
            height: "150px",
            fontSize: "24px",
            color: "black",
            backgroundColor: "white",
            border: "10px double black",
            padding: "20px",
            fontFamily: "NeoDunggeunmo",
            zIndex: 10,
          }}
        >
          내 레포명: {matchData?.data.attackRepo.repomonNickname} <br />
          HP :{myHp && Math.ceil(myHp)} / {firstMyHp}
          <HpBar
            HP={Number(myHp)}
            maxHP={Number(matchData?.data.attackRepo.hp)}
          />
        </div>
      </Html>
    );
  };
  const OpUI = () => {
    return (
      <Html style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            bottom: "70px",
            right: "10px",
            width: "550px",
            height: "150px",
            fontSize: "24px",
            color: "black",
            backgroundColor: "white",
            border: "10px double black",
            padding: "20px",
            fontFamily: "NeoDunggeunmo",
            zIndex: 10,
          }}
        >
          상대 레포명: {matchData?.data.defenseRepo.repomonNickname} <br />
          HP : {opHp && Math.ceil(opHp)} / {firstOpHp}
          <HpBar
            HP={Number(opHp)}
            maxHP={Number(matchData?.data.defenseRepo.hp)}
          />
        </div>
      </Html>
    );
  };

  // 애니메이션 제어 테스트
  const [doMyAttack, setDoMyAttack] = useState<boolean>(false);
  const [doAttack, setDoAttack] = useState<boolean>(false);
  let oppoId = 3;
  let myId = 6;
  function getMatchResult() {
    // oppo - my
    return requestMatchResult(oppoId, myId);
  }

  useEffect(() => {
    getMatchResult()
      .then((response) => {
        const data = response.data;
        setMatchData(data);
        setLoadData(true);
        console.log("매치 정보", data);
        setopHp(data?.data.defenseRepo.hp);
        setmyHp(data?.data.attackRepo.hp);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // audio control
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    const playAudio = () => {
      audio?.play();
      document.removeEventListener("click", playAudio);
      document.removeEventListener("keydown", playAudio);
    };

    document.addEventListener("click", playAudio);
    document.addEventListener("keydown", playAudio);
  }, []);

  const [soundOn, setSoundOn] = useState<boolean>(true);

  // 초기화면
  const gameWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameWrapper.current) {
      gameWrapper.current.style.opacity = "0";
      gameWrapper.current.style.transition = "all 2s ease-in-out";
    }
    setTimeout(() => {
      if (gameWrapper.current) {
        gameWrapper.current.style.opacity = "1";
        gameWrapper.current.style.zIndex = "0";
      }
    }, 2600);
  }, []);

  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const playerRef = useRef<any>(null);

  const handleAnimationComplete = () => {
    setIsAnimationFinished(true);
  };

  // 배틀 게임 로직
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [currentLog, setCurrentLog] = useState<string>("");
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const myNick = matchData?.data.attackRepo.repomonNickname;
  const oppoNick = matchData?.data.defenseRepo.repomonNickname;

  const initialState: ScriptType[] =
    matchData?.data?.battleLog?.map((log: BattleLogType) => ({
      turn: `${log.turn}번째 턴!`,
      attackerScript: `${matchData.data.battleLog[currentIndex].attack_log}`,
      defenderScript: `${matchData.data.battleLog[currentIndex].defense_log}`,
      damageScript: log.damage === 0 ? `워후...빨랐다...` : `(체력 감소)`,
    })) ?? [];
  const currentScript = initialState[currentIndex];

  useEffect(() => {
    if (currentScript) {
      if (logIndex === 0) {
        setCurrentLog(currentScript.turn);
      } else if (logIndex === 1) {
        setCurrentLog(currentScript.attackerScript);
      } else if (logIndex === 2) {
        setCurrentLog(currentScript.defenderScript);
      } else if (logIndex === 3) {
        setCurrentLog(currentScript.damageScript);
        if (matchData?.data.battleLog[currentIndex].defender === oppoId) {
          // 상대 HP 깎기
          if (opHp && matchData)
            setopHp(opHp - matchData.data.battleLog[currentIndex].damage);
          setLogIndex(-1);
        } else if (matchData?.data.battleLog[currentIndex].defender === myId) {
          // 내 HP 깎기
          if (myHp && matchData)
            setmyHp(myHp - matchData.data.battleLog[currentIndex].damage);
          setLogIndex(-1);
        }
      }
    }
  }, [logIndex, currentScript]);

  useEffect(() => {
    console.log("체력 비교: ", opHp, " : ", myHp);
  }, [opHp, myHp]);

  function handleNext() {
    console.log("cur_index", currentIndex);
    if ((logIndex + 1) % 4 == 0) {
      if (currentIndex !== 9) setCurrentIndex(currentIndex + 1);
      else {
        setIsOpen(true);
        return;
      }
    }

    setLogIndex((logIndex + 1) % 4);
  }
  console.log("스크립트 데이터 확인: ", initialState);
  // 종료 모달

  const afterOpenModal = () => {};

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    Modal.setAppElement("#pageContainer");
  }, []);

  return (
    <div id="pageContainer">
      {soundOn && (
        <audio ref={audioRef} src="/static/sound/battle.mp3" autoPlay />
      )}

      <div className={styles.pageContainer}>
        {!isAnimationFinished && (
          <Lottie
            ref={playerRef}
            loop={false}
            animationData={lottieJson}
            play
            onComplete={handleAnimationComplete}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        <>
          <div className={styles.gameWrapper} ref={gameWrapper}>
            <div className={styles.gameBox}>
              <div
                onClick={() => setSoundOn(!soundOn)}
                style={{
                  cursor: "pointer",
                  marginLeft: "2em",
                  position: "absolute",
                  zIndex: 9999,
                  top: "1em",
                  right: "2em",
                }}
              >
                {soundOn ? <SoundOn /> : <SoundOff />}
              </div>
              <Canvas
                style={{
                  // backgroundImage: `url('/static/images/forestBack.jpg')`,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <Suspense fallback={<Loader />}>
                  <ambientLight intensity={0.5} />
                  <directionalLight
                    color="white"
                    position={[5, 0, 5]}
                    intensity={0.6}
                  />
                  <Model url={matchData?.data.attackRepo.repomon.repomonUrl} />
                  <SecondModel
                    url={matchData?.data.defenseRepo.repomon.repomonUrl}
                  />
                  <MyUI />
                  <OpUI />
                  <EndModal />
                </Suspense>
              </Canvas>
            </div>
            <div className={styles.gameLogBox} onClick={handleNext}>
              <div
                style={{
                  overflowY: "auto",
                  position: "relative",
                }}
              >
                {loadData ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <p>{currentLog}</p>
                    <p
                      id={styles.triangle}
                      style={{
                        fontSize: "0.7em",
                        marginLeft: "1em",
                      }}
                    >
                      ▼
                    </p>
                  </div>
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default Page;
