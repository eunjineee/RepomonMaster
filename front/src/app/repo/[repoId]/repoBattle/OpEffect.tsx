import { useLoader } from "@react-three/fiber";
import React from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectProps } from "./MyEffect";
import * as THREE from "three";

const OpEffect = (props: EffectProps) => {
  const gltf = useLoader(GLTFLoader, props.effectUrl);
  let mixer: THREE.AnimationMixer | undefined;
  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.timeScale = 1;
    if (props.isSkilled) {
      // 스킬 사용 애니메이션 적용
    }
  }
  return (
    <primitive
      object={gltf.scene}
      scale={[0.5, 0.5, 0.5]}
      position={[2, -8, 3]}
      rotation={[6.7, 0, 0]}
    />
  );
};

export default OpEffect;
