import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Input,
  Button,
  message,
  Empty,
  Form,
  Modal,
  Select,
  DatePicker,
} from "antd";
import moment from "moment";
import {
  addStudent,
  deleteStudent,
  fetchStudents,
  updateStudent,
} from "../../services/students";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { fetchClasses } from "../../services/classes";

function StudentPage() {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [form] = Form.useForm();

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const { data: classesData, isLoading: classLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const [filteredData, setFilteredData] = useState([]);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    if (students) {
      setFilteredData(students);
    }
  }, [students]);
  const mutationAddStudent = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries("students");
      message.success("Student added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to add student.");
    },
  });

  const mutationUpdateStudent = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries("students");
      message.success("Student updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to update student.");
    },
  });

  const mutationDeleteStudent = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries("students");
      message.success("Student deleted successfully!");
    },
    onError: () => {
      message.error("Failed to delete student.");
    },
  });

  function handleAddStudent() {
    setIsEditMode(false);
    setCurrentStudent(null);
    setIsModalVisible(true);
  }
  function handleEditStudent(record) {
    setIsEditMode(true);
    setCurrentStudent(record);
    form.setFieldsValue({
      name: record.name,
      gender: record.gender,
      date: moment(record.date),
      email: record.email,
      class: record.class,
      relative: record.relative,
      relativePhone: record.relativePhone,
      school: record.school,
    });
    setIsModalVisible(true);
  }

  function handleOk() {
    form
      .validateFields()
      .then((values) => {
        const studentData = {
          name: values.name,
          gender: values.gender,
          email: values.email,
          class: values.class,
          relative: values.relative,
          relativePhone: values.relativePhone,
          date: values.date ? moment(values.date).toDate() : null,
          school: values.school,
        };

        if (isEditMode) {
          studentData._id = currentStudent._id;
          mutationUpdateStudent.mutate(studentData);
        } else {
          mutationAddStudent.mutate(studentData);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  function handleCancel() {
    setIsModalVisible(false);
    form.resetFields();
  }
  function handleDeleteStudent(studentId) {
    Modal.confirm({
      title: `Are you sure you want to delete this student?`,

      footer: (
        <>
          <div className="flex justify-end mt-3">
            <button
              onClick={() => Modal.destroyAll()} // Close modal on cancel
              className="bg-gray-400 text-white w-14 h-9  rounded-md border-none self-center"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                mutationDeleteStudent.mutate(studentId, {
                  onSuccess: () => {
                    Modal.destroyAll(); // Close modal on success
                  },
                })
              } // Delete action
              className="bg-red-500 text-white w-14 h-9  ml-2 rounded-md border-none self-center"
            >
              Delete
            </button>
          </div>
        </>
      ),
    });
  }
  function handleSearch(event) {
    const { value } = event.target;
    const filtered = students.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.gender.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.class.toLowerCase().includes(value.toLowerCase()) ||
        item.relative.toLowerCase().includes(value.toLowerCase()) ||
        item.relativePhone.toLowerCase().includes(value.toLowerCase()) ||
        item.school.toLowerCase().includes(value.toLowerCase()) ||
        moment(item.date)
          .format("YYYY-MM-DD")
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  }

  function handleTableChange(pagination, filters, sorter) {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setFilteredData([]);
    }
  }

  const columns = [
    {
      dataIndex: "id",
      key: "id",
      with: "2%",
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
      width: "8%",
      sorter: (a, b) => a.gender.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
    },
    {
      title: "Date of Birth",
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (text, record) => moment(record.date).format("YYYY-MM-DD "),
    },
    {
      title: "Class",
      dataIndex: "class",
      width: "5%",
      sorter: (a, b) => a.class.localeCompare(b.class),
    },
    {
      title: "School",
      dataIndex: "school",
      width: "15%",
      sorter: (a, b) => a.school.localeCompare(b.school),
    },
    {
      title: "Relative",
      dataIndex: "relative",
      width: "15%",
      sorter: (a, b) => a.relative.localeCompare(b.relative),
    },
    {
      title: "Relative Phone",
      dataIndex: "relativePhone",
      width: "15%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "5%",
      render: (text, record) => (
        <>
          <div className="flex justify-around gap-3">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c3ebfa]  "
              onClick={() => handleEditStudent(record)}
            >
              {" "}
              <div className="p-2 ">
                <Pencil size={13} color="#ffffff" />
              </div>
            </button>
            <button
              onClick={() => handleDeleteStudent(record._id)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF] "
            >
              <div className="p-2 ">
                <Trash2 size={14} color="#ffffff" />
              </div>
            </button>
          </div>
        </>
      ),
    },
  ];

  if (studentsLoading)
    return (
      <div>
        <Empty />
      </div>
    );

  return (
    <div className="bg-white w-[97%] ml-2 ">
      <div className="p-2 ">
        <div className="p-2 flex justify-between">
          <h2 className="hidden md:block text-lg font-semibold">
            {" "}
            All Students
          </h2>
          <div className="flex gap-3">
            <Input
              style={{ borderRadius: "13px" }}
              placeholder="search..."
              onChange={handleSearch}
              prefix={<Search size={15} strokeWidth={1} />}
              className="w-[15rem] "
            />
            <button
              onClick={handleAddStudent}
              className="w-8 h-8 flex items-center justify-center bg-cyan-300 rounded-full"
            >
              <Plus size={15} strokeWidth={3} color="#ffffff" />
            </button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={tableParams.pagination}
          loading={studentsLoading}
          onChange={handleTableChange}
          rowKey="id"
          className=" rounded-none"
        />
      </div>
      <Modal
        title={isEditMode ? "Edit Student" : "Create a new student"}
        open={isModalVisible}
        onOk={handleOk}
        width="800px"
        onCancel={handleCancel}
        footer={[
          <button
            key="cancel"
            className="bg-gray-400 text-white w-14 h-9 rounded-md border-none self-center"
            onClick={handleCancel}
          >
            Cancel
          </button>,
          <button
            key="submit"
            className="bg-blue-400 text-white w-14 h-9  rounded-md border-none self-center ml-4"
            onClick={handleOk}
          >
            {isEditMode ? "Save" : "Create"}
          </button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="classForm"
          className="mt-2 p-2"
        >
          {/* Row 1: Student Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Student Name"
              rules={[
                { required: true, message: "Please input the student name!" },
              ]}
            >
              <Input placeholder="Enter the student's name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input a valid email address!",
                },
              ]}
            >
              <Input placeholder="Enter the student's email" />
            </Form.Item>
          </div>

          {/* Row 2: Date of Birth and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Date of Birth"
              rules={[
                { required: true, message: "Please select the date of birth!" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select the gender!" }]}
            >
              <Select
                placeholder="Select gender"
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
              />
            </Form.Item>
          </div>

          {/* Row 3: Relative and Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="relative"
              label="Relative"
              rules={[
                {
                  required: true,
                  message: "Please input the relative's name!",
                },
              ]}
            >
              <Input placeholder="Enter the relative's name" />
            </Form.Item>
            <Form.Item
              name="relativePhone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please input the phone number!" },
              ]}
            >
              <Input placeholder="Enter the phone number" />
            </Form.Item>
          </div>

          {/* Row 4: School and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="school"
              label="School"
              rules={[{ required: true, message: "Please select a school!" }]}
            >
              <Select
                placeholder="Select a school"
                onChange={(value) => {
                  const selectedSchoolData = classesData.filter(
                    (cls) => cls.school === value
                  );
                  setSelectedClass(selectedSchoolData);
                  form.setFieldsValue({ class: null }); // Reset class selection
                }}
              >
                {classesData
                  .map((cls) => cls.school)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((school) => (
                    <Select.Option key={school} value={school}>
                      {school}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="class"
              label="Class"
              rules={[{ required: true, message: "Please select a class!" }]}
            >
              <Select placeholder="Select a class">
                {selectedClass &&
                  selectedClass.map((cls) => (
                    <Select.Option key={cls.name} value={cls.name}>
                      {cls.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default StudentPage;
