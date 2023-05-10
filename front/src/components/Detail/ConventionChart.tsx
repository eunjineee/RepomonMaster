import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function ConventionChart({
  total,
  obey,
}: {
  total: number;
  obey: number;
}) {
  const data = {
    labels:
      obey === 0
        ? ["컨벤션 몰라"]
        : total - obey === 0
        ? ["컨벤션 좋아"]
        : ["컨벤션 좋아", "컨벤션 몰라"],
    datasets: [
      {
        data:
          obey === 0
            ? [total - obey]
            : total - obey === 0
            ? [obey]
            : [obey, total - obey],
        backgroundColor: ["rgba(109, 130, 250, 0.2)", "rgba(255, 111, 0, 0.2)"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Pie
      data={data}
      options={{
        plugins: {
          legend: {
            onClick: () => {},
            position: "bottom" as const,
            labels: {
              font: {
                size: 15,
                family: "SUIT-Thin",
                weight: "bold",
              },
              color: "rgb(50, 50, 50)",
            },
          },
        },
      }}
    />
  );
}
