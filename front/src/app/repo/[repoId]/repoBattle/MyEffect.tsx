import { Html } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import Image from "next/image";
import React, { useRef } from "react";
import Effect from "/public/static/effects/explosion.gif";
import * as THREE from "three";

const MyEffect = () => {
  return (
    <Html position={[0, 0, 3]}>
      <Image src={Effect} alt="explosion" width={10} height={10} />
    </Html>
  );
};

export default MyEffect;
