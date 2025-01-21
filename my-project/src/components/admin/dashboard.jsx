import { Card, Skeleton } from "antd";
import { Ellipsis } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import CalendarSmall from "./calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStudents } from "../../services/students";
import PieChart from "./piechart";
import PlotChart from "./plotchart";
import { fetchAttendance } from "../../services/attendance";
import { fetchSchedules } from "../../services/schedules";
import LineChartComponent from "./linechart";
import moment from "moment";
import { fetchClasses } from "../../services/classes";
function calculateIncome(schedules, specificMonth = null) {
  const hourlyRate = (rate) => parseFloat(rate);

  // Filter by month
  const filteredSchedules = schedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.start);
    if (specificMonth) {
      const specific = new Date(specificMonth);
      return (
        scheduleDate.getFullYear() === specific.getFullYear() &&
        scheduleDate.getMonth() === specific.getMonth()
      );
    }
    return scheduleDate.getMonth() === new Date().getMonth();
  });

  // Calculate total income
  return filteredSchedules.reduce((total, schedule) => {
    const start = new Date(schedule.start);
    const end = new Date(schedule.end);
    const hoursWorked = (end - start) / (1000 * 60 * 60); // Calculate duration in hours
    return total + hoursWorked * hourlyRate(schedule.hourlyRate) * 1000;
  }, 0);
}
function Dashboard() {
  const [filterData, setFilteredData] = useState([]);
  const { data: classesData, isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: fetchAttendance,
  });
  const { data: schedule = [], isLoading: schduleLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });
  console.log(classesData);
  const currentMonth = moment().format("YYYY/MM");
  const formatNumber = (num) => num.toLocaleString("vi-VN");
  const totalIncomeForMonth = useMemo(
    () => calculateIncome(schedule, currentMonth),
    [schedule, currentMonth]
  );
  useEffect(() => {
    if (students) {
      setFilteredData(students);
    }
  }, [students]);
  const result =
    classesData && Array.isArray(classesData)
      ? classesData.reduce(
          (acc, item) => {
            // Add school to the Set (unique schools)
            acc.schools.add(item.school);

            // Increment the class count
            acc.classes++;

            return acc;
          },
          { schools: new Set(), classes: 0 } // Initialize with a Set for unique schools and a counter for classes
        )
      : { schools: new Set(), classes: 0 };
  const cardItems = [
    { label: "Schools", number: result.schools?.size },
    { label: "Classes", number: result.classes },
    { label: "Students", number: students?.length || 0 },
    { label: "Income", number: formatNumber(totalIncomeForMonth) },
  ];
  if (
    classesLoading &&
    studentsLoading &&
    attendanceLoading &&
    schduleLoading
  ) {
    return <Skeleton />;
  }
  return (
    <div className="flex flex-col mx-4 gap-5 sm:flex-col md:flex-col lg:flex-row lg:justify-start  xl:flex-row ">
      {/* left */}
      <div className="w-[65%] sm:w-full md:w-full lg:w-[65%]  ">
        {/* card */}
        <div className="flex gap-4 justify-between  ">
          {cardItems.map((item) => (
            <div
              key={item.label}
              className="w-[14.5rem] h-[6.5rem] bg-yellow-200 odd:bg-purple-300 rounded-xl sm:h-[5.8rem] sm:w-[20rem]  md:w-[10rem]  "
            >
              <div className="flex flex-col gap-1 p-1  ">
                <div className="gap-1 flex justify-between mx-2  ">
                  <div>
                    <span className="rounded-full p-1 px-[0.5rem] text-green-500  bg-white text-[0.6rem] font-light ">
                      2023/25
                    </span>
                  </div>
                  <Ellipsis color="#ffffff" />
                </div>
                <span className="text-lg font-bold mx-2">{item.number}</span>

                <span className="text-sm font-thin mx-2">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
        {/* chart */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-center gap-3 w-full mt-3 md:flex-row md:justify-start lg:flex-row ">
            {/* pie chart */}
            <div className="bg-white w-[30rem] h-[23rem] rounded-md sm:w-[35rem] md:w-[30%] lg:w-[40%] lg:h-[20rem] xl:w-[450%]  ">
              <PieChart filteredData={filterData} />
            </div>
            <div className="bg-white w-[30rem] h-[23rem] rounded-md sm:w-[35rem] md:w-[70%] lg:w-[60%] lg:h-[20rem] xl:w-[550%] ">
              <PlotChart
                attendance={attendance}
                studentsLength={students ? students.length : 0}
              />
            </div>
          </div>
          <div className="bg-white w-[30rem] h-[20rem] rounded-md sm:w-full md:w-full lg:w-full ">
            <LineChartComponent />
          </div>
        </div>
      </div>

      {/* right */}
      <div className="bg-white w-full flex flex-col rounded-md items-center sm:w-full md:w-full xl:w-[55%]">
        <CalendarSmall />
      </div>
    </div>
  );
}

export default Dashboard;
