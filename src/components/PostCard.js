import {
  Card,
  Typography,
  Box,
  CardContent,
  ImageList,
  ImageListItem,
  Divider,
  IconButton,
  Collapse,
  FormControl,
  OutlinedInput,
  InputAdornment,
  List,
} from "@mui/material";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { url } from "../utils/url";
import {
  Female,
  Male,
  Campaign,
  Delete,
  ThumbUpAlt,
  ThumbUpOffAlt,
  ThumbDownAlt,
  ThumbDownOffAlt,
  Edit,
  Comment,
  Send,
} from "@mui/icons-material";
import { deletePost } from "../utils/api_posts";
import { useNavigate } from "react-router-dom";
import { likesFunc } from "../utils/api_likes";
import { dislikesFunc } from "../utils/api_dislikes";
import { useState } from "react";
import ImageModal from "./ImageModal";
import { addComment } from "../utils/api_comment";
import CommentBar from "./CommentListItem";

export default function PostCard(props) {
  const { post } = props;
  const queryclient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token, _id } = currentUser;

  const nav = useNavigate();

  const addPostCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Comment added",
        showConfirmButton: false,
        timer: 1500,
      });
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
      setContent("");
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

  const handleAddComment = () => {
    if (content === "") {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: "Content should not be empty",
        confirmButtonText: "Try again",
      });
    } else {
      addPostCommentMutation.mutate({
        type: "post",
        id: post._id,
        content,
        token,
      });
    }
  };

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully deleted the post",
        showConfirmButton: false,
        timer: 1500,
      });
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
      nav("/");
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
      title: "Delete the post?",
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
        deletePostMutation.mutate({ id: post._id, token });
      }
    });
  };

  const likePostMutation = useMutation({
    mutationFn: likesFunc,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
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
      queryclient.invalidateQueries({
        queryKey: ["posts"],
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

  return (
    <Card sx={{ bgcolor: "#fefefe", marginBottom: 2 }}>
      <Box
        sx={{
          paddingX: 2,
          paddingY: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={`${url}/profileImg/${post.user.profile}`}
            alt=""
            style={{
              height: "30px",
              width: "30px",
              borderRadius: 100,
              objectFit: "cover",
              border: "0.5px solid black",
            }}
          />
          <Typography variant="h6" sx={{ fontSize: "20px" }}>
            {post.user.username}
          </Typography>
          {post.user.gender === "Male" && <Male color="info" />}
          {post.user.gender === "Female" && <Female sx={{ color: "pink" }} />}
        </Box>
        {post.announcement && <Campaign sx={{ alignItems: "end" }} />}
      </Box>
      <Divider />
      <CardContent sx={{ px: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            fontSize={22}
            letterSpacing={0}
            fontWeight="bolder"
          >
            {post.title}
          </Typography>
          {post.createDate === post.updateDate ? (
            <Typography variant="small" fontSize={10}>
              Create at: {post.createDate.split("T")[0]}
            </Typography>
          ) : (
            <Typography variant="small" fontSize={10}>
              Lastest update: {post.updateDate.split("T")[0]}
            </Typography>
          )}
        </Box>
        <Box sx={{marginTop:2}}>
          {post.content.split("\n").map((line) => (
            <>
              <Typography variant="p" letterSpacing={0.3} fontSize={18}>
                {line}
              </Typography>
              <br />
            </>
          ))}
          {post.images && post.images.length > 0 && (
            <ImageList
              cols={
                post.images.length <= 3
                  ? post.images.length
                  : post.images.length - (post.images.length - 3)
              }
              sx={{
                maxHeight: "300px",
                width: "fit-content",
              }}
            >
              {post.images.map((image) => (
                <>
                  <ImageListItem key={image}>
                    <img
                      loading="lazy"
                      src={`${url}/postImg/${image}`}
                      alt={image}
                      style={{
                        objectFit: "contain",
                        maxHeight: "220px",
                        width: "fit-content",
                      }}
                      onClick={() => {
                        setImgSrc(`${url}/postImg/${image}`);
                        setModalOpen(true);
                      }}
                    />
                  </ImageListItem>
                  <ImageModal
                    imageSRC={imgSrc}
                    setModalOpen={setModalOpen}
                    modalOpen={modalOpen}
                  />
                </>
              ))}
            </ImageList>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 3,
          }}
        >
          <Box
            sx={{
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {post.tags.map((tag) => (
                <Typography
                  variant="span"
                  key={tag}
                  sx={{
                    backgroundColor: "#1B4F72 ",
                    borderRadius: 10,
                    padding: 0.5,
                    fontSize: 14,
                    fontStyle: "italic",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {tag}
                </Typography>
              ))}
            </Box>
          </Box>
          {role && (
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              {(role === "Admin" || _id === post.user._id) && (
                <IconButton onClick={handleDelete}>
                  <Delete color="error" />
                </IconButton>
              )}
              {_id === post.user._id && (
                <IconButton onClick={() => nav(`/editPost/${post._id}`)}>
                  <Edit color="warning" />
                </IconButton>
              )}
              <IconButton
                onClick={() => handleLike({ type: "post", id: post._id })}
              >
                {post.likes.includes(_id) ? (
                  <ThumbUpAlt fontSize="small" sx={{ color: "#2875A9" }} />
                ) : (
                  <ThumbUpOffAlt fontSize="small" />
                )}
                <Typography variant="span" fontSize="small" mx={1}>
                  {post.likes.length}
                </Typography>
              </IconButton>
              <IconButton
                onClick={() => handleDislike({ type: "post", id: post._id })}
              >
                {post.dislikes.includes(_id) ? (
                  <ThumbDownAlt fontSize="small" sx={{ color: "#860101" }} />
                ) : (
                  <ThumbDownOffAlt fontSize="small" />
                )}
                <Typography variant="span" fontSize="small" mx={1}>
                  {post.dislikes.length}
                </Typography>
              </IconButton>
              <IconButton onClick={() => setExpanded(!expanded)}>
                {expanded ? (
                  <Comment fontSize="small" sx={{ color: "#68166A" }} />
                ) : (
                  <Comment fontSize="small" />
                )}
                <Typography variant="span" fontSize="small" mx={1}>
                  {post.comments.length}
                </Typography>
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ bgcolor: "#f9f9f9" }}>
          <Box sx={{ px: 4 }}>
            <FormControl variant="outlined" fullWidth>
              <OutlinedInput
                fontSize={20}
                size="small"
                value={content}
                placeholder="Type your comment here..."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleAddComment} edge="end">
                      <Send />
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>
          </Box>
          <Divider sx={{ m: 2 }} />
          <List
            sx={{
              overflow: "scroll",
              maxHeight: "50vh",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {post.comments.length > 0 ? (
              <>
                {post.comments.map((comment) => (
                  <CommentBar
                    trackingType="post"
                    postOwner={post.user._id}
                    comment={comment}
                  />
                ))}
              </>
            ) : (
              <Box pt={3}>
                <Typography textAlign={"center"} color={"darkgray"}>
                  No user comment yet
                </Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  );
}
