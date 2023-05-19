import { useLoader } from "@react-three/fiber";
import React from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Grass = () => {
  const gltf = useLoader(GLTFLoader, "/static/models/grass.glb");
  return (
    <primitive
      object={gltf.scene}
      scale={[0.5, 0.5, 0.5]}
      position={[2, -8, 3]}
      rotation={[6.7, 0, 0]}
    />
  );
};

export default Grass;
