import { useFrame, useLoader } from "@react-three/fiber";
import React from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export type EffectProps = {
  effectUrl: string;
  isSkilled: boolean;
};

const MyEffect = () => {
  const texture = useLoader(
    THREE.TextureLoader,
    "/static/effects/explosion.gif"
  );

  useFrame(() => {
    // Update the texture frame if necessary
    texture.needsUpdate = true;
  });

  return (
    <mesh>
      <planeBufferGeometry args={[1, 1]} />
      <meshBasicMaterial transparent={true} map={texture} />
    </mesh>
  );
};

export default MyEffect;
