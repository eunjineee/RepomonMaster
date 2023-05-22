`use-client`;

import { setActiveRepo } from "@/api/userRepo";
import { useAppSelector } from "@/redux/hooks";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CardSkeleton from "./Skeletons/CardSkeleton";
import * as THREE from "three";
import styles from "./RepositoryCard.module.scss";

type propType = {
  title: string | undefined;
  desc: string | undefined;
  exp: number | undefined;
  rating: number | undefined;
  isActive: boolean | undefined;
  userId: string | undefined;
  repoId: number;
  isSameUser: boolean | undefined;
  setIsSameUser: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isLoaded: boolean | undefined;
  repomonName: string;
  repomonId: number;
  repomonUrl: string;
  handleChangeIsActive: any;
};

function RepositoryCard(props: propType) {
  const [userOriginId, setUserOriginId] = useState<number>();
  const login = useAppSelector((state) => state.authReducer.login);
  const router = useRouter();

  async function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    if (props.repoId) {
      try {
        const res = await setActiveRepo(props.repoId);
        props.handleChangeIsActive(props.repoId);
      } catch (err) {
        console.error(err);
      }
    }
  }

  function handleBtnRegist(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    router.push(`/repo/${props.repoId}/registRepo`);
  }

  function handleRouting() {
    if (props.isActive) {
      // 활성화 일 때,
      router.push(`/repo/${props.repoId}`);
    } else {
      // 아닐 때
      if (props.isSameUser) router.push(`/repo/${props.repoId}`);
    }
  }
  // 3D 모델 렌더링

  useEffect(() => {
    if (sessionStorage.getItem("accessToken")) {
      setUserOriginId(parseInt(sessionStorage.getItem("userId") as string, 10));
    } else {
      setUserOriginId(-1);
    }
  }, [login]);

  useEffect(() => {
    if (userOriginId == props.userId) {
      props.setIsSameUser(true);
    } else {
      props.setIsSameUser(false);
    }
  }, [props.isSameUser]);

  return !props.isLoaded ? (
    <CardSkeleton />
  ) : (
    <div
      className="border-2 rounded-lg"
      style={{
        opacity: props.isActive ? "1" : "0.5",
        backgroundColor: "white",
        cursor: props.isSameUser
          ? "pointer"
          : props.isActive
          ? "pointer"
          : "auto",
      }}
      id={styles.cardContainer}
      onClick={handleRouting}
    >
      <div
        style={{
          height: "10%",
          justifyContent: "flex-end",
          display: "flex",
          visibility: props.isSameUser ? "visible" : "hidden",
          marginTop: "10px",
          marginRight: "10px",
        }}
      >
        <span
          className={`mr-3 text-sm font-medium text-gray-900 dark:text-gray-300`}
          style={{ color: props.isActive ? "rgba(90, 167, 255, 1)" : "" }}
        >
          {props?.isActive ? "Public" : "Private"}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            defaultChecked={false}
            checked={props.isActive}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            onClick={handleClick}
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          ></div>
        </label>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          height: "80%",
          marginBottom: "5%",
        }}
      >
        <div
          className={`${styles.overflow} flex flex-col`}
          style={{
            width: "40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Canvas key={props.repoId}>
            <directionalLight
              color="white"
              position={[0, 0, 5]}
              intensity={0.5}
            />
            <directionalLight
              color="white"
              position={[0, 0, 5]}
              intensity={1}
            />
            <Model repomonUrl={props.repomonUrl} repoId={props.repoId} />
          </Canvas>
          <div className={`flex justify-center items-center mb-3`}>
            <div
              className="rounded-full mx-2 bg-indigo-300"
              style={{ width: "16px", height: "16px" }}
            ></div>
            <p>{props.repomonName}</p>
          </div>
        </div>
        <div
          className={`flex flex-col justify-between py-3`}
          style={{ width: "50%" }}
        >
          <div>
            <p
              style={{
                fontSize: "1.25em",
                fontWeight: "700",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              id={styles.repoTitle}
            >
              {props.title}
            </p>
            <p
              className={`${styles.overflowTwoLine}`}
              style={{
                fontSize: "1em",
                fontWeight: "500",
                marginBlock: "3%",
              }}
              id={styles.repoDesc}
            >
              {props.desc === null ? "설명 없음" : props.desc}
            </p>
          </div>

          <div>
            {props.repomonId >= 9000 ? (
              <button
                className={`${styles.overflow}`}
                style={{
                  display: props.isSameUser ? "block" : "none",
                  textAlign: "center",
                  backgroundColor: props.isActive ? "#5AA7FF" : "grey",
                  color: "white",
                  width: "95%",
                  borderRadius: "5px",
                  marginTop: "1em",
                  padding: "5px 0px 5px 0px",
                }}
                onClick={handleBtnRegist}
                disabled={!props.isActive}
                id={props.isActive ? styles.repoBtn : ""}
              >
                레포몬 등록
              </button>
            ) : (
              <div>
                <p className={`${styles.overflow}`}>경험치 : {props.exp}</p>
                <p className={`${styles.overflow}`}>
                  배틀 레이팅 : {props.rating}{" "}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepositoryCard;
export type modelProps = {
  repomonUrl: string;
  repoId: number;
};
const Model = (props: modelProps) => {
  const [repomonURL, setRepomonURL] = useState<string>(
    props.repomonUrl.includes("Egg")
      ? `https://repomon.s3.ap-northeast-2.amazonaws.com/models/Egg.glb`
      : props.repomonUrl
  );
  const [repoId, setRepoId] = useState<number>(props.repoId);
  // 기본값은 알 크기
  const filename = repomonURL.slice(repomonURL.lastIndexOf("/") + 1);
  const num = filename.slice(-5, filename.length - 4);
  const str = num.toString();
  const getModelLevel = (str: string): number[] => {
    switch (str) {
      case "2":
        return [4.5, 4.5, 4.5];
      case "3":
        return [3, 3, 3];
      default:
        return [5, 5, 5];
    }
  };
  const getModelPosition = (str: string): number[] => {
    switch (str) {
      case "2":
        return [1, -2, 0];
      case "3":
        return [1, -2, 0];
      default:
        return [0, -2, 0];
    }
  };

  const [scaleState, setScaleState] = useState<number[]>(getModelLevel(str));
  const [positionState, setPositionState] = useState<number[]>(
    getModelPosition(str)
  );

  const gltf = useLoader(GLTFLoader, repomonURL + "?id=" + repoId);

  let mixer: THREE.AnimationMixer | undefined;

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.timeScale = 0.4;
    const action = mixer.clipAction(gltf.animations[0]);
    action.clampWhenFinished = true;
    action.play();
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
    // gltf.scene.rotation.y += delta * 0.05; // 회전 속도를 조절할 수 있습니다.
  });

  return (
    <primitive
      object={gltf.scene}
      scale={scaleState}
      position={positionState}
      rotation={[0.2, -0.8, 0]}
    />
  );
};
