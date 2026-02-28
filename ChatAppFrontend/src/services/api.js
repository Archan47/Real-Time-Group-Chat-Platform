import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8070",
  withCredentials: true
});

export default API;