import axios from "axios";

import { url } from "./url";

export const getUserList = async (token) => {
  try {
    const res = await axios.get(`${url}/lists`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const addList = async (data) => {
  try {
    const res = await axios.put(`${url}/lists/${data.id}`, null, {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
