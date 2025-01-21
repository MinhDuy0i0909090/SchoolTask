import React, { useState } from "react";
import { DatePicker, Typography, Card, Row, Col } from "antd";
import moment from "moment";

const { Title, Text } = Typography;
const { MonthPicker } = DatePicker;

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

function Income({ schedules }) {
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const totalIncomeForMonth = calculateIncome(schedules, selectedMonth);
  const formatNumber = (num) => num.toLocaleString("vi-VN");

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  return (
    <Card
      className="p-2 mt-3 "
      
    >
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Title level={4} style={{ margin: 0 }}>
            Monthly Income Overview
          </Title>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <MonthPicker
            onChange={handleMonthChange}
            defaultValue={selectedMonth ? selectedMonth : null}
            style={{ width: "100%" }}
            picker="month"
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Text type="secondary">
            Total Income for{" "}
            {selectedMonth ? selectedMonth.format("MMMM YYYY") : ""}:
          </Text>
          <Title level={2} style={{ margin: 0 }}>
            {selectedMonth ? formatNumber(totalIncomeForMonth) : 0} đ
          </Title>
        </Col>
      </Row>
    </Card>
  );
}

export default Income;
