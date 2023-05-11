import React from "react";

type BadgeProps = {
  msg: string;
  colorWeight: string;
  fontWeight: string;
};

function BadgeChall(props: BadgeProps) {
  return (
    <span
      className={`bg-amber-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-amber-400 w-20 h-8 flex items-center text-center justify-center `}
      style={{ fontWeight: "800", fontSize: "0.6em" }}
    >
      {props.msg}
    </span>
  );
}

export default BadgeChall;
