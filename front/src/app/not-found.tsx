"use client";
import { ErrorModel } from "@/components/UI/ErrorModel";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function _404() {
  const [count, setCount] = useState<number>(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  async function handleModelClick() {
    if (startTime === 0 && count === 0) {
      setStartTime(Date.now());
    } else if (count === 49) {
      setEndTime(Date.now());
    }
    setCount(count + 1);
  }
  useEffect(() => {
    if (count === 50) {
      alert(
        `축하합니다! 당신은 이 의미없는 레포몬을 50번 누르는 동안 ${(
          (endTime - startTime) /
          1000
        ).toFixed(0)}
        초를 소비하셨습니다..!`
      );
    }
  }, [count]);
  console.log("s", startTime);
  console.log(endTime);
  return (
    <div
      style={{
        width: "100%",
        height: "79vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            fontSize: "5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "15rem" }}>4</p>
          <Canvas style={{ height: "20rem" }} onClick={handleModelClick}>
            <ambientLight intensity={1} />
            <ErrorModel />
          </Canvas>
          <p style={{ fontSize: "15rem" }}>4</p>
        </div>
        <p
          style={{
            position: "absolute",
            color: "grey",
            visibility: count <= 0 ? "hidden" : "visible",
            top: "10em",
            fontSize: "2em",
            fontWeight: "700",
            opacity: "0.6",
          }}
        >
          {count}
        </p>
        <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
          페이지를 찾을 수 없습니다.
        </p>
        <Link href="/" style={{ fontSize: "1.5rem", marginTop: "2rem" }}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default _404;
