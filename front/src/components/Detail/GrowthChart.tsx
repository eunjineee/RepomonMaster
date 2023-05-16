"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { DatasetType, GrowthChartType, HistoryType } from "@/types/repoDetail";
import "chartjs-adapter-moment";
import "chartjs-adapter-date-fns";
import { ko } from "date-fns/locale";
import styles from "./GrowthChart.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function GrowthChart({ histories }: { histories: HistoryType }) {
  const [apiDatasets, setApiDatasets] = useState<DatasetType>({
    label: "획득 경험치",
    data: [],
    borderColor: "rgb(194, 106, 246)",
    backgroundColor: "rgba(226, 176, 255, 0.2)",
  });
  const [cumulDatasets, setCumulDatasets] = useState<DatasetType>({
    label: "누적 경험치",
    data: [],
    borderColor: "rgb(65, 255, 176)",
    backgroundColor: "rgba(65, 255, 176, 0.2)",
  });
  const [isCumul, setIsCumul] = useState<boolean>(false);
  const [chartData, setChartData] = useState<GrowthChartType>({
    labels: [],
    datasets: [],
  });
  const chartRef = useRef<HTMLDivElement>(null);
  const [autoSkipPadding, setAutoSkipPadding] = useState<number>(150);
  const [pointBorderWidth, setPointBorderWidth] = useState<number>(1.5);

  useEffect(() => {
    const apiLabels: string[] = [];
    const apiData: string[] = [];
    const cumulData: string[] = [];

    let cumulValue = 0;

    for (let date in histories) {
      apiLabels.push(date);
      apiData.push(histories[date].toString());
      cumulValue += histories[date];
      cumulData.push(cumulValue.toString());
    }

    setApiDatasets((prevState) => ({
      ...prevState,
      data: apiData,
    }));

    setCumulDatasets((prevState) => ({
      ...prevState,
      data: cumulData,
    }));

    setChartData((prevState) => ({
      ...prevState,
      labels: apiLabels,
      datasets: [
        {
          label: "획득 경험치",
          data: apiData,
          borderColor: "rgb(194, 106, 246)",
          backgroundColor: "rgba(226, 176, 255, 0.2)",
        },
      ],
    }));
  }, []);

  /** 반응형 */
  useEffect(() => {
    if (chartRef.current && chartRef.current.offsetWidth < 700) {
      setAutoSkipPadding(70);
      setPointBorderWidth(0);
    } else {
      setAutoSkipPadding(150);
      setPointBorderWidth(1.5);
    }

    const handleResize = () => {
      if (chartRef.current && chartRef.current.offsetWidth < 700) {
        setAutoSkipPadding(70);
        setPointBorderWidth(0);
      } else {
        setAutoSkipPadding(150);
        setPointBorderWidth(1.5);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onClickChartDiv = () => {
    if (!isCumul) {
      setChartData((prevState) => ({
        ...prevState,
        datasets: [cumulDatasets],
      }));
      setIsCumul(true);
    } else {
      setChartData((prevState) => ({
        ...prevState,
        datasets: [apiDatasets],
      }));
      setIsCumul(false);
    }
  };

  return (
    <div
      className={styles["chart-div"]}
      onClick={onClickChartDiv}
      ref={chartRef}
    >
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: 20,
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "yyyy-MM-dd",
                displayFormats: {
                  millisecond: "yyyy-MM-dd",
                  second: "yyyy-MM-dd",
                  minute: "yyyy-MM-dd",
                  hour: "yyyy-MM-dd",
                  day: "yyyy-MM-dd",
                  week: "yyyy-MM-dd",
                  month: "yyyy-MM-dd",
                  quarter: "yyyy-MM-dd",
                  year: "yyyy-MM-dd",
                },
              },
              adapters: {
                date: {
                  locale: ko,
                },
              },
              grid: {
                color: "rgb(210, 210, 210)",
              },
              ticks: {
                font: {
                  size: 14,
                  family: "SUIT-Thin",
                  weight: "bold",
                },
                color: "rgb(50, 50, 50)",
                autoSkipPadding,
                maxRotation: 0,
              },
            },
            y: {
              grid: {
                color: "rgb(210, 210, 210)",
              },
              ticks: {
                font: {
                  size: 16,
                  family: "SUIT-Thin",
                  weight: "bold",
                },
                color: "rgb(50, 50, 50)",
              },
            },
          },
          elements: {
            line: {
              borderWidth: 1,
              borderCapStyle: "round",
              borderJoinStyle: "round",
              fill: true,
            },
            point: {
              pointStyle: "rectRot",
              borderWidth: pointBorderWidth,
            },
          },
          plugins: {
            legend: {
              onClick: () => {},
              position: "top" as const,
              labels: {
                font: {
                  size: 16,
                  family: "SUIT-Thin",
                  weight: "bold",
                },
                color: "rgb(50, 50, 50)",
              },
            },
          },
        }}
      />
    </div>
  );
}
