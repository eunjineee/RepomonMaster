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
          className="h-2.5 rounded-full"
          style={{
            width: `${
              (props.HP / props.maxHP) * 100 < 0
                ? 0
                : (props.HP / props.maxHP) * 100
            }%`,
            marginTop: "2%",
            transition: "width 2s ease-in-out",
            backgroundColor: `${
              (props.HP / props.maxHP) * 100 >= 50
                ? "#2cde5c"
                : (props.HP / props.maxHP) * 100 >= 30
                ? "orange"
                : "red"
            }`,
          }}
        />
      </div>
    </>
  );
}

export default HpBar;
