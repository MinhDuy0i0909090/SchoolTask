import React, { useState } from "react";
import {
  Calendar,
  Modal,
  Button,
  List,
  Form,
  Input,
  TimePicker,
  message,
  Empty,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import {
  addEvents,
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "../../services/events";
import { Pencil, Trash2 } from "lucide-react";

const MyCalendar = () => {
  const queryClient = useQueryClient();

  // Fetch dữ liệu sự kiện
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    onSuccess: (data) => {
      console.log("Fetched events:", data);
    },
  });

  const addEventMutation = useMutation({
    mutationFn: addEvents,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      message.success("Add event successfully!");
    },
  });
  const editEventMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      message.success("Update event successfully!");
    },
  });
  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      message.success("Delete event successfully!");
    },
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState(null); // Sự kiện đang chỉnh sửa

  // Lấy danh sách sự kiện của ngày được chọn
  const eventsByDate = (date) => {
    const selectedDate = new Date(date).toISOString().split("T")[0]; // Lấy phần ngày (YYYY-MM-DD)
    return events.filter((event) => event.date.split("T")[0] === selectedDate);
  };

  // Mở modal với danh sách sự kiện
  const handleSelectDate = (value) => {
    const date = value.format("YYYY-MM-DD");
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    form.resetFields();
  };

  const handleSaveEvent = () => {
    form.validateFields().then((values) => {
      const newEvent = {
        date: selectedDate,
        time: `${values.time[0].format("HH:mm")} - ${values.time[1].format(
          "HH:mm"
        )}`,
        title: values.title,
        content: values.content,
      };

      if (editingEvent) {
        editEventMutation.mutate({ ...newEvent, _id: editingEvent._id });
      } else {
        addEventMutation.mutate(newEvent);
      }

      handleCloseModal();
    });
  };

  // Delete event
  const handleDeleteEvent = (item) => {
    deleteEventMutation.mutate(item._id);
  };

  const dateCellRender = (value) => {
    const date = value.format("YYYY-MM-DD");
    const dayEvents = eventsByDate(date);
    // console.log(dayEvents)
    return dayEvents.length > 0 ? (
      <ul>
        {dayEvents.map((event) => (
          <li key={event._id} style={{ color: "blue" }}>
            {event.title}
          </li>
        ))}
      </ul>
    ) : null;
  };

  if (isLoading)
    return (
      <div>
        {" "}
        <Empty />
      </div>
    );

  return (
    <div>
      <Calendar dateCellRender={dateCellRender} onSelect={handleSelectDate} />

      <Modal
        title={`Event in ${selectedDate}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <button
            key="cancel"
            className="bg-gray-400 text-white w-14 h-9 rounded-md border-none self-center"
            onClick={handleCloseModal}
          >
            Cancel
          </button>,
          <button
            key="submit"
            className="bg-blue-400 text-white w-14 h-9  rounded-md border-none self-center ml-4"
            onClick={handleSaveEvent}
          >
            Create
          </button>,
        ]}
      >
        <List
          itemLayout="horizontal"
          dataSource={eventsByDate(selectedDate)}
          renderItem={(item) => (
           
              <List.Item
                actions={[
                  <button
                    key="edit"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c3ebfa]  "
                    onClick={() => {
                      setEditingEvent(item);
                      form.setFieldsValue({
                        title: item.title,
                        content: item.content,
                        time: [
                          moment(item.time.split(" - ")[0], "HH:mm"),
                          moment(item.time.split(" - ")[1], "HH:mm"),
                        ],
                      });
                    }}
                  >
                    <Pencil size={13} color="#ffffff" />
                  </button>,
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF]   "
                    key="delete"
                    onClick={() => handleDeleteEvent(item)}
                  >
                    <Trash2 size={14} color="#ffffff" />
                  </button>,
                ]}
              >
                <List.Item.Meta
                className="p-2"
                  title={`${item.time} - ${item.title}`}
                  description={item.content}
                />
              </List.Item>
          
          )}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEvent}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="time"
            label="Date"
            rules={[{ required: true, message: "Please choose a date!" }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyCalendar;
