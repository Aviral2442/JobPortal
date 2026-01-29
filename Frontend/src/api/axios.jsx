import axios from "axios";

const api = axios.create({
  // baseURL: "https://jobportal-react-one.onrender.com/api",
  baseURL: import.meta.env.VITE_BASE_URL + "/api",
  withCredentials: true,
});

export default api;
