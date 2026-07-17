import axios from "axios";

import { clearAuthSession } from "../utils/auth";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let redirectingToLogin = false;

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isLoginRequest =
      requestUrl.includes("/auth/login");

    const isAlreadyOnLoginPage =
      window.location.pathname === "/login";

    if (
      status === 401 &&
      !isLoginRequest &&
      !redirectingToLogin
    ) {
      redirectingToLogin = true;

      clearAuthSession();

      if (!isAlreadyOnLoginPage) {
        window.location.replace("/login");
      } else {
        redirectingToLogin = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;