"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./banner.module.scss";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { GitTipType } from "@/types/repomons";
import { getModelLists } from "@/api/modelLoader";
import "@/styles/speechBubble.scss";
import { gitTipData } from "../../app/dashboard/gitData";
import { getBaseURL } from "@/api/axios";

const Model = ({ isClicked, onIsClickedChange }: any) => {
  // const [isClicked, SetIsClicked] = useState<boolean>(false);
  const [repomonURL, setRepomonURL] = useState<string>(
    "/static/models/tempLoader.glb"
  );

  const handleClick = useCallback(() => {
    onIsClickedChange(!isClicked);
  }, [isClicked, onIsClickedChange]);

  // Repomon 리스트 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getModelLists();
        setRepomonURL(response.data.repomonUrls);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const gltf = useLoader(GLTFLoader, repomonURL);

  let mixer: THREE.AnimationMixer | undefined;

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.timeScale = 0.4;
    if (isClicked) {
      const randomIndex = Math.floor(Math.random() * 39);
      const action = mixer.clipAction(gltf.animations[randomIndex]);
      action.play();
    } else {
      const action = mixer.clipAction(gltf.animations[8]);
      action.clampWhenFinished = true;
      action.play();
    }
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
    // gltf.scene.rotation.y += delta * 0.05; // 회전 속도를 조절할 수 있습니다.
  });

  return (
    <primitive
      object={gltf.scene}
      scale={[5, 5, 5]}
      position={[1, -2, 0]}
      rotation={[0, -0.8, 0]}
      onClick={() => {
        handleClick();
      }}
    />
  );
};

const Banner01 = () => {
  const speech = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const githubLoginUrl = getBaseURL() + "/oauth2/authorization/github";

  // git tips
  const [isClicked, setIsClicked] = useState(false);

  const handleIsClickedChange = useCallback((value: any) => {
    setIsClicked(value);
    getClickTipHandler();

    if (speech.current) {
      speech.current.style.opacity = "1";
      speech.current.style.transition = "opacity 1s cubic-bezier(0,1.21,1,1)";
      setTimeout(() => {
        if (speech.current) {
          speech.current.style.opacity = "0";
        }
      }, 5000);
    }
  }, []);

  const [gitTipsString, setGitTipsString] = useState<{ msg: string }>();

  function getRandomGitTip<T extends GitTipType>() {
    const randomIndex = Math.floor(Math.random() * gitTipData.length);
    return gitTipData[randomIndex] as T;
  }

  function getClickTipHandler() {
    const gitTip = getRandomGitTip<GitTipType>();
    setGitTipsString(gitTip);
  }

  function handleRegistBtn() {
    if (sessionStorage.getItem("accessToken")) {
      router.push(`/user/${sessionStorage.getItem("userId")}`);
    } else {
      router.push(githubLoginUrl);
    }
  }

  return (
    <div className={`${styles.container}`}>
      <div className={styles.banner}>
        <div className={styles.left}>
          <p className={styles.title}>개발자이지만, 레포몬 마스터 !</p>
          <p className={`${styles.desk125text3xl}`}>
            나만의 레포몬을 생성해 보세요
          </p>
          <p className="text-xl py-10">
            레포몬을 클릭해 깃허브 사용 팁을 확인할 수 있어요 👍
          </p>
          <button className={styles.registBtn} onClick={handleRegistBtn}>
            레포몬 등록하기
          </button>
        </div>
        <div className={styles.right}>
          <div
            className="bubble shadow large bottom"
            id={styles.speechBubble}
            style={{ opacity: "0", zIndex: "999" }}
            ref={speech}
          >
            {gitTipsString?.msg}
          </div>
          <Canvas className={styles.rightCanvas}>
            <ambientLight intensity={0.1} />
            <ambientLight intensity={0.1} />
            <directionalLight
              color="white"
              position={[0, 0, 5]}
              intensity={0.5}
            />
            <directionalLight
              color="white"
              position={[-5, 0, -5]}
              intensity={0.5}
            />
            <Model
              isClicked={isClicked}
              onIsClickedChange={handleIsClickedChange}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default Banner01;
