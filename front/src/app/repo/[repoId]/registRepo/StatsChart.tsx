import { statsData } from "@/types/repoInfo";
import React from "react";
import { Radar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  RadialLinearScale
);

function StatsChart(props: statsData) {
  // chart Data
  const data = {
    labels: ["공격", "회피", "방어", "치명타", "명중"],
    datasets: [
      {
        label: "능력치",
        data: [
          props.attackStat,
          props.avoidStat,
          props.enduranceStat,
          props.criticalStat,
          props.hitStat,
        ],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "rgba(75,192,192,1)",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        legend: false,
      },
    ],
  };

  const options: ChartOptions<"radar"> = {
    scales: {
      r: {
        type: "radialLinear",
        beginAtZero: true,
        max: 10,
        min: 0,
        pointLabels: {
          font: {
            family: "SUIT-Thin",
            size: 23,
            weight: "bold",
          },
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Radar data={data} options={options} />
    </div>
  );
}

export default StatsChart;
