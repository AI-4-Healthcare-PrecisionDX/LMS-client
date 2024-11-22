"use client";

import React from "react";
import ApexCharts from "react-apexcharts";

const ApexChartComponent = ({ type }) => {
  const chartOptions = {
    bar: {
      chart: { type: "bar", height: 270 },
      series: [
        {
          name: "Subscribers",
          data: [20, 40, 45, 50, 49, 60, 70, 91, 125],
        },
      ],
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
    donut: {
      series: [500, 500, 500],
      colors: ["#FF9F29", "#487FFF", "#E4F1FF"],
      labels: ["Active", "New", "Total"],
      chart: { type: "donut", height: 270 },
      stroke: { width: 0 },
      dataLabels: { enabled: false },
      legend: { show: false },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  };

  return (
    <ApexCharts
      options={chartOptions[type]}
      series={chartOptions[type].series}
      type={type}
      height={270}
    />
  );
};

export default ApexChartComponent;
