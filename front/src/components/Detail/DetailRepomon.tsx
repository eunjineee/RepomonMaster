"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";

const Model = ({
  repomonUrl,
  isClicked,
  setIsClicked,
}: {
  repomonUrl: string;
  isClicked: boolean;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
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
      const action = mixer.clipAction(gltf.animations[8]);
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

  return (
    <primitive
      object={gltf.scene}
      scale={[2, 2, 2]}
      position={[0, -2, 0]}
      rotation={[0.3, -0.2, 0]}
      onClick={() => {
        setIsClicked(!isClicked);
      }}
    />
  );
};

function DetailRepomon({ repomonUrl }: { repomonUrl: string }) {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <Canvas
      style={{
        width: "97%",
        height: "75%",
        backgroundColor: "white",
        margin: "0.5rem auto 0 auto",
        borderRadius: "10px",
      }}
    >
      <ambientLight intensity={0.1} />
      <ambientLight intensity={0.1} />
      <directionalLight color="white" position={[0, 0, 5]} intensity={0.6} />
      <directionalLight color="white" position={[-5, 0, -5]} intensity={0.6} />
      <Model
        repomonUrl={repomonUrl}
        isClicked={isClicked}
        setIsClicked={setIsClicked}
      />
    </Canvas>
  );
}

export default DetailRepomon;
