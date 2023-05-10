"use client";
import React from "react";
import Lottie from "react-lottie-player";
import { gitTipData } from "./dashboard/gitData";
import lottieFile from "public/static/lotties/loadingEgg.json";

function Loading() {
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
    >
      <Lottie
        loop
        animationData={lottieFile}
        play
        style={{ width: 150, height: 150 }}
      />
      <p style={{ fontSize: "1.2em", marginTop: "1em", fontWeight: "700" }}>
        RepoMon~
      </p>
    </div>
  );
}

export default Loading;
