import axios, { AxiosHeaders, AxiosInstance } from "axios";
import { axiosRequestRefresh } from "./auth";

export const getBaseURL = () => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api/v1"
    : "https://repomon.kr/api/v1";
};

export const http: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  // withCredentials: true,
});

http.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${sessionStorage.getItem(
      "accessToken"
    )}`;
    return config;
  },
  function (err) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (err) {
    if (err.response && err.response.status === 401) {
      const refreshToken = sessionStorage.getItem("refreshToken");
      if (!refreshToken) {
        return err;
      }
      try {
        const res = await axiosRequestRefresh();
        const headers = res.headers as AxiosHeaders;

        sessionStorage.setItem(
          "accessToken",
          headers.get("accessToken") as string
        );
        sessionStorage.setItem(
          "refreshToken",
          headers.get("refreshToken") as string
        );
        return await http.request(err.config);
      } catch (err: any) {
        if (err.response && err.response.status === 403) {
          sessionStorage.clear();
          window.location.href = `${getBaseURL()}/oauth2/authorization/github`;
        }
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);
