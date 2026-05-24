import axios from "axios";

const resolveApiBase = () => {
  const rawBase = import.meta.env.VITE_API_BASE?.trim();

  let normalizedBase = "http://localhost:8000";

  if (rawBase) {
    if (/^https?:\/\//i.test(rawBase)) {
      normalizedBase = rawBase;
    } else if (rawBase.startsWith(":")) {
      normalizedBase = `http://${rawBase}`;
    } else {
      normalizedBase = `http://${rawBase.replace(/^\/+/g, "")}`;
    }
  }

  normalizedBase = normalizedBase.replace(/\/+$/, "");

  if (!normalizedBase.endsWith("/api")) {
    normalizedBase = `${normalizedBase}/api`;
  }

  return normalizedBase;
};

export const API_BASE = resolveApiBase();

export const api = axios.create({
  baseURL: API_BASE,
});

// Request interceptor to inject Authorization token dynamically
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        config.headers["Authorization"] = `Bearer ${parsed.token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
