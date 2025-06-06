/**
 * ZephyrM API
 *
 * This module provides a configured instance of Axios for making requests to the ZephyrM API.
 *
 * @module apis/zephyrmAPI
 */

import axios from "axios";
import * as SecureStorage from "expo-secure-store";

const zephyrmApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Configure interceptors
zephyrmApi.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers["x-token"] = SecureStorage.getItem("token") || "";
  }

  return config;
});

export default zephyrmApi;
