import React, { useEffect, useState } from "react";
import { Calendar, Empty, theme } from "antd";
import { useQuery } from "@tanstack/react-query"; // Import useQuery from react-query
import { Ellipsis } from "lucide-react";
import { fetchEvents } from "../../services/events";

// Fetch events function using the selected date

function CalendarSmall() {
  const { token } = theme.useToken();
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    onSuccess: (data) => {
      console.log("Fetched events:", data);
    },
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setSelectedDate(today); // Set the state with today's date
  }, []);
  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  function onSelected(value) {
    const selectedDateString = value.format("YYYY-MM-DD"); // Get the formatted date string
    setSelectedDate(selectedDateString);
  }
  function eventsByDate(date) {
    // Lấy phần ngày (YYYY-MM-DD)
    return events.filter((event) => event.date.split("T")[0] === selectedDate);
  }
  const eventCount = eventsByDate(selectedDate).length;
  console.log(eventCount);

  const wrapperStyle = {
    width: 380,
    borderRadius: token.borderRadiusLG,
  };

  return (
    <div style={wrapperStyle} className="p-1 bg-white">
      <Calendar
        className="p-3"
        fullscreen={false}
        onPanelChange={onPanelChange}
        onSelect={onSelected}
      />
      <div className="mx-2">
        <div className="flex justify-between">
          <span className="font-bold text-xl">Events</span>
          <Ellipsis size={24} color="#979595" />
        </div>
        {selectedDate ? (
          <div>
            {isLoading ? (
              <div className="flex item-center justify-center p-3">
                Loading...
              </div>
            ) : eventsByDate(selectedDate).length > 0 ? (
              eventsByDate(selectedDate).map((event, index) => (
                <div
                  key={index}
                  className="p-3 mt-3 rounded-sm border-[0.1rem] border-t-[0.19rem] border-gray-100 odd:border-t-purple-300 even:border-t-blue-300"
                >
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-gray-700">
                      {event.title}
                    </span>
                    <span className="text-xs text-gray-300">{event.time}</span>
                  </div>
                  <span className="text-sm mt-3 p-2 text-gray-400">
                    {event.content}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex item-center justify-center p-3">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex item-center justify-center p-3">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarSmall;
