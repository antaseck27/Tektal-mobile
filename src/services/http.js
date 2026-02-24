import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const http = axios.create({
  baseURL: "https://tektal-backend.onrender.com",
  timeout: 30000,
});

http.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;
