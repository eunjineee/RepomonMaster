import { buttonType } from "@/types/repoRegist";
import React from "react";

function Button_OK(msg: buttonType) {
  return (
    <button
      type="button"
      style={{
        textAlign: "center",
        backgroundColor: "#5AA7FF",
        color: "white",
        width: "10em",
        height: "3em",
        borderRadius: "10px",
        marginInline: "1em",
      }}
      className="transition duration-300 ease-in-out hover:opacity-80"
    >
      {msg.msg}
    </button>
  );
}

export default Button_OK;
