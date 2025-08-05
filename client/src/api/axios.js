import axios from "axios";

const instance = axios.create({
  baseURL: "https://job-networking-portal-1.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
