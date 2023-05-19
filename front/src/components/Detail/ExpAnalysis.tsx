"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { ExpAnaysisChartType, GrowthFactorType } from "@/types/repoDetail";
import styles from "./ExpAnalysis.module.scss";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const labelMap: { [key: string]: string } = {
  커밋: "COMMIT",
  머지: "MERGE",
  이슈: "ISSUE",
  리뷰: "REVIEW",
  포크: "FORK",
  스타: "STAR",
};

const ExpAnalysis = ({ growthFactor }: { growthFactor: GrowthFactorType }) => {
  const labels = ["커밋", "머지", "이슈", "리뷰", "포크", "스타"];
  const [chartData, setChartData] = useState<ExpAnaysisChartType>({
    labels,
    datasets: [
      {
        label: "획득 경험치",
        data: [],
        backgroundColor: "rgba(127, 255, 212, 0.5)",
        borderColor: "aquamarine",
        pointBackgroundColor: "rgb(127, 255, 212)",
        borderWidth: 3,
        color: "black",
      },
    ],
  });
  const chartRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"right" | "bottom">("right");
  const [fontSize, setFontSize] = useState<number>(16);

  useEffect(() => {
    const data: string[] = [];

    for (let i = 0; i < labels.length; i++) {
      const growthFactorValue = growthFactor[labelMap[labels[i]]];
      if (growthFactorValue) {
        data.push(growthFactorValue.toString());
      } else {
        data.push("0");
      }
    }

    setChartData((prevState) => ({
      ...prevState,
      datasets: [
        {
          ...prevState.datasets[0],
          data: data,
        },
      ],
    }));
  }, []);

  /** 반응형 */
  useEffect(() => {
    if (chartRef.current && chartRef.current.offsetWidth < 700) {
      setPosition("bottom");
      setFontSize(14);
    } else {
      setPosition("right");
      setFontSize(16);
    }

    const handleResize = () => {
      if (chartRef.current && chartRef.current.offsetWidth < 700) {
        setPosition("bottom");
        setFontSize(14);
      } else {
        setPosition("right");
        setFontSize(16);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.container} ref={chartRef}>
      <Radar
        data={chartData}
        options={{
          onHover: () => {},
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                color: "rgb(210, 210, 210)",
              },
              grid: {
                color: "rgb(210, 210, 210)",
              },
              pointLabels: {
                font: {
                  family: "SUIT-Thin",
                  size: fontSize,
                  weight: "bold",
                },
                color: "rgb(50, 50, 50)",
              },
              ticks: {
                color: "rgb(50, 50, 50)",
              },
            },
          },
          plugins: {
            legend: {
              onClick: () => {},
              position,
              labels: {
                color: "rgb(50, 50, 50)",
                font: {
                  family: "SUIT-Thin",
                  size: fontSize,
                  weight: "bold",
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ExpAnalysis;
