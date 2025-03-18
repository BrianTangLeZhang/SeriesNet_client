import axios from "axios";

import { url } from "./url";

export const dislikesFunc = async (data) => {
  const res = await axios.put(`${url}/dislikes/${data.type}/${data.id}`, null, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
