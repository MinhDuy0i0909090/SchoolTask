import { Badge, Input } from "antd";
import { Bell, CircleUserRound, MessageCircleMore, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchEvents } from "../../services/events";
import { useQuery } from "@tanstack/react-query";

function Navbar() {
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
  function eventsByDate(date) {
    // Lấy phần ngày (YYYY-MM-DD)
    return events.filter((event) => event.date.split("T")[0] === selectedDate);
  }
  const eventCount = eventsByDate(selectedDate).length;
  console.log(eventCount);
  return (
    <div className="flex items-center justify-end mx-3 mt-2 ">
      <div className="flex flex-row gap-6">
        <Badge offset={[-1, 14]} count={2} size="small">
          <MessageCircleMore
            className="my-4"
            size={21}
            color="#1f2937"
            strokeWidth={1}
          />
        </Badge>

        <Badge offset={[-1, 14]} count={eventCount} size="small">
          <Bell className="my-4" size={21} color="#1f2937" strokeWidth={1} />
        </Badge>

        <div className="flex justify-around gap-2">
          <div className="  font-['Proxima Nova']   ">
            <span className="font-bold text-sm ">John Moe</span>
            <span className="flex text-xs font-extralight justify-end">
              Admin
            </span>
          </div>

          <CircleUserRound
            className="my-2"
            size={28}
            color="#ac41d2"
            strokeWidth={1}
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
