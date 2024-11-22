"use client"; // Add this line at the top

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ApexChart and disable server-side rendering
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ApexChartComponent = () => {
  const [series, setSeries] = React.useState([
    {
      name: "Sales",
      data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5],
    },
  ]);

  const [options, setOptions] = React.useState({
    chart: {
      type: "line",
      height: "100%", // Make the chart height responsive
      width: "100%", // Make the chart width responsive
    },
    responsive: [
      {
        breakpoint: 768, // Mobile breakpoint
        options: {
          chart: {
            width: "100%", // Adjust width for mobile
          },
          stroke: {
            width: 3, // Adjust stroke width for mobile
          },
        },
      },
    ],
    forecastDataPoints: {
      count: 7,
    },
    stroke: {
      width: 5,
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "1/11/2000",
        "2/11/2000",
        "3/11/2000",
        "4/11/2000",
        "5/11/2000",
        "6/11/2000",
        "7/11/2000",
        "8/11/2000",
        "9/11/2000",
        "10/11/2000",
        "11/11/2000",
        "12/11/2000",
        "1/11/2001",
        "2/11/2001",
        "3/11/2001",
        "4/11/2001",
        "5/11/2001",
        "6/11/2001",
      ],
      tickAmount: 10,
      labels: {
        formatter: function (value, timestamp, opts) {
          return opts.dateFormatter(new Date(timestamp), "dd MMM");
        },
      },
    },
    title: {
      text: "Daily Activities",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#FDD835"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
  });

  return (
    <div className="w-full h-auto">
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" />
      </div>
    </div>
  );
};

export default ApexChartComponent;
