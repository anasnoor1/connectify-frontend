import axios from "axios";
import { getToken } from "./checkToken";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // your API base URL
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
