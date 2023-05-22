import { http } from "./axios";

export const axiosRequestLogout = async () => {
  const refreshToken = sessionStorage.getItem("refreshToken");

  const res = await http.get("auth/logout", {
    headers: {
      Authorization: refreshToken,
    },
  });

  return res;
};

export const axiosRequestRefresh = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");

  const res = await http.post(
    "auth/refresh",
    {},
    {
      headers: {
        accessToken,
        refreshToken,
      },
    }
  );

  return res;
};
