import axios, { AxiosRequestConfig } from "axios";

type TConfig = { toApi: boolean };

const axiosInstance = (config?: TConfig) => {
  const toApi = config ? config.toApi : true;
  const baseURL = `http://localhost:3007${toApi ? "/api" : ""}`;

  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  instance.interceptors.request.use((config) => {
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    return config;
  });

  return instance;
};

export const deleteRequest = async <T>(
  url: string,

  config?: TConfig
): Promise<T> => {
  const response = await axiosInstance(config).delete(url);
  return response.data;
};

export const putRequest = async <T>(
  url: string,
  data?: any,
  config?: TConfig
): Promise<T> => {
  const response = await axiosInstance(config).put(url, data);
  return response.data;
};

export const postRequest = async <T>(
  url: string,
  data?: any,
  config?: TConfig
): Promise<T> => {
  const response = await axiosInstance(config).post(url, data);
  return response.data;
};
