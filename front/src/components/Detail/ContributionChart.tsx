"use client";

import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ContributionChartType } from "@/types/repoDetail";

ChartJS.register(ArcElement, Tooltip, Legend);

export function ContributionChart({
  commiters,
}: {
  commiters: { [key: string]: number };
}) {
  const [data, setData] = useState<ContributionChartType>({
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

    for (let commiter in commiters) {
      apiLabels.push(commiter);
      apiData.push(commiters[commiter]);
    }

    setData((prevState) => ({
      labels: apiLabels,
      datasets: [
        {
          ...prevState.datasets[0],
          data: apiData,
        },
      ],
    }));
  }, []);

  return (
    <Doughnut
      data={data}
      options={{
        plugins: {
          legend: {
            display: false,
            // onClick: () => {},
            // labels: {
            //   font: {
            //     size: 15,
            //     family: "SUIT-Regular",
            //   },
            //   color: "rgb(30, 30, 30)",
            // },
          },
        },
      }}
    />
  );
}
