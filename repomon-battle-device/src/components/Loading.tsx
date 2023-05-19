import React from "react";
import Lottie from "react-lottie-player";
import lottieFile from "../assets/loading_egg.json";

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Lottie
        loop
        animationData={lottieFile}
        play
        style={{ width: 80, height: 80 }}
      />
    </div>
  );
}

export default Loading;
