import axios from "axios";

import { url } from "./url";

export const getGenres = async () => {
  const res = await axios.get(`${url}/genres`);
  return res.data;
};

export const addGenre = async (data) => {
  const res = await axios.post(
    `${url}/genres`,
    JSON.stringify({ name: data.name }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return res.data;
};

export const deleteGenre = async (data) => {
  const res = await axios.delete(`${url}/genres/${data.id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
