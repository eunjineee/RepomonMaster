import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export const ErrorModel = () => {
  const gltf = useLoader(GLTFLoader, "/static/models/Chick_1.glb");

  let mixer: THREE.AnimationMixer | undefined;

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.timeScale = 0.4;
    const action = mixer.clipAction(gltf.animations[1]);
    action.clampWhenFinished = true;
    action.play();
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
    // gltf.scene.rotation.x += delta * 2;
    gltf.scene.rotation.y += delta * 2;
  });

  return (
    <>
      <primitive
        object={gltf.scene}
        scale={[5, 5, 5]}
        position={[0, -2, 0]}
        rotation={[0, 0, 0.5]}
      />
    </>
  );
};
