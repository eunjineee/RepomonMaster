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
import { BattleLogType } from "@/types/repoBattle";
import SoundOff from "@/components/UI/SoundOff";
import SoundOn from "@/components/UI/SoundOn";
import SkipArrow from "@/components/UI/SkipArrow";
import Versus from "public/static/icons/versus.png";
import Badge from "@/components/UI/Badge";
import BadgeChall from "@/components/UI/BadgeChall";

const Page = () => {
  const [loadData, setLoadData] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<BattleResultResponseDataType>();
  const opHp = matchData?.data.defenseRepo.hp;
  const myHp = matchData?.data.attackRepo.hp;

  // 내 레포몬 출력
  const Model = () => {
    const gltf = useLoader(GLTFLoader, "/static/models/Penguin.glb");

    let mixer: THREE.AnimationMixer | undefined;

    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.timeScale = 1;
      if (doMyAttack) {
        const action = mixer.clipAction(gltf.animations[11]);
        action.play();
      } else {
        const action = mixer.clipAction(gltf.animations[8]);
        action.clampWhenFinished = true;
        action.play();
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
  const SecondModel = () => {
    const gltf = useLoader(GLTFLoader, "/static/models/Chick_1.glb");

    let mixer: THREE.AnimationMixer | undefined;

    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.timeScale = 1;
      if (doAttack) {
        const action = mixer.clipAction(gltf.animations[11]);
        action.setLoop(THREE.LoopOnce, 0);
        action.play();
      } else {
        const action = mixer.clipAction(gltf.animations[8]);
        action.clampWhenFinished = true;
        action.play();
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

  const MyUI = () => {
    return (
      <Html style={{ position: "relative", zIndex: 0 }}>
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
          }}
        >
          내 레포명: {matchData?.data.attackRepo.repomonNickname} <br />
          HP : {myHp}
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
      <Html style={{ position: "relative", zIndex: "0" }}>
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
            zIndex: "0", // OpUI의 z-index를 0으로 설정
          }}
        >
          상대 레포명: {matchData?.data.defenseRepo.repomonNickname} <br />
          HP : {opHp}
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

  function getMatchResult() {
    // oppo - my
    return requestMatchResult(1, 4);
  }

  useEffect(() => {
    getMatchResult()
      .then((response) => {
        const data = response.data;
        setMatchData(data);
        setLoadData(true);
        console.log("매치 정보", data);
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
      }
    }, 2600);
  }, []);

  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const playerRef = useRef<any>(null);

  const handleAnimationComplete = () => {
    setIsAnimationFinished(true);
  };

  // 배틀 게임 로직

  const initialState: ScriptType[] =
    matchData?.data?.battleLog?.map((log: BattleLogType) => ({
      turn: `${log.turn}번째 턴!`,
      attackerScript: `${log.attacker}는 ${log.attack_act}으로 공격!`,
      defenderScript: `${log.defender}는 ${log.defense_act}를 사용..!`,
      damageScript: `${log.defender}는 ${Math.ceil(
        log.damage
      )}의 피해를 입었다..`,
    })) ?? [];

  return (
    <>
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
                  zIndex: 9999999999999,
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
                }}
              >
                <Suspense fallback={<Loader />}>
                  <ambientLight intensity={0.5} />
                  <directionalLight
                    color="white"
                    position={[5, 0, 5]}
                    intensity={0.6}
                  />
                  <Model />
                  <SecondModel />
                  <MyUI />
                  <OpUI />
                </Suspense>
              </Canvas>
            </div>
            <div className={styles.gameLogBox}>
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
                    <p>{initialState[0].damageScript}</p>
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
    </>
  );
};

export default Page;
