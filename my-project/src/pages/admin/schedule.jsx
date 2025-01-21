import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Layout,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Spin,
  Empty,
} from "antd";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Income from "../../components/admin/totalincome";
import { fetchClasses } from "../../services/classes";
import {
  addSchedule,
  deleteSchedule,
  fetchSchedules,
  updateSchedule,
} from "../../services/schedules";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const localizer = momentLocalizer(moment);

function SchedulePage() {
  const queryClient = useQueryClient();
  const [schedules, setSchedules] = useState([]);
  const [view, setView] = useState(Views.WORK_WEEK);
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [form] = Form.useForm();

  const [selectedClass, setSelectedClass] = useState(null);

  const { data: classesData, isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });
  const { data: schedulesData, isLoading: schedulesLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });

  const mutationAddSchedule = useMutation({
    mutationFn: addSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries("schedules");
      message.success("Schedule added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to add schedule.");
    },
  });

  const mutationUpdateSchedule = useMutation({
    mutationFn: updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries("schedules");
      message.success("Schedule updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to update schedule.");
    },
  });

  const mutationDeleteSchedule = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries("schedules");
      message.success("Schedule deleted successfully!");
    },
    onError: () => {
      message.error("Failed to delete schedule.");
    },
  });

  useEffect(() => {
    if (schedulesData) {
      const scheduleEvents = schedulesData.map((schedule) => ({
        ...schedule,
        start: new Date(schedule.start),
        end: new Date(schedule.end),
      }));
      setSchedules(schedulesData);
      setEvents(scheduleEvents);
    }
  }, [schedulesData]);

  if (classesLoading || schedulesLoading)
    return (
      <Spin
        tip="Loading..."
        className="flex justify-center items-center h-screen"
      />
    );
  if (!classesData || !schedulesData)
    return (
      <div>
        <Empty />
      </div>
    );

  const handleAddSchedule = () => {
    setIsEditMode(false);
    setCurrentSchedule(null);
    setIsModalVisible(true);
  };

  const handleEditSchedule = (schedule) => {
    setIsEditMode(true);
    setCurrentSchedule(schedule);
    form.setFieldsValue({
      title: schedule.title,
      date: moment(schedule.date),
      range: [moment(schedule.start), moment(schedule.end)],
      hourlyRate: schedule.hourlyRate,
      class: schedule.class,
      school: schedule.school,
    });
    setIsModalVisible(true);
  };

  const handleDeleteSchedule = (scheduleId) => {
    Modal.confirm({
      title: `Are you sure you want to delete this schedule?`,
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
                mutationDeleteSchedule.mutate(scheduleId, {
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

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const scheduleData = {
          title: values.title,
          start: values.range[0].toISOString(),
          end: values.range[1].toISOString(),
          hourlyRate: values.hourlyRate,
          class: values.class,
          school: values.school,
        };

        if (isEditMode) {
          scheduleData._id = currentSchedule._id;
          mutationUpdateSchedule.mutate(scheduleData);
        } else {
          mutationAddSchedule.mutate(scheduleData);
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

  const scheduleColumns = [
    {
      dataIndex: "id",
      key: "id",
      with: "2%",
      render: (id, record, index) => {
        ++index;
        return index;
      },
    },
    { title: "Title", dataIndex: "title", key: "title", width: "15%" },
    { title: "Class", dataIndex: "class", key: "class", width: "15%" },
    { title: "School", dataIndex: "school", key: "school", width: "15%" },
    {
      title: "Start Time",
      dataIndex: "start",
      key: "start",
      width: "15%",
      render: (text, record) => moment(record.start).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "End Time",
      dataIndex: "end",
      key: "end",
      width: "15%",
      render: (text, record) => moment(record.end).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Hourly Rate",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      width: "15%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <div className="flex justify-around gap-3">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c3ebfa]  "
              onClick={() => handleEditSchedule(record)}
            >
              {" "}
              <div className="p-2 ">
                <Pencil size={13} color="#ffffff" />
              </div>
            </button>
            <button
              onClick={() => handleDeleteSchedule(record._id)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF]   "
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

  const handleOnChangeView = (selectedView) => {
    setView(selectedView);
  };
  const Event = ({ event }) => {
    const formatNumber = (num) => num.toLocaleString("vi-VN");
    const start = moment(event.start);
    const end = moment(event.end);
    const duration = moment.duration(end.diff(start));
    const totalHours = duration.asHours(); // Get total hours as a number
    const totalCost = totalHours * event.hourlyRate; // Calculate total cost
    return (
      <div className=" flex flex-col gap-2">
        <span>{totalHours} hour</span>
        <strong>{formatNumber(totalCost * 1000)}đ</strong>
      </div>
    );
  };

  return (
    <Layout className="min-h-screen w-[98%] ml-2   bg-white">
      <Content className="p-6  gap-3">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold mb-2">Schedules</h2>
          <div className="flex gap-3">
            <Input
              style={{ borderRadius: "13px" }}
              placeholder="search..."
              // onChange={handleSearchCLass}
              prefix={<Search size={15} strokeWidth={1} />}
              className="w-[15rem] "
            />
            <button
              onClick={handleAddSchedule}
              className="w-8 h-8 flex items-center justify-center bg-cyan-300 rounded-full"
            >
              <Plus size={15} strokeWidth={3} color="#ffffff" />
            </button>
          </div>
        </div>
        <Table
          columns={scheduleColumns}
          dataSource={schedules}
          pagination={true}
          className="mb-6"
        />

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Class Schedule</h2>
          {events.length === 0 ? (
            <p>No events scheduled for this class.</p>
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
              min={new Date(new Date().getFullYear(), 0, 1, 7, 0, 0)}
              max={new Date(new Date().getFullYear(), 0, 1, 18, 0, 0)}
              components={{
                event: Event, // Pass the custom Event component
              }}
            />
          )}
        </div>

        <Modal
          title={isEditMode ? "Edit Schedule" : "Create new schedule"}
          open={isModalVisible}
          onOk={() => form.submit()}
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
            name="scheduleForm"
           
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="range"
              label="Time Range"
              rules={[
                { required: true, message: "Please select the time range!" },
              ]}
            >
              <RangePicker showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>
            <Form.Item
              name="hourlyRate"
              label="Hourly Rate"
              rules={[
                { required: true, message: "Please input the hourly rate!" },
              ]}
            >
              <Input suffix=".000đ" type="number" />
            </Form.Item>
            <Form.Item
              name="school"
              label="School"
              rules={[{ required: true, message: "Please select a school!" }]}
            >
              <Select
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
                      {" "}
                      {school}{" "}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="class"
              label="Class"
              rules={[{ required: true, message: "Please select a class!" }]}
            >
              <Select>
                {selectedClass &&
                  selectedClass.map((cls) => (
                    <Select.Option key={cls.name} value={cls.name}>
                      {" "}
                      {cls.name}{" "}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Income schedules={schedulesData} />
      </Content>
    </Layout>
  );
}

export default SchedulePage;
