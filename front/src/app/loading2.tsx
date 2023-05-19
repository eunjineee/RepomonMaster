import React from "react";
import Lottie from "react-lottie-player";
import lottieFile from "public/static/lotties/loadingEgg.json";

function Loading2() {
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
        style={{ width: 100, height: 100 }}
      />
    </div>
  );
}

export default Loading2;
