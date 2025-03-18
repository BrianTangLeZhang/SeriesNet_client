import axios from "axios";

import { url } from "./url";

export const getComments = async (type, id, token) => {
  const res = await axios.get(`${url}/comments/${type}/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return res.data;
};

export const addComment = async (data) => {
  try {
    const res = await axios.post(
      `${url}/comments/${data.type}/${data.id}`,
      JSON.stringify({ content: data.content }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (data) => {
  try {
    const res = await axios.delete(`${url}/comments/${data.type}/${data.id}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const updateComment = async (data) => {
  try {
    const res = await axios.put(
      `${url}/comments/${data.id}`,
      JSON.stringify({ content: data.content }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      }
    );
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
