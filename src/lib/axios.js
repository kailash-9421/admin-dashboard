import axios from "axios";
import { getToken, clearToken } from "./auth";

const api = axios.create({ baseURL: "https://dummyjson.com", timeout: 15000 });

// Runs before EVERY request: adds the login token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Runs after EVERY response: all errors are handled here
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error); // request we cancelled on purpose
    const status = error.response?.status;
    if (status === 401 && !error.config?.url?.includes("/auth/login")) {
      clearToken();
      window.location.href = "/login"; // token expired: send to login
    }
    const message =
      error.response?.data?.message ||
      (error.code === "ECONNABORTED" ? "Request timed out" : error.message) ||
      "Something went wrong";
    return Promise.reject(Object.assign(new Error(message), { status }));
  }
);

export const isCanceled = axios.isCancel;
export default api;