/**
 * ZephyrM API
 *
 * This module provides a configured instance of Axios for making requests to the ZephyrM API.
 *
 * @module apis/zephyrmAPI
 */

import axios from "axios";

import { getEnvVariables } from "../helpers/getEnvVariables";

const { VITE_API_URL } = getEnvVariables();

const zephyrmApi = axios.create({
  baseURL: VITE_API_URL,
});

zephyrmApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  };

  return config;
});

export default zephyrmApi;
