import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  FormControl,
  TextField,
  List,
  OutlinedInput,
  InputAdornment,
  IconButton,
  MenuItem,
  Grid,
} from "@mui/material";
import { addGenre, deleteGenre, getGenres } from "../utils/api_genres";
import { getAnimes } from "../utils/api_animes";
import SeriesCard from "../components/SeriesCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Add, Remove, Send } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function AnimePage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [genre, setGenre] = useState("");
  const [newGenre, setNewGenre] = useState("");

  const [typing, setTyping] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const nav = useNavigate();

  const { data: animes = [] } = useQuery({
    queryKey: ["animes", search, genre, sort, token],
    queryFn: () => getAnimes(search, genre, sort, token),
  });

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const addGenresMutation = useMutation({
    mutationFn: addGenre,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["genres"],
      });
      setTyping(false);
      setNewGenre("");
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

  const handleAddGenre = () => {
    if (newGenre === "") {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `Genre name should not be empty`,
        confirmButtonText: "Try again",
      });
    } else {
      addGenresMutation.mutate({ name: newGenre, token });
    }
  };

  const delGenreMutation = useMutation({
    mutationFn: deleteGenre,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["genres"],
      });
      setTyping(false);
      setNewGenre("");
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete the genre?",
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
        delGenreMutation.mutate({ id, token });
      }
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

  return (
    <>
      <Navbar />
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 3,
            flex: 1,
            gap: 1,
          }}
        >
          <FormControl sx={{ flex: 1 }}>
            <TextField
              size="small"
              label="Search"
              placeholder="Search By Title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <TextField
              type="text"
              select
              size="small"
              label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="popularity">Popularity</MenuItem>
            </TextField>
          </FormControl>
          {role === "Admin" && (
            <Button
              variant="contained"
              sx={{
                color: "white",
                bgcolor: "#17202A",
                "&:hover": {
                  bgcolor: "#1C2833",
                },
                fontWeight: "bold",
              }}
              size="large"
              onClick={() => {
                nav("/addSeries");
              }}
            >
              <Add />
            </Button>
          )}
        </Box>
        <List
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            maxWidth: "100%",
            padding: 0,
            borderBottom:"2px solid #17202A",
            whiteSpace: "nowrap",
            "&::-webkit-scrollbar": {
              display: "inherit",
              height: "10px",
              borderRadius: "10px",
              border: "2px solid #17202A",
              bgcolor: "white",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#17202A",
              borderRadius: "10px",
              border: "2px solid #17202A",
            },
          }}
        >
          {role === "Admin" && (
            <>
              <Box>
                <FormControl
                  sx={{
                    width: typing ? 300 : 70,
                  }}
                >
                  <OutlinedInput
                    size="small"
                    sx={{
                      color: typing ? "#17202A" : "white",
                      bgcolor: typing ? "white" : "#17202A",
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      border: "2px solid #17202A",
                      flexShrink: 0,
                      "&:hover": !typing && {
                        bgcolor: "#34495e",
                        color: "white",
                      },
                    }}
                    value={newGenre}
                    placeholder={typing ? "Click send after typing" : null}
                    startAdornment={
                      <InputAdornment>
                        <IconButton onClick={() => setTyping(!typing)}>
                          <Add
                            fontSize="small"
                            sx={{
                              transition:
                                "transform 0.3s ease, color 0.3s ease",
                              color: typing ? "inherit" : "white",

                              transform: typing
                                ? "rotate(45deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                    endAdornment={
                      typing && (
                        <InputAdornment>
                          <IconButton onClick={handleAddGenre}>
                            <Send fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                    onChange={(e) => setNewGenre(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Button
                onClick={() => {
                  setDeleting(!deleting);
                  setGenre("");
                }}
                sx={{
                  width: 70,
                  bgcolor: deleting ? "white" : "#17202A",
                  color: deleting ? "#17202A" : "white",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  borderBottom:"none",
                  border: "2px solid #17202A",
                  "&:hover": !deleting && {
                    bgcolor: "#34495e",
                    color: "white",
                  },
                  flexShrink: 0,
                }}
              >
                <Remove
                  fontSize="small"
                  sx={{
                    transition: "transform 0.3s ease",
                    transform: deleting ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                />
              </Button>
            </>
          )}
          <Button
            onClick={() => setGenre("")}
            size="small"
            sx={{
              width: genre === "" ? 120 : 50,
              bgcolor: genre === "" ? "white" : "#17202A",
              color: genre === "" ? "#17202A" : "white",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              border: "2px solid #17202A",
              borderBottom:"none",
              fontWeight: genre === "" && "bold",
              fontSize: genre !== "" && "10px",
              "&:hover": genre !== "" && {
                bgcolor: "#34495e",
                color: "white",
                fontSize: "15px",
                width: 100,
              },
              transition:
                "fontSize 0.3s ease-in-out, width 0.3s ease-in-out, bgcolor 0.3s ease-in-out,font-size 0.3s ease-in-out, paddingX 0.3s ease-in-out",
            }}
          >
            {"All"}
          </Button>
          {genres &&
            genres.map((g) => (
              <>
                {!deleting ? (
                  <Button
                    size="small"
                    key={g._id}
                    onClick={() => setGenre(g._id)}
                    sx={{
                      width: genre === g._id ? 120 : 50,
                      bgcolor: genre === g._id ? "white" : "#17202A",
                      color: genre === g._id ? "#17202A" : "white",
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      border: "2px solid #17202A",
                      borderBottom:"none",
                      fontWeight: genre === g._id && "bold",
                      fontSize: genre !== g._id && "10px",
                      "&:hover": genre !== g._id && {
                        bgcolor: "#34495e",
                        color: "white",
                        fontSize: "15px",
                        width: 100,
                      },
                      transition:
                        "width 0.3s ease-in-out, bgcolor 0.3s ease-in-out,font-size 0.3s ease-in-out, paddingX 0.3s ease-in-out",
                    }}
                  >
                    {g.name}
                  </Button>
                ) : (
                  <Button
                    key={g._id}
                    onClick={() => handleDelete(g._id)}
                    sx={{
                      width: 50,
                      fontSize: "10px",
                      bgcolor: "#E74C3C",
                      color: "white",
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      border: "2px solid #E74C3C",
                      flexShrink: 0,
                      "&:hover": {
                        bgcolor: "white",
                        color: "#E74C3C",
                      },
                    }}
                  >
                    {g.name}
                  </Button>
                )}
              </>
            ))}
        </List>
        {animes.length > 0 ? (
          <Grid
            container
            spacing={1}
            sx={{
              paddingTop: 2,
              alignItems: "center",
              width: "100%",
            }}
          >
            {animes.map((anime) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <SeriesCard anime={anime} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            height={350}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant="h5" textAlign={"center"}>
              No Series Added Yet
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}
