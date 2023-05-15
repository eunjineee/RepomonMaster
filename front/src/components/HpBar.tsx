import React from "react";

interface Props {
  HP: number;
  maxHP: number;
}

function HpBar(props: Props) {
  return (
    <>
      <div className="w-96 bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div
          className="bg-red-600 h-2.5 rounded-full dark:bg-red-500"
          style={{
            width: `${
              (props.HP / props.maxHP) * 100 < 0
                ? 0
                : (props.HP / props.maxHP) * 100
            }%`,
            marginTop: "2%",
            transition: "width 2s ease-in-out",
          }}
        />
      </div>
    </>
  );
}

export default HpBar;
