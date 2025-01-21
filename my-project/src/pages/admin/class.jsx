import React, { useEffect, useState } from "react";
import {
  Layout,
  Button,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Empty,
  Spin,
} from "antd";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addClass,
  deleteClass,
  fetchClasses,
  updateClass,
} from "../../services/classes";
import { fetchSchedules } from "../../services/schedules";
import { fetchStudents } from "../../services/students";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

const { Content } = Layout;

const localizer = momentLocalizer(moment);
function ClassComponent() {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredClass, setFilteredClass] = useState([]);
  const [view, setView] = useState(Views.WORK_WEEK);
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);

  const [form] = Form.useForm();

  const { data: classesData, isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const { data: schedulesData, isLoading: schedulesLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });
  useEffect(() => {
    if (
      selectedClassId &&
      selectedClass &&
      selectedSchool &&
      studentsData
      // schedulesData
    ) {
      const classStudents = studentsData.filter(
        (student) =>
          student.class === selectedClass && student.school === selectedSchool
      );
      setStudents(classStudents);
      setFilteredClass(classesData);
      const classSchedule = schedulesData.filter(
        (cls) => cls.class === selectedClass && cls.school === selectedSchool
      );

      const classEvents = classSchedule.map((event) => ({
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(classEvents);
    }
    if (classesData) {
      setFilteredClass(classesData);
    }
  }, [
    selectedClassId,
    selectedClass,
    selectedSchool,
    studentsData,
    schedulesData,
    classesData,
  ]);

  const mutationAddClass = useMutation({
    mutationFn: addClass,
    onSuccess: () => {
      queryClient.invalidateQueries("classes");
      message.success("Class added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to add class.");
    },
  });

  const mutationUpdateClass = useMutation({
    mutationFn: updateClass,
    onSuccess: () => {
      queryClient.invalidateQueries("classes");
      message.success("Class updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to update class.");
    },
  });

  const mutationDeleteClass = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries("classes");
      message.success("Class deleted successfully!");
    },
    onError: () => {
      message.error("Failed to delete class.");
    },
  });

  const handleAddClass = () => {
    setIsEditMode(false);
    setCurrentClass(null);
    setIsModalVisible(true);
  };

  const handleEditClass = (record) => {
    setIsEditMode(true);
    setCurrentClass(record);
    form.setFieldsValue({
      name: record.name,
      school: record.school,
      date: moment(record.date),
    });
    setSelectedClassId(record._id); // Set the selected class ID
    setIsModalVisible(true);
  };

  const handleClassClick = (record) => {
    setSelectedClass(record.name);
    setSelectedSchool(record.school);
    setSelectedClassId(record._id);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchText) ||
      student.gender.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText) ||
      student.relative.toLowerCase().includes(searchText) ||
      student.relativePhone.includes(searchText)
  );
  function handleSearchCLass(event) {
    const { value } = event.target;

    const filtered = classesData.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.school.toLowerCase().includes(value.toLowerCase()) ||
        moment(item.date)
          .format("YYYY-MM-DD")
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    setFilteredClass(filtered);
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const classData = {
          name: values.name,
          school: values.school,
          date: values.date ? values.date.format("YYYY-MM-DD") : null,
        };

        if (isEditMode) {
          classData._id = currentClass._id;
          console.log(classData._id);
          mutationUpdateClass.mutate(classData);
        } else {
          mutationAddClass.mutate(classData);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const handleDeleteClass = (classId) => {
    console.log("Class ID:", classId);
    Modal.confirm({
      title: `Are you sure you want to delete this class?`,
      footer: (
        <>
          <div className="flex justify-end mt-3">
            <button
              onClick={() => Modal.destroyAll()} // Close modal on cancel
              className=" bg-gray-400 text-white w-14 h-9  rounded-md border-none self-center"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                mutationDeleteClass.mutate(classId, {
                  onSuccess: () => {
                    Modal.destroyAll(); 
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
  };
  const handleOnChangeView = (selectedView) => {
    setView(selectedView);
  };

  // Dummy data for columns
  const classColumns = [
    {
      dataIndex: "id",
      key: "id",
      with: "2%",
      render: (id, record, index) => {
        ++index;
        return index;
      },
    },
    { title: "Class Name", dataIndex: "name", key: "name" },
    { title: "School", dataIndex: "school", key: "school" },
    {
      title: "Number of Students",
      dataIndex: "numStudents",
      key: "numStudents",
      render: (_, cls) =>
        studentsData.filter(
          (student) =>
            student.class === cls.name && student.school === cls.school
        ).length,
    },
    {
      title: "Due Class",
      dataIndex: "date",
      key: "date",
      render: (text, record) => moment(record.date).format("YYYY-MM-DD "),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (text, record) => (
        <>
          <div className="flex gap-3">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c3ebfa]  "
              onClick={() => handleEditClass(record)}
            >
              {" "}
              <div className="p-2 ">
                <Pencil size={13} color="#ffffff" />
              </div>
            </button>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF]   "
              onClick={() => handleDeleteClass(record._id)}
            >
              {" "}
              <div className="p-2 ">
                <Trash2 size={14} color="#ffffff" />
              </div>
            </button>
          </div>
        </>
      ),
    },
  ];

  const studentColumns = [
    {
      dataIndex: "id",
      key: "id",
      with: "2%",
      render: (id, record, index) => {
        ++index;
        return index;
      },
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "School", dataIndex: "school", key: "school" },
    { title: "Relative", dataIndex: "relative", key: "relative" },
    {
      title: "Relative Phone",
      dataIndex: "relativePhone",
      key: "relativePhone",
    },
  ];

  if (!classesData || !studentsData || !schedulesData)
    return (
      <div>
        <Empty />
      </div>
    );
  if (classesLoading || studentsLoading || schedulesLoading) {
    return (
      <Spin
        tip="Loading..."
        className="flex justify-center items-center h-screen"
      />
    );
  }
  return (
    <Layout className="min-h-screen ml-4 w-[98%] bg-white">
      <Content className="p-6   ">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold mb-2">Classes</h2>
          <div className="flex gap-3">
            <Input
              style={{ borderRadius: "13px" }}
              placeholder="search..."
              onChange={handleSearchCLass}
              prefix={<Search size={15} strokeWidth={1} />}
              className="w-[15rem] "
            />
            <button
              onClick={handleAddClass}
              className="w-8 h-8 flex items-center justify-center bg-cyan-300 rounded-full border-none"
            >
              <Plus size={15} strokeWidth={3} color="#ffffff" />
            </button>
          </div>
        </div>

        <Table
          columns={classColumns}
          dataSource={filteredClass}
          loading={classesLoading}
          onRow={(record) => ({
            onClick: () => handleClassClick(record),
          })}
          pagination={false}
          className="mb-6"
          rowKey="id"
        />

        {selectedClass && (
          <>
            <h2 className="text-lg font-semibold mb-2">
              Class {selectedClass}
            </h2>
            <Input
              style={{ borderRadius: "13px" }}
              placeholder="search..."
              onChange={handleSearch}
              prefix={<Search size={15} strokeWidth={1} />}
              className="w-[15rem] "
            />
            <Table
              columns={studentColumns}
              dataSource={filteredStudents}
              loading={studentsLoading}
              pagination={true}
              className="mb-6"
              rowKey="id"
            />

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Class Schedule</h2>
              {events.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  views={["work_week", "day"]}
                  style={{ height: 500 }}
                  view={view}
                  onView={handleOnChangeView}
                  min={new Date(new Date().getFullYear(), 0, 1, 8, 0, 0)}
                  max={new Date(new Date().getFullYear(), 0, 1, 17, 0, 0)}
                />
              )}
            </div>
          </>
        )}
        <Modal
          title={isEditMode ? "Edit Class" : "Create a new class"}
          open={isModalVisible}
          onOk={handleOk}
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
          <Form form={form} layout="vertical" name="classForm">
            <Form.Item
              name="name"
              label="Class Name"
              rules={[
                { required: true, message: "Please input the class name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="school"
              label="School"
              rules={[
                { required: true, message: "Please input the school name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[
                { required: true, message: "Please select end of semester!" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default ClassComponent;
