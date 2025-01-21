import { RadialBar } from "@ant-design/charts";
import React from "react";

function PieChart({ filteredData }) {
  function getGenderCount() {
    const maleCount = filteredData.filter(
      (student) => student.gender === "Male"
    ).length;
    const femaleCount = filteredData.filter(
      (student) => student.gender === "Female"
    ).length;
    return [
      { name: "Male", star: maleCount },
      { name: "Female", star: femaleCount },
    ];
  }
  const radialBarConfig = {
    data: getGenderCount(),
    xField: "name",
    yField: "star",
    maxAngle: 270, // 270 degrees since full circle is 360
    radius: 1,
    innerRadius: 0.3,
    barBackground: {},
    barStyle: {
      lineCap: "round",
    },
    colorField: "name",
    style: {
      fill: ({ name }) => {
        if (name == "Male") {
          return "#fef08a";
        }
        return "#d8b4fe";
      },
    },
    scale: {  
      color: {
        range: ["#fef08a", "#d8b4fe"],
      },
    },
    // color: ({ name }) => (name === "Male" ? "#e9d5ff" : "#f5222d"), // Different colors for Male and Female
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
      </div>
      <RadialBar {...radialBarConfig} />
    </div>
  );
}

export default PieChart;
