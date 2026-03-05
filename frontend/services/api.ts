import axios from "axios";

const defaultApiUrl = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? defaultApiUrl,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
