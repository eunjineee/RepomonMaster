"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import styles from "./page.module.scss";
import RepositoryCard, { modelProps } from "@/components/RepositoryCard";
import { useRouter } from "next/navigation";
import {
  getTotalRepoList,
  getUserDetail,
  refreshAllRepo,
} from "@/api/userRepo";
import { RepoListType, UserInfoType } from "@/types/repoInfo";
import Paging from "@/components/UI/Pagination";
import Modal from "react-modal";
import LoadingSpinner from "@/components/Skeletons/LoadingSpinner";
import Ballon from "public/static/lotties/balloon.json";
import Lottie from "react-lottie-player";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import UserExportModal from "@/components/UserExportModal";
import { customAlert } from "@/app/utils/CustomAlert";

const Page = ({ params }: { params: { userId: string } }) => {
  // 레포지토리 유저 정보 GET
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [repoInfo, setRepoInfo] = useState<RepoListType>({
    repoListItems: [],
    totalElements: 0,
    totalPages: 0,
  });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isReloaded, setIsReloaded] = useState<boolean>(false);
  const [isListLoaded, setIsListLoaded] = useState<boolean>(true);
  const arrowRef = useRef<SVGSVGElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeChanged, setActiveChanged] = useState<boolean>(false);

  function getUserInfo(userId: string) {
    return getUserDetail(Number(userId));
  }
  useEffect(() => {
    const data = getUserInfo(params.userId)
      .then((response) => {
        const res = response.data.data;
        setUserInfo(res);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [activeChanged]);

  // 레포지토리 리스트 GET
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTotalRepoList(
          Number(params.userId),
          currentPage - 1,
          6
        );
        const data = response.data;
        setRepoInfo(data);
        setTimeout(() => {
          setIsLoaded(true);
        }, 1500);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isReloaded, currentPage]);

  // 동일 유저 체크
  const [isSameUser, setIsSameUser] = useState<boolean>();

  // 카드 추출 이벤트
  function copyUserCardUrl() {
    const stringToCopy = `https://repomon.kr/card/user?userId=${userInfo?.userId}`;
    navigator.clipboard
      .writeText(stringToCopy)
      .then(() => {
        window.alert("복사 완료 ✅");
      })
      .catch((error) => {
        window.alert("복사 실패 ❌");
      });
  }

  // active 상태 바꾸기
  function handleChangeIsActive(repoId: number) {
    const temp = { ...repoInfo };

    temp.repoListItems.map((e) => {
      if (e.repoId == repoId) {
        e.isActive = !e.isActive;
      }
    });
    setRepoInfo(temp);
  }

  return (
    <div id="pageContainer">
      <div className={styles.pageContainer}>
        <div className={styles.bannerBack}>
          <Lottie
            loop
            animationData={Ballon}
            play
            style={{ width: "30vh", height: "30vh", marginTop: "-3.3%" }}
          />
        </div>
        <div className={styles.bodyContainer}>
          {/* 좌측 유저 정보 */}
          <div className={styles.sideProfile}>
            <div>
              <div
                className={styles.chracter}
                style={{
                  backgroundImage: `url('${userInfo?.avatarUrl}')`,
                }}
              />
              <p className={styles.boxTitle}>{userInfo?.username}</p>
              <p className="py-2">{userInfo?.userDescription}</p>
              <UserExportModal userId={params.userId} />
              <a
                href={`https://github.com/${userInfo?.username.toLowerCase()}`}
              >
                <div className={`${styles.boxContent} flex items-center`}>
                  <div className="pr-3 py-1.5">
                    <Image
                      src="/static/images/github.png"
                      alt="logo"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>github.com/{userInfo?.username.toLowerCase()}</div>
                </div>
              </a>
              <div className={`${styles.boxContent} flex items-center`}>
                <div className="pr-3 py-1.5">
                  <Image
                    src="/static/images/pokeball.png"
                    alt="logo"
                    width={24}
                    height={24}
                  />
                </div>
                <div>{userInfo?.activeRepoCnt || 0} </div>
                <div className="text-base ps-2"> 몬</div>
              </div>
              <div className={`${styles.boxContent} flex items-center`}>
                <div className="pr-3 py-1.5">
                  <Image
                    src="/static/images/trophy.png"
                    alt="logo"
                    width={24}
                    height={24}
                  />
                </div>
                <div>{userInfo?.userRank}</div>
                <div className="text-base ps-2"> 위</div>
              </div>
              <div
                className={`${styles.boxContent} flex items-center border-b-4 pb-3`}
              >
                <div
                  className="pr-3 py-1.5"
                  style={{
                    fontWeight: "1000",
                    fontFamily: "SUIT-Bold",
                    color: "grey",
                  }}
                >
                  Exp
                </div>
                <div>{userInfo?.totalExp}</div>
              </div>
            </div>

            {/* 대표 레포몬 */}
            {userInfo?.representRepo == null ||
            !userInfo.representRepo.isActive ? (
              <div className="flex flex-col pt-10 items-center">
                <div
                  className="flex flex-col relative items-center justify-center border rounded-full bg-white"
                  style={{ width: "18em", height: "18em" }}
                >
                  <p>대표 레포몬을 설정해 주세요!</p>
                  <Image
                    className="absolute opacity-20"
                    src="/static/images/default_repomon.png"
                    width={200}
                    height={200}
                    alt="logo"
                    style={{ zIndex: "100" }}
                  ></Image>
                  <div
                    className="bg-gray-300 py-5 rounded-full"
                    style={{
                      position: "absolute",
                      bottom: "50px",
                      width: "12em",
                      borderRadius: `50% / 50%`,
                      zIndex: "1",
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col pt-10">
                <p className="text-sm">대표 레포지토리</p>
                <p
                  className={`${styles.boxContent} pb-3`}
                  style={{ color: "black", fontWeight: "bold" }}
                >
                  {userInfo?.representRepo?.repoName}
                </p>
                <p className="text-sm">대표 레포몬</p>
                <p
                  className={styles.boxContent}
                  style={{ color: "black", fontWeight: "bold" }}
                >
                  {userInfo?.representRepo?.repomonNickName}
                </p>
                <div
                  className={`flex flex-col relative items-center border rounded-full overflow-hidden bg-white ${styles["repomon-div"]}`}
                >
                  <Canvas style={{ zIndex: "100" }}>
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
                      repomonUrl={userInfo?.representRepo?.repomon.repomonUrl}
                      repoId={userInfo?.representRepo?.repoId}
                    />
                  </Canvas>
                  <div
                    className="bg-gray-300 py-5 rounded-full"
                    style={{
                      position: "absolute",
                      bottom: "40px",
                      width: "12em",
                      borderRadius: `50% / 50%`,
                      zIndex: "80",
                    }}
                  ></div>
                </div>
                <p className={styles.boxContent} style={{ marginTop: "1rem" }}>
                  경험치 : {userInfo?.representRepo?.repoExp} (
                  {userInfo?.representRepo?.repoRank}위)
                </p>
                <p className={styles.boxContent}>
                  배틀 레이팅 : {userInfo?.representRepo?.repoRating} (
                  {userInfo?.representRepo?.battleRank}위)
                </p>
              </div>
            )}
          </div>

          {/* 우측 바디 */}
          <div className={styles.bodyList}>
            <div className={styles.listTitle} style={{ display: "block" }}>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  alignItems: "center",
                }}
              >
                <p style={{ width: "7em" }} id={styles.repoListTitle}>
                  레포지토리 목록
                </p>
                {isListLoaded === false ? (
                  <p style={{ fontSize: "1em", opacity: "0.5" }}>
                    레포 리스트 로딩중...
                  </p>
                ) : (
                  <ArrowPathIcon
                    width="1.75rem"
                    style={{ marginLeft: "2%" }}
                    className={styles.arrow}
                    ref={arrowRef}
                    onClick={async () => {
                      customAlert("목록 갱신에 최대 3분 소요될 수 있습니다.");
                      setIsListLoaded(false);
                      userInfo?.userId &&
                        (await refreshAllRepo(userInfo.userId));
                      setIsListLoaded(true);
                      setIsLoaded(false);
                      setIsReloaded(!isReloaded);
                    }}
                  />
                )}
              </div>
              <p
                style={{
                  fontSize: "1em",
                  opacity: "0.7",
                  marginBlock: "1%",
                }}
                id={styles.reposubtitle}
              >
                <span style={{ color: "red", fontWeight: "800" }}>*</span> 최초
                로드 시, 리스트가 보이지 않을 때 갱신 버튼을 눌러주세요
              </p>
            </div>

            {/* 레포카드 리스트 */}
            <div className={styles.listCards}>
              <div className="grid grid-cols-2 gap-4 h-200">
                {Array(repoInfo?.totalElements)
                  .fill(null)
                  .map((items, i) =>
                    repoInfo?.repoListItems &&
                    i < repoInfo.repoListItems.length ? (
                      <RepositoryCard
                        key={i + currentPage * 6}
                        title={repoInfo.repoListItems.at(i)?.repoName}
                        desc={repoInfo.repoListItems.at(i)?.repoDescription}
                        exp={repoInfo.repoListItems.at(i)?.repoExp}
                        rating={repoInfo.repoListItems.at(i)?.repoRating}
                        isActive={repoInfo.repoListItems.at(i)?.isActive}
                        handleChangeIsActive={handleChangeIsActive}
                        userId={params.userId}
                        repoId={repoInfo.repoListItems.at(i)?.repoId || 0}
                        isSameUser={isSameUser}
                        setIsSameUser={setIsSameUser}
                        isLoaded={isLoaded}
                        repomonName={
                          repoInfo.repoListItems.at(i)?.repomonName || ""
                        }
                        repomonId={repoInfo.repoListItems.at(i)?.repomonId || 0}
                        repomonUrl={
                          repoInfo.repoListItems.at(i)?.repomonUrl || ""
                        }
                      />
                    ) : null
                  )}
              </div>

              <div className={`${styles.paginations} pt-10`}>
                <Paging
                  size={6}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPage={repoInfo?.totalPages + 1}
                  totalElement={repoInfo?.totalElements}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

const Model = (props: modelProps) => {
  const [repomonURL, setRepomonURL] = useState<string>(props.repomonUrl);
  const [repoId, setRepoId] = useState<number>(props.repoId);
  // 기본값은 알 크기
  const filename = repomonURL.slice(repomonURL.lastIndexOf("/") + 1);
  const num = filename.slice(-5, filename.length - 4);
  const str = num.toString();
  // console.log(repomonURL + "?id=" + repoId);
  const getModelLevel = (str: string): number[] => {
    switch (str) {
      case "2":
        return [4.5, 4.5, 4.5];
      case "3":
        return [4, 4, 4];
      default:
        return [5, 5, 5];
    }
  };
  const getModelPosition = (str: string): number[] => {
    switch (str) {
      case "2":
        return [0, -2, 0];
      case "3":
        return [0, -2, 0];
      default:
        return [0, -2, 0];
    }
  };

  const [scaleState, setScaleState] = useState<number[]>(getModelLevel(str));
  const [positionState, setPositionState] = useState<number[]>(
    getModelPosition(str)
  );

  const gltf = useLoader(
    GLTFLoader,
    repomonURL + "?id=" + repoId + "representive"
  );

  let mixer: THREE.AnimationMixer | undefined;

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.timeScale = 0.4;
    console.log(gltf.animations);
    const action = mixer.clipAction(gltf.animations[8]);
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
