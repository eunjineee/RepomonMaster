"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import Nature from "@/app/repo/[repoId]/Nature";
import { OrbitControls } from "@react-three/drei";

const Model = ({
  repomonUrl,
  isClicked,
  setIsClicked,
  repomonTier,
}: {
  repomonUrl: string;
  isClicked: boolean;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  repomonTier: number;
}) => {
  const gltf = useLoader(GLTFLoader, repomonUrl);

  let mixer: THREE.AnimationMixer;

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    console.log(mixer);

    mixer.timeScale = 0.3;
    if (isClicked) {
      const randomIndex = Math.floor(Math.random() * gltf.animations.length);
      const action = mixer.clipAction(gltf.animations[randomIndex]);
      action.play();
    } else if (gltf.animations.length >= 9) {
      const action = mixer.clipAction(gltf.animations[8]); //8
      action.clampWhenFinished = true;
      action.play();
    } else {
      const randomIndex = Math.floor(Math.random() * gltf.animations.length);
      const action = mixer.clipAction(gltf.animations[randomIndex]);
      action.clampWhenFinished = true;
      action.play();
    }
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
  });

  const scaleNum = repomonUrl.includes("Dora_1")
    ? 5
    : repomonTier === 1 || repomonUrl.includes("Ker_2")
    ? 4.5
    : repomonTier === 2 ||
      repomonUrl.includes("Whale_3") ||
      repomonUrl.includes("Ker_3") ||
      repomonUrl.includes("Tails_3")
    ? 3
    : repomonUrl.includes("Dora_3")
    ? 3.3
    : repomonUrl.includes("Tuna_3")
    ? 3.3
    : 3;
  const longPositionWeight = repomonUrl.includes("Mir_3")
    ? 1.5
    : repomonUrl.includes("Cheetah_3") ||
      repomonUrl.includes("Dingo_3") ||
      repomonUrl.includes("Whale_3") ||
      repomonUrl.includes("Dingo_2")
    ? 1
    : repomonUrl.includes("Tails_1") || repomonUrl.includes("Dora_2")
    ? 0.5
    : repomonUrl.includes("Pony_3") || repomonTier === 1 || repomonTier === 2
    ? 0.7
    : repomonUrl.includes("Ker_3") || repomonUrl.includes("Tails_3")
    ? 0.5
    : 0;
  const longRotationWeight =
    repomonUrl.includes("Mir_3") || repomonUrl.includes("Cheetah_3")
      ? -0.5
      : repomonUrl.includes("Dora_3")
      ? 0.2
      : 0;

  return (
    <primitive
      object={gltf.scene}
      scale={[scaleNum, scaleNum, scaleNum]}
      position={[-0.5 + longPositionWeight, -2.5, -1]}
      rotation={[0.2, -0.6 + longRotationWeight, 0]}
      onClick={() => {
        setIsClicked(!isClicked);
      }}
    />
  );
};

function DetailRepomon({
  repomonUrl,
  repomonTier,
}: {
  repomonUrl: string;
  repomonTier: number;
}) {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <Canvas
      style={{
        width: "97%",
        height: "75%",
        backgroundColor: "white",
        margin: "0.5rem auto 0 auto",
        borderRadius: "10px",
        backgroundImage: `url('/static/images/sky.jpg')`,
      }}
    >
      <ambientLight intensity={0.4} position={[0, 5, 0]} />
      <directionalLight color="white" position={[0, 0, 5]} intensity={1.0} />
      <Model
        repomonUrl={repomonUrl}
        isClicked={isClicked}
        setIsClicked={setIsClicked}
        repomonTier={repomonTier}
      />
      <OrbitControls />
      <Nature />
    </Canvas>
  );
}

export default DetailRepomon;
