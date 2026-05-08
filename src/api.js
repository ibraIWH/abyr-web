import axios from "axios";

const API_BASE = "https://abbayah-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("abyr_token");   // we'll store token as "abyr_token" from now
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;