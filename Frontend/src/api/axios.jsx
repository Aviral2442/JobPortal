import axios from "axios";

// const api = axios.create({
//   // baseURL: "https://jobportal-react-one.onrender.com/api",
//   baseURL: import.meta.env.VITE_BASE_URL + "/api",
//   withCredentials: true,
// });



const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
  });



  
  export default api;