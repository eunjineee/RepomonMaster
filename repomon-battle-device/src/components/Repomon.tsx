import React, { useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { FaHandPointUp } from "react-icons/fa";
import styles from "./Repomon.module.scss";

const Model = ({
  setFirstClicked,
  isClicked,
  setIsClicked,
}: {
  setFirstClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isClicked: boolean;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const repomonUrl =
    "https://repomon.s3.ap-northeast-2.amazonaws.com/models/Chick_1.glb";
  const gltf = useLoader(GLTFLoader, repomonUrl);

  let mixer: THREE.AnimationMixer;

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);

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
      scale={[6, 6, 6]}
      position={[0, -2, 0]}
      rotation={[0.3, -0.5, 0]}
      onClick={() => {
        setFirstClicked(true);
        setIsClicked(!isClicked);
      }}
    />
  );
};

function Repomon() {
  const [firstClicked, setFirstClicked] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <div className={styles["canvas-container"]}>
      <Canvas>
        <ambientLight intensity={0.1} />
        <ambientLight intensity={0.1} />
        <ambientLight intensity={0.3} position={[0, 5, 0]} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={0.6} />
        <directionalLight
          color="white"
          position={[-5, 0, -5]}
          intensity={0.6}
        />
        <Model
          setFirstClicked={setFirstClicked}
          isClicked={isClicked}
          setIsClicked={setIsClicked}
        />
      </Canvas>
      {!firstClicked && <FaHandPointUp />}
    </div>
  );
}

export default Repomon;
