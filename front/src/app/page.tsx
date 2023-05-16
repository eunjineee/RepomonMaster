"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import grow from "../../public/static/services/service_grow.png";
import fight from "../../public/static/services/service_fight.png";
import card from "../../public/static/services/service_card.png";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthLoginState } from "@/redux/features/authSlice";
import * as THREE from "three";
import { GitTipType, RepoInfo } from "@/types/repomons";
import { getModelLists } from "@/api/modelLoader";
import "@/styles/speechBubble.scss";
import { gitTipData } from "./dashboard/gitData";
import Banner01 from "@/components/Banner/Banner01";
import Banner02 from "@/components/Banner/Banner02";
import Banner03 from "@/components/Banner/Banner03";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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
        console.log(typeof response.data.repomonUrls);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  console.log(repomonURL);
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

const Particle = () => {
  const gltf = useLoader(GLTFLoader, "/static/models/Particle.glb");

  console.log("particle: ", gltf.animations);
  let mixer: THREE.AnimationMixer | undefined;

  // if (gltf.animations.length) {
  //   mixer = new THREE.AnimationMixer(gltf.scene);
  //   mixer.timeScale = 0.4;
  //   const action = mixer.clipAction(gltf.animations[8]);
  //   action.clampWhenFinished = true;
  //   action.play();
  // }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });

  return (
    <primitive
      object={gltf.scene}
      scale={[5, 5, 5]}
      position={[1, -2, 0]}
      rotation={[0, -0.8, 0]}
    />
  );
};

const Home = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const fpRef = useRef<HTMLImageElement>(null);
  const spRef = useRef<HTMLImageElement>(null);
  const tpRef = useRef<HTMLImageElement>(null);
  const speech = useRef<HTMLDivElement>(null);
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [bannerCurPage, setBannerCurPage] = useState<number>(1);
  const [bannerComponent, setBannerComponent] = useState<JSX.Element>(
    <Banner01 />
  );
  const [firstRendering, setFirstRendering] = useState<boolean>(true);
  const [isMovedRight, setIsMovedRight] = useState<boolean>(true);
  // let firstRendering = true;

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
    console.log(gitTipsString?.msg);
  }

  useEffect(() => {
    if (params.get("access-token")) {
      sessionStorage.setItem(
        "accessToken",
        params.get("access-token") as string
      );
      sessionStorage.setItem(
        "refreshToken",
        params.get("refresh-token") as string
      );
      sessionStorage.setItem("userId", params.get("userId") as string);
      sessionStorage.setItem("userName", params.get("username") as string);
      sessionStorage.setItem("nickName", params.get("name") as string);
      sessionStorage.setItem("avatarUrl", params.get("avatarUrl") as string);
      dispatch(setAuthLoginState());
      router.push("/");
    }
  }, []);

  // 우측버튼
  const banner = [Banner01, Banner02, Banner03];
  function getNextBanner() {
    setFirstRendering(false);
    setIsMovedRight(true);
    if (bannerCurPage == banner.length) {
      setBannerCurPage(1);
    } else {
      setBannerCurPage(bannerCurPage + 1);
    }
    console.log(bannerCurPage);
  }

  // 좌측버튼
  function getPrevBanner() {
    setFirstRendering(false);
    setIsMovedRight(false);
    if (bannerCurPage == 1) {
      setBannerCurPage(banner.length);
    } else {
      setBannerCurPage(bannerCurPage - 1);
    }
    console.log(bannerCurPage);
  }

  useEffect(() => {
    if (bannerCurPage === 1) {
      setBannerComponent(<Banner01 />);
    } else if (bannerCurPage === 2) {
      setBannerComponent(<Banner02 />);
    } else if (bannerCurPage === 3) {
      setBannerComponent(<Banner03 />);
    }
  }, [bannerCurPage]);

  return (
    <div className={styles.container}>
      <div
        className={`relative `}
        style={{ width: "100%", background: `rgb(90, 167, 255)` }}
      >
        <div
          className=" absolute bottom-0 right-0 m-5 flex"
          style={{ zIndex: "100" }}
        >
          <div
            className={`${styles.pageBtn} px-1 py-1 rounded-full bg-white mr-2 flex justify-center items-center`}
            onClick={getPrevBanner}
          >
            <ChevronLeftIcon width="2rem" />
          </div>
          <div
            className={`${styles.pageBtn} px-1 py-1 rounded-full bg-white flex justify-center items-center`}
            onClick={getNextBanner}
          >
            <ChevronRightIcon width="2rem" />
          </div>
        </div>
        <div
          className={` ${
            firstRendering
              ? ""
              : isMovedRight
              ? styles.bannerContainer
              : styles.bannerContainerReverse
          } `}
          key={bannerCurPage}
        >
          {bannerComponent}
        </div>
      </div>

      <div className={styles.service}>
        <h2 className={styles["service-title"]}>
          <span>레포몬</span> 서비스 둘러보기
        </h2>

        <div className={styles["service-content"]}>
          <div className={styles["img-div"]} style={{ margin: "0 20px 0 0" }}>
            <Image
              alt="grow"
              src={grow}
              className={styles.fp}
              ref={fpRef}
            ></Image>
            <span>레포지토리 분석</span>
            <p className={styles.des} style={{ padding: "4rem 1rem" }}>
              당신의 Github 레포지토리와 함께 성장하는 레포몬을 육성해보세요.
              <br />
              분석 차트와 함께 당신의 프로젝트를 한눈에 시각화해서 나타내줘요.
            </p>
          </div>
          <div>
            <div className={styles["img-div"]} style={{ margin: "0 0 20px 0" }}>
              <Image
                alt="grow"
                src={fight}
                className={styles.sp}
                ref={spRef}
              ></Image>
              <span>배틀 및 랭킹</span>
              <p className={styles.des}>
                당신의 프로젝트가 얼마나 강한지 궁금하지 않나요?
                <br />
                성장시킨 레포몬으로 다른 유저와 배틀해보세요!
              </p>
            </div>
            <div className={styles["img-div"]}>
              <Image
                alt="grow"
                src={card}
                className={styles.tp}
                ref={tpRef}
              ></Image>
              <span>카드 추출</span>
              <p className={styles.des}>
                열심히 성장시킨 내 프로젝트를
                <br />
                README에서 실시간으로 자랑해보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
