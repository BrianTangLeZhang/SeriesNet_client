import axios from "axios";

import { url } from "./url";

export const getPosts = async (search, tag, page, sort) => {
  try {
    let params = {
      page: page,
    };
    if (search) params.search = search;
    if (tag) params.tag = tag;
    if (sort) params.sort = sort;
    const query = new URLSearchParams(params);
    const res = await axios.get(`${url}/posts?${query.toString()}`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getPost = async (id) => {
  try {
    const res = await axios.get(`${url}/posts/${id}`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const getUserPosts = async (id) => {
  try {
    const res = await axios.get(`${url}/posts/user/${id}`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const addPost = async (data) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("tags", data.tags);
    formData.append("announcement", data.announcement);
    data.images.forEach((image) => {
      formData.append("postImg", image);
    });
    const res = await axios.post(`${url}/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + data.token,
      },
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const deletePost = async (data) => {
  const res = await axios.delete(`${url}/posts/${data.id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

export const editPost = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("tags", data.tags);
  formData.append("announcement", data.announcement);
  if (data.images[0])
    data.images.forEach((image) => {
      formData.append("postImg", image);
    });
  const res = await axios.put(`${url}/posts/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
