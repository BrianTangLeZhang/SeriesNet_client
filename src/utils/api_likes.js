import axios from "axios";

import { url } from "./url";

export const likesFunc = async (data) => {
  const res = await axios.put(`${url}/likes/${data.type}/${data.id}`, null, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
