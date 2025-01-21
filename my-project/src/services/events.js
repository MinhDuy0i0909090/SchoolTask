import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // Dynamic base URL from the environment variable
});
// export const fetchEvents = async () => {
//   const { data } = await axios.get("http://localhost:3000/Events");
//   return data;
// };

// export const addEvents = async (newEvent) => {
//   const { data } = await axios.post("http://localhost:3000/Events", newEvent);
//   return data;
// };

// export const updateEvent = async (updatedEvent) => {
//   const { data } = await axios.put(
//     `http://localhost:3000/Events/${updatedEvent.id}`,
//     updatedEvent
//   );
//   return data;
// };

// export const deleteEvent = async (EventId) => {
//   await axios.delete(`http://localhost:3000/Events/${EventId}`);
// };

export const fetchEvents = async () => {
  const { data } = await api.get("/events");
  return data;
};

export const addEvents = async (newEvent) => {
  const { data } = await api.post("/events", newEvent);
  return data;
};

export const updateEvent = async (updatedEvent) => {
  const { data } = await api.put(`/events/${updatedEvent._id}`, updatedEvent);
  return data;
};

export const deleteEvent = async (eventId) => {
  await api.delete(`/events/${eventId}`);
};
