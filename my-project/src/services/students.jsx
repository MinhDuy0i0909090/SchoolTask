import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // Dynamic base URL
});

// export const fetchStudents = async () => {
//   const { data } = await axios.get("http://localhost:3000/Students");
//   return data;
// };
// export const addStudent = async (newStudent) => {
//   const { data } = await axios.post(
//     "http://localhost:3000/Students",
//     newStudent
//   );
//   return data;
// };

// export const updateStudent = async (updatedStudent) => {
//   const { data } = await axios.put(
//     `http://localhost:3000/Students/${updatedStudent.id}`,
//     updatedStudent
//   );
//   return data;
// };

// export const deleteStudent = async (StudentId) => {
//   await axios.delete(`http://localhost:3000/Students/${StudentId}`);
// };
export const fetchStudents = async () => {
  const { data } = await api.get("/students");
  return data;
};

export const addStudent = async (newStudent) => {
  const { data } = await api.post("/students", newStudent);
  console.log("New Student Data:", newStudent);
  return data;
};

export const updateStudent = async (updatedStudent) => {
  const { data } = await api.put(
    `/students/${updatedStudent._id}`,
    updatedStudent
  );
  return data;
};

export const deleteStudent = async (studentId) => {
  await api.delete(`/students/${studentId}`);
};
