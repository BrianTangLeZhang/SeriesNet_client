import axios from "axios";

import { url } from "./url";

export const registerUser = async (data) => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("gender", data.gender);
  formData.append("profile", data.profile);
  const res = await axios.post(`${url}/users/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${url}/users/login`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const getUser = async (Id) => {
  const res = await axios.get(`${url}/users/${Id}`);
  return res.data;
};

export const getUsers = async (username, page) => {
  let params = {
    page: page,
  };
  if (username) params.username = username;
  const query = new URLSearchParams(params);
  const res = await axios.get(`${url}/users?${query.toString()}`);
  return res.data;
};

export const logoutUser = async (token) => {
  const res = await axios.put(`${url}/users/logout`, null, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return res.data;
};
