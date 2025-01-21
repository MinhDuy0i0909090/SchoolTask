import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

// export const fetchAttendance = async () => {
//   const { data } = await axios.get("http://localhost:3000/attendance");
//   return data;
// };

// export const submitAttendance = async (attendanceData) => {
//   const { data } = await axios.post(
//     "http://localhost:3000/attendance",
//     attendanceData
//   );
//   return data;
// };

export const fetchAttendance = async () => {
  const { data } = await api.get("/attendance");
  return data;
};

export const submitAttendance = async (attendanceData) => {
  const { data } = await api.post("/attendance", attendanceData);
  return data;
};