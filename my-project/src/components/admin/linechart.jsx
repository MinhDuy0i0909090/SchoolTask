import React from "react";
import { Line } from "@ant-design/plots";

const data = [
  {
    name: "Jan",
    income: 4000,
    expense: 2400,
  },
  {
    name: "Feb",
    income: 3000,
    expense: 1398,
  },
  {
    name: "Mar",
    income: 2000,
    expense: 9800,
  },
  {
    name: "Apr",
    income: 2780,
    expense: 3908,
  },
  {
    name: "May",
    income: 1890,
    expense: 4800,
  },
  {
    name: "Jun",
    income: 2390,
    expense: 3800,
  },
  {
    name: "Jul",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Aug",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Sep",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Oct",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Nov",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Dec",
    income: 3490,
    expense: 4300,
  },
];

const config = {
  data,
  padding: "auto",
  xField: "name",
  yField: "value",
  seriesField: "type",
  colorField: "type",
  scale: {
    type: {
      range: ["#fef08a", "#d8b4fe"],
    },
  },
  lineStyle: {
    lineWidth: 4,
  },
  // point: {
  //   size: 5,
  //   shape: "circle",
    
  //   style: {
  //     fill: ({ type }) => {
  //       if (type == "income") {
  //         return "#fef08a";
  //       }
  //       return "#d8b4fe";
  //     },
  //   },
  // },
  tooltip: {
    showMarkers: false,
  },
  legend: {
    position: "top",
  },
};

const LineChartComponent = () => {
  const transformedData = data.flatMap(({ name, income, expense }) => [
    { name, type: "income", value: income },
    { name, type: "expense", value: expense },
  ]);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
      </div>
      <Line {...config} data={transformedData} />
    </div>
  );
};

export default LineChartComponent;
