import axios from "axios";

import { url } from "./url";

export const uploadEp = async (data) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("episode", data.video);
    const res = await axios.post(`${url}/episodes/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + data.token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteEp = async (data) => {
  try {
    const res = await axios.delete(`${url}/episodes/${data.id}`, {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getEpisode = async (data) => {
  try {
    const res = await axios.get(`${url}/episodes/${data.id}`, {
      headers: {
        Authorization: "Bearer " + data.token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
