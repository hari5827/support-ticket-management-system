import axios from "axios";

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://support-ticket-management-system-xazj.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;