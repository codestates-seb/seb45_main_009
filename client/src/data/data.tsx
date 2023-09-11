import axios from "axios";

const globalAxios = axios.create({
  baseURL: "https://eeab-1-225-48-23.ngrok-free.app",
  headers: {
    "Content-Type": `application/json`,
    "ngrok-skip-browser-warning": "69420",
  },
});

export default globalAxios;
