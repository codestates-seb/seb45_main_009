import axios from "axios";

const globalAxios = axios.create({
  baseURL: "http://13.125.146.181:8080",
  timeout: 5000,
  headers: {
    "Content-Type": `application/json`,
  },
});

export default globalAxios;

globalAxios.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
      config.headers["Authorization"] = `${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
