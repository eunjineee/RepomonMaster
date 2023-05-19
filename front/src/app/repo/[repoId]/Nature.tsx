import { useLoader } from "@react-three/fiber";
import React from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Nature = () => {
  const gltf = useLoader(GLTFLoader, "/static/models/nature.glb");
  return (
    <primitive
      object={gltf.scene}
      scale={[0.03, 0.03, 0.03]}
      position={[0.5, -4, -4]}
      rotation={[0.2, 90, 0]}
    />
  );
};

export default Nature;
