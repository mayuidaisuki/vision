import axios from "axios";

const http = axios.create({
  baseURL: "http://127.0.0.1:8888/api",
  timeout: 5000,
});

http.interceptors.response.use((res) => {
  return res.data;
});

export default http;
