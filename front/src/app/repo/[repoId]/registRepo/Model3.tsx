import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

type propsData = {
  repomonUrl: string;
};

export const Model3 = (props: propsData) => {
  const gltf = useLoader(GLTFLoader, props.repomonUrl);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  let mixer: THREE.AnimationMixer | undefined;

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.timeScale = 0.4;
    if (isClicked) {
      const action = mixer.clipAction(gltf.animations[11]);
      action.clampWhenFinished = true;
      action.play();
      setTimeout(() => {
        setIsClicked(false);
      }, 2000);
    } else {
      const action = mixer.clipAction(gltf.animations[8]);
      action.clampWhenFinished = true;
      action.play();
    }
  }
  function func() {
    setIsClicked(true);
    return;
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
    // gltf.scene.rotation.y += delta * 0.05; // 회전 속도를 조절할 수 있습니다.
  });

  return (
    <primitive
      object={gltf.scene}
      scale={[5, 5, 5]}
      position={[0, -2, 0]}
      rotation={[0, -0.8, 0]}
      onClick={func}
    />
  );
};
