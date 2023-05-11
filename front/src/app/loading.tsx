"use client";
import React, { useState } from "react";
import Lottie from "react-lottie-player";
import lottieFile from "public/static/lotties/loadingEgg.json";
import { gitTipData } from "@/app/dashboard/gitData";
function Loading() {
  const [randomNum, setRandomNum] = useState<number>(0);
  function getRandomNumber() {
    return setRandomNum(Math.floor(Math.random() * gitTipData.length));
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
      onClick={getRandomNumber}
    >
      <Lottie
        loop
        animationData={lottieFile}
        play
        style={{ width: 150, height: 150 }}
      />
      <p style={{ fontSize: "1.2em", marginTop: "2em", fontWeight: "700" }}>
        {gitTipData[randomNum].msg}
      </p>
    </div>
  );
}

export default Loading;
