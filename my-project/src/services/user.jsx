import axios from "axios";

// Create the axios instance with default configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // Base URL
  withCredentials: true, // Include credentials (cookies, etc.)
});

// Login user
export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

// Logout user
export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

// Check authentication
export const checkAuth = async () => {
  const { data } = await api.get("/auth/checkAuth");
  return data;
};
