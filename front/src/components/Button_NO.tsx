import { buttonType } from "@/types/repoRegist";
import React from "react";

function Button_NO(msg: buttonType) {
  return (
    <button
      type="button"
      style={{
        textAlign: "center",
        backgroundColor: "white",
        color: "#5AA7FF",
        width: "10em",
        height: "3em",
        border: "2px solid #5AA7FF",
        borderRadius: "10px",
        marginInline: "1em",
      }}
      className="transition duration-300 ease-in-out hover:opacity-80"
    >
      {msg.msg}
    </button>
  );
}

export default Button_NO;
