import axios from "axios";

import { url } from "./url";

export const getAnimes = async (search, genre, sort, token) => {
  try {
    let params = {};
    if (search !== "") params.search = search;
    if (genre !== "") params.genre = genre;
    if (sort !== "") params.sort = sort;
    const query = new URLSearchParams(params);
    const res = await axios.get(`${url}/animes?${query.toString()}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getAnime = async (id, token) => {
  try {
    const res = await axios.get(`${url}/animes/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteAnime = async ({ id, token }) => {
  try {
    const res = await axios.delete(`${url}/animes/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const addAnime = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("genres", data.genres);
    formData.append("poster", data.poster);
    formData.append("background", data.background);
    const res = await axios.post(`${url}/animes`, formData, {
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

export const editAnime = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("genres", data.genres);
    if (data.poster) formData.append("poster", data.poster);
    if (data.background) formData.append("background", data.background);
    const res = await axios.put(`${url}/animes/${data.id}`, formData, {
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
