import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // Use the environment variable
});
// export const fetchClasses = async () => {
//   const { data } = await axios.get("http://localhost:3000/Classes");
//   return data;
// };

// export const addClass = async (newClass) => {
//   const { data } = await axios.post("http://localhost:3000/Classes", newClass);
//   return data;
// };

// export const updateClass = async (updatedClass) => {
//   const { data } = await axios.put(
//     `http://localhost:3000/Classes/${updatedClass.id}`,
//     updatedClass
//   );
//   return data;
// };

// export const deleteClass = async (classNameId) => {
//   await axios.delete(`http://localhost:3000/Classes/${classNameId}`);
// };
export const fetchClasses = async () => {
  const { data } = await api.get("/classes");
  return data;
};

export const addClass = async (newClass) => {
  const { data } = await api.post("/classes", newClass);
  return data;
};

export const updateClass = async (updatedClass) => {
  const { data } = await api.put(`/classes/${updatedClass._id}`, updatedClass);
  return data;
};

export const deleteClass = async (classNameId) => {
  await api.delete(`/classes/${classNameId}`);
};
