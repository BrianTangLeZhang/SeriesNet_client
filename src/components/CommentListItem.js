import {
  Close,
  Delete,
  Edit,
  EditNote,
  Favorite,
  FavoriteBorder,
  HeartBroken,
  HeartBrokenOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  IconButton,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { dislikesFunc } from "../utils/api_dislikes";
import { likesFunc } from "../utils/api_likes";
import { deleteComment, updateComment } from "../utils/api_comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { url } from "../utils/url";

export default function CommentBar(props) {
  const { trackingType, postOwner, comment } = props;
  const queryClient = useQueryClient();

  const [content, setContent] = useState(
    comment.content ? comment.content : ""
  );
  const [editing, setEditing] = useState(false);

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token, _id } = currentUser;

  const likePostMutation = useMutation({
    mutationFn: likesFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["anime"],
      });
    },
    onError: (e) => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `${e.response.data.msg}`,
        confirmButtonText: "OK",
      });
    },
  });
  const handleLike = (data) => {
    likePostMutation.mutate({ ...data, token });
  };

  const dislikePostMutation = useMutation({
    mutationFn: dislikesFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["anime"],
      });
    },
    onError: (e) => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `${e.response.data.msg}`,
        confirmButtonText: "OK",
      });
    },
  });
  const handleDislike = (data) => {
    dislikePostMutation.mutate({ ...data, token });
  };

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully deleted the comment",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["anime"],
      });
    },
    onError: (e) => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `${e.response.data.msg}`,
        confirmButtonText: "Try again",
      });
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Delete the comment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      color: "#fff",
      background: "#17202A",
      showCancelButton: true,
      confirmButtonText: "Sure",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCommentMutation.mutate({
          type: trackingType,
          id: comment._id,
          token,
        });
      }
    });
  };

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully edited the comment",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["anime"],
      });
      setEditing(false);
    },
    onError: (e) => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `${e.response.data.msg}`,
        confirmButtonText: "Try again",
      });
    },
  });

  const handleUpdate = () => {
    Swal.fire({
      title: "Edit the comment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      color: "#fff",
      background: "#17202A",
      showCancelButton: true,
      confirmButtonText: "Sure",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        updateCommentMutation.mutate({ id: comment._id, content, token });
      }
    });
  };

  return (
    <Box
      bgcolor={"background.paper"}
      px={2}
      py={1}
      display={"flex"}
      justifyContent={"space-between"}
    >
      {!editing ? (
        <>
          <Box alignItems={"start"} style={{ display: "flex", gap: 4 }}>
            <img
              src={url + "/profileImg/" + comment.user.profile}
              alt=""
              style={{
                height: "40px",
                width: "40px",
                borderRadius: 100,
                objectFit: "cover",
              }}
            />
            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant="small" component="small">
                {comment.user.username}
              </Typography>
              <Typography>{comment.content}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            {role === "Admin" ||
            _id === postOwner ||
            _id === comment.user._id ? (
              <IconButton onClick={handleDelete}>
                <Delete color="error" />
              </IconButton>
            ) : null}
            {_id === comment.user._id && (
              <IconButton onClick={() => setEditing(true)}>
                <Edit color="warning" />
              </IconButton>
            )}
            <IconButton
              onClick={() => handleLike({ type: "comment", id: comment._id })}
            >
              {comment.likes.includes(_id) ? (
                <Favorite fontSize="small" sx={{ color: "crimson" }} />
              ) : (
                <FavoriteBorder fontSize="small" />
              )}
              <Typography variant="span" fontSize="small" mx={1}>
                {comment.likes.length}
              </Typography>
            </IconButton>
            <IconButton
              onClick={() =>
                handleDislike({ type: "comment", id: comment._id })
              }
            >
              {comment.dislikes.includes(_id) ? (
                <HeartBroken fontSize="small" sx={{ color: "#860101" }} />
              ) : (
                <HeartBrokenOutlined fontSize="small" />
              )}
              <Typography variant="span" fontSize="small" mx={1}>
                {comment.dislikes.length}
              </Typography>
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          <FormControl fullWidth>
            <OutlinedInput
              size="small"
              sx={{ m: "2px" }}
              value={content}
              endAdornment={
                <InputAdornment>
                  <IconButton onClick={handleUpdate}>
                    <EditNote fontSize="small" />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>
          <IconButton onClick={() => setEditing(false)}>
            <Close fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
}
