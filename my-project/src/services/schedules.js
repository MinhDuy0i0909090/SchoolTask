import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // Base URL from environment variable
});

// export const fetchSchedules = async () => {
//   const { data } = await axios.get("http://localhost:3000/Schedules");
//   return data;
// };

// export const addSchedule = async (newSchedule) => {
//   const { data } = await axios.post(
//     "http://localhost:3000/Schedules",
//     newSchedule
//   );
//   return data;
// };

// export const updateSchedule = async (updatedSchedule) => {
//   const { data } = await axios.put(
//     `http://localhost:3000/Schedules/${updatedSchedule.id}`,
//     updatedSchedule
//   );

//   return data;
// };

// export const deleteSchedule = async (scheduleId) => {
//   await axios.delete(`http://localhost:3000/Schedules/${scheduleId}`);
// };
export const fetchSchedules = async () => {
  const { data } = await api.get("/schedules");
  return data;
};

export const addSchedule = async (newSchedule) => {
  const { data } = await api.post("/schedules", newSchedule);
  return data;
};

export const updateSchedule = async (updatedSchedule) => {
  const { data } = await api.put(
    `/schedules/${updatedSchedule._id}`,
    updatedSchedule
  );
  return data;
};

export const deleteSchedule = async (scheduleId) => {
  await api.delete(`/schedules/${scheduleId}`);
};
