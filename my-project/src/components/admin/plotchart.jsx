import { Column } from "@ant-design/charts";

function PlotChart({ attendance, studentsLength }) {
  // Check if attendance is defined and is an array
  if (!attendance || !Array.isArray(attendance)) {
    return <div>No data available</div>;
  }

  // Sort attendance records by timestamp in descending order and take the last 5 records
  const recentAttendance = attendance
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  // Process attendance data to match the desired format
  const processedData = recentAttendance.flatMap((record) => {
    const date = new Date(record.timestamp); // Convert to Date if it's not already a Date object
    return [
      {
        name: "Present",
        date: date.toLocaleDateString(), // Format as string
        count: record.students.length,
      },
      {
        name: "Absent",
        date: date.toLocaleDateString(), // Format as string
        count: studentsLength - record.students.length,
      },
    ];
  });
  const config = {
    data: processedData,
    xField: "date",
    yField: "count",
    seriesField: "name",
    colorField: "name",
    groupField: "name",
    style: {
      insetLeft: 5,
      insetTop: 10,
      fill: ({ name }) => {
        if (name === "Present") {
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
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
      </div>
      <Column className="p-2" {...config} />;
    </div>
  );
}

export default PlotChart;
