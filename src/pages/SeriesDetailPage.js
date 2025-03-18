import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Collapse,
  CardMedia,
  IconButton,
  Grid,
  Button,
  CircularProgress,
  OutlinedInput,
  FormControl,
  InputAdornment,
  List,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { deleteAnime, getAnime } from "../utils/api_animes";
import { url } from "../utils/url";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import {
  Delete,
  Edit,
  ThumbDownAlt,
  ThumbDownOffAlt,
  ThumbUpAlt,
  ThumbUpOffAlt,
  Add,
  Close,
  Send,
  ArrowDropDown,
  ArrowDropUp,
  BookmarkAdd,
  BookmarkRemove,
} from "@mui/icons-material";
import { dislikesFunc } from "../utils/api_dislikes";
import { likesFunc } from "../utils/api_likes";
import EpisodeAddModal from "../components/EpisodaAddModal";
import { deleteEp } from "../utils/api_episodes";
import { addComment } from "../utils/api_comment";
import CommentBar from "../components/CommentListItem";
import { addList, getUserList } from "../utils/api_lists";

export default function AnimeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token, _id } = currentUser;

  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");

  const [deleting, setDeleting] = useState(false);

  const { data: anime = {}, isLoading } = useQuery({
    queryKey: ["anime"],
    queryFn: () => getAnime(id, token),
  });

  const { data: list = [], isLoading: checking } = useQuery({
    queryKey: ["list"],
    queryFn: () => getUserList(token),
  });

  const likeAnimeMutation = useMutation({
    mutationFn: likesFunc,
    onSuccess: () => {
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
    likeAnimeMutation.mutate({ ...data, token });
  };

  const dislikeAnimeMutation = useMutation({
    mutationFn: dislikesFunc,
    onSuccess: () => {
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
    dislikeAnimeMutation.mutate({ ...data, token });
  };

  const deleteAnimeMutation = useMutation({
    mutationFn: deleteAnime,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully deleted the anime",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["anime"],
      });
      nav("/series");
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
      title: "Delete the anime?",
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
        deleteAnimeMutation.mutate({ id: anime._id, token });
      }
    });
  };

  const deleteEpisodeMutation = useMutation({
    mutationFn: deleteEp,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully deleted the anime",
        showConfirmButton: false,
        timer: 1500,
      });
      setDeleting(false);
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
  const handleEpDelete = (id) => {
    Swal.fire({
      title: "Delete the episode?",
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
        deleteEpisodeMutation.mutate({ id, token });
      }
    });
  };

  const addAnimeCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully added comment",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["anime"],
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
      addAnimeCommentMutation.mutate({
        type: "anime",
        id: anime._id,
        content,
        token,
      });
    }
  };

  const addToListMutation = useMutation({
    mutationFn: addList,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: `${
          !list.find((item) => item._id === id)
            ? "Successfully add to list"
            : "Successfully remove from list"
        }`,
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["anime"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list"],
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

  const handleAddToList = (e) => {
    e.preventDefault();
    addToListMutation.mutate({
      id: anime._id,
      token,
    });
  };

  if (!role && !token) {
    return (
      <>
        <Navbar />
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h5">You need to login first</Typography>
          <Typography component={Link} to="/login">
            Go Login
          </Typography>
        </Box>
      </>
    );
  }

  if (isLoading || checking)
    return (
      <>
        <Navbar />
        <Container
          sx={{ display: "flex", justifyContent: "center", height: 500 }}
        >
          <CircularProgress />
        </Container>
      </>
    );

  return (
    <>
      <Navbar />
      <Container>
        <Card component={Paper}>
          <Box position={"relative"}>
            <div
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "rgb(23, 32, 42,0.5)",
                position: "absolute",
              }}
            ></div>
            <CardMedia
              component="img"
              sx={{ objectFit: "cover", height: "400px", width: "100%",objectFit:"cover",objectPosition:"top" }}
              image={url + "/background/" + anime.background}
            />
          </Box>
          <CardContent sx={{ position: "relative", height: 100 }}>
            <Box
              sx={{
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                width: "90%",
                bgcolor: "rgba(23, 32, 42, 0.9)",
                p: 3,
                gap: 3,
              }}
            >
              <Box
                component={"img"}
                src={`${url}/poster/${anime.poster}`}
                sx={{ maxHeight: 280, maxWidth: 200 }}
              ></Box>
              <Box
                sx={{
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                <Typography variant="h4">{anime.name}</Typography>
                <Typography variant="body1">{anime.description}</Typography>
                <Box display={"flex"} flexWrap={"wrap"} gap={1} my={4}>
                  {anime.genres.map((genre) => (
                    <Typography
                      key={genre._id}
                      component="span"
                      sx={{
                        color: "#17202A",
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: 10,
                        borderRadius: 50,
                        p: 1,
                        background: "white",
                      }}
                    >
                      {genre.name}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  {role === "Admin" && (
                    <>
                      <IconButton onClick={handleDelete}>
                        <Delete color="error" />
                      </IconButton>
                      <IconButton
                        onClick={() => nav(`/editSeries/${anime._id}`)}
                      >
                        <Edit color="warning" />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    sx={{ color: "white" }}
                    onClick={() => handleLike({ type: "anime", id: anime._id })}
                  >
                    {anime.likes.includes(_id) ? (
                      <ThumbUpAlt fontSize="small" sx={{ color: "#2875A9" }} />
                    ) : (
                      <ThumbUpOffAlt fontSize="small" />
                    )}
                    <Typography variant="span" fontSize="small" mx={1}>
                      {anime.likes.length}
                    </Typography>
                  </IconButton>
                  <IconButton
                    sx={{ color: "white" }}
                    onClick={() =>
                      handleDislike({ type: "anime", id: anime._id })
                    }
                  >
                    {anime.dislikes.includes(_id) ? (
                      <ThumbDownAlt
                        fontSize="small"
                        sx={{ color: "#860101" }}
                      />
                    ) : (
                      <ThumbDownOffAlt fontSize="small" />
                    )}
                    <Typography variant="span" fontSize="small" mx={1}>
                      {anime.dislikes.length}
                    </Typography>
                  </IconButton>
                  {!list.find((item) => item._id === id) ? (
                    <IconButton onClick={handleAddToList} color="primary">
                      <BookmarkAdd fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton color="error" onClick={handleAddToList}>
                      <BookmarkRemove fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
          <CardContent>
            <Grid container>
              <Grid item xs={12} sx={{ py: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Episodes:
                  </Typography>
                  {role === "Admin" && (
                    <Button size="small" onClick={() => setDeleting(!deleting)}>
                      <Close sx={{ rotate: deleting ? "45deg" : "0" }} />
                      {!deleting ? "Delete" : "Close"}
                    </Button>
                  )}
                </Box>
                <Divider />
              </Grid>
              {anime.episodes.length > 0 ? (
                <>
                  {anime.episodes.map((episode) => (
                    <Grid
                      item
                      xs={2}
                      sx={{
                        border: "2px solid black",
                        height: 60,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {!deleting ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => nav(`/episode/${episode._id}`)}
                        >
                          {episode.title}
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          color="error"
                          onClick={() => handleEpDelete(episode._id)}
                        >
                          {episode.title}
                        </Button>
                      )}
                    </Grid>
                  ))}
                  {role === "Admin" && (
                    <Grid
                      item
                      xs={2}
                      sx={{
                        border: "2px solid black",
                        height: 60,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button fullWidth onClick={() => setUploading(true)}>
                        <Add />
                      </Button>
                    </Grid>
                  )}
                </>
              ) : (
                <>
                  {role === "Admin" ? (
                    <Grid
                      item
                      xs={2}
                      sx={{
                        border: "2px solid black",
                        height: 60,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button fullWidth onClick={() => setUploading(true)}>
                        <Add />
                      </Button>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 120,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontStyle: "italic" }}>
                        Comming Soon...
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </CardContent>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
            </IconButton>
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit pb={5}>
            <CardContent sx={{ bgcolor: "rgb(220, 220, 220,0.25)", px: 4 }}>
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
              <List
                sx={{
                  overflow: "scroll",
                  maxHeight: 450,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {anime.comments.length > 0 ? (
                  <>
                    {anime.comments.map((comment) => (
                      <CommentBar trackingType="anime" comment={comment} />
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
      </Container>
      <EpisodeAddModal
        animeId={id}
        uploading={uploading}
        setUploading={setUploading}
      />
    </>
  );
}
