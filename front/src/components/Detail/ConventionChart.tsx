import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { ConventionChartType } from "@/types/repoDetail";
import styles from "react-day-picker/dist/style.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export function ConventionChart({
  conventionInfo,
  total,
  obey,
}: {
  conventionInfo: { [key: string]: number };
  total: number;
  obey: number;
}) {
  const [data, setData] = useState<ConventionChartType>({
    labels: [],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 164, 217, 0.2)",
        ],
        borderWidth: 0,
      },
    ],
  });

  useEffect(() => {
    const apiLabels: string[] = [];
    const apiData: number[] = [];

    console.log(total);
    console.log(obey);
    console.log(conventionInfo);
    for (let prefix in conventionInfo) {
      apiLabels.push(prefix);
      apiData.push(conventionInfo[prefix]);
    }

    console.log(apiData);
    setData((prevState) => ({
      labels: apiLabels,
      datasets: [
        {
          ...prevState.datasets[0],
          data: apiData,
          backgroundColor: apiLabels.map((label, index) =>
            label === "미 준수"
              ? "rgba(128, 128, 128, 0.2)"
              : prevState.datasets[0].backgroundColor[index]
          ),
        },
      ],
    }));
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Pie
        data={data}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
      <p style={{ color: "gray", margin: "1rem 0 0 0.5rem" }}>
        컨벤션 준수율{" "}
        <span style={{ color: "rgba(109, 130, 250, 1)" }}>
          {((obey / total) * 100.0).toFixed(2)}
        </span>{" "}
        %
      </p>
    </div>
  );
}
