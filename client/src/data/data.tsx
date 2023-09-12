import axios from "axios";

const globalAxios = axios.create({
  baseURL: "http://13.125.146.181:8080",
  timeout: 5000,
  headers: {
    "Content-Type": `application/json`,
  },
});

export default globalAxios;
