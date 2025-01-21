import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, message, Input } from "antd";

import { CalendarPlus2, Search } from "lucide-react";
import { fetchStudents } from "../../services/students";
import { fetchAttendance, submitAttendance } from "../../services/attendance";

function TableReader() {
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [filteredData, setFilteredData] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const {
    data: students,
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: fetchAttendance,
  });

  useEffect(() => {
    if (students) {
      setFilteredData(students);
    }
  }, [students]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (Array.isArray(attendance)) {
      const todayAttendance = attendance.find(
        (record) => record.timestamp.split("T")[0] === today
      );

      if (todayAttendance) {
        setSubmitDisabled(true);
      }
    }
  }, [attendance]);

  const mutationAttendance = useMutation({
    mutationFn: submitAttendance,
    onSuccess: () => {
      message.success("Attendance saved successfully!");
      queryClient.invalidateQueries("students");
      window.location.reload();
    },
    onError: () => {
      message.error("Failed to save attendance.");
    },
  });

  if (studentsLoading) return <div>Loading...</div>;
  if (studentsError) return <div>Error: {studentsError.message}</div>;

  function onSelectChange(newSelectedRowKeys) {
    setSelectedRowKeys(newSelectedRowKeys);
  }

  const handleSubmit = () => {
    const selectedStudents = students.filter((student) =>
      selectedRowKeys.includes(student._id)
    );
    const attendanceSelected = {
      timestamp: new Date().toISOString().split("T")[0],
      students: selectedStudents,
    };
    mutationAttendance.mutate(attendanceSelected);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  function handleSearch(event) {
    const { value } = event.target;
    const filtered = students.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.gender.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.class.toLowerCase().includes(value.toLowerCase()) ||
        item.relative.toLowerCase().includes(value.toLowerCase()) ||
        item.relativePhone.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  }

  function handleTableChange(pagination, filters, sorter) {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setFilteredData([]);
    }
  }

  const columns = [
    {
      dataIndex: "id",
      key: "id",
      with: "5%",
      render: (id, record, index) => {
        ++index;
        return index;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "15%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: "10%",
      sorter: (a, b) => a.gender.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "Class",
      dataIndex: "class",
      width: "10%",
      sorter: (a, b) => a.class.localeCompare(b.class),
    },
    {
      title: "School",
      dataIndex: "school",
      width: "10%",
      sorter: (a, b) => a.school.localeCompare(b.school),
    },
    {
      title: "Relative",
      dataIndex: "relative",
      width: "20%",
      sorter: (a, b) => a.relative.localeCompare(b.relative),
    },
    {
      title: "Relative Phone",
      dataIndex: "relativePhone",
      width: "20%",
      sorter: (a, b) => a.relativePhone.localeCompare(b.relativePhone),
    },
  ];

  return (
    <div className="bg-white w-[97%] ml-2 ">
      <div className="p-2 ">
        <div className="p-2 flex justify-between">
          <h2 className="hidden md:block text-lg font-semibold"> Attendance</h2>
          <div className="flex gap-3">
            <Input
              style={{ borderRadius: "13px" }}
              placeholder="search..."
              onChange={handleSearch}
              prefix={<Search size={15} strokeWidth={1} />}
              className="w-[15rem] "
            />
            <button
              onClick={handleSubmit}
              disabled={submitDisabled}
              className={`w-8 h-8 flex items-center justify-center bg-cyan-300 rounded-full text-white ${
                submitDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-cyan-300 "
              }`}
            >
              <CalendarPlus2 size={15} strokeWidth={2} color="#ffffff" />
            </button>
          </div>
        </div>
      </div>
      <Table
        pagination={tableParams.pagination}
        columns={columns}
        dataSource={filteredData.map((student) => ({
          ...student,
          key: student._id,
        }))}
        onChange={handleTableChange}
        rowSelection={submitDisabled ? null : rowSelection}
      />
    </div>
  );
}

export default TableReader;
