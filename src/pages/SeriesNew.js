import {
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  styled,
  Checkbox,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getGenres } from "../utils/api_genres";
import { useState } from "react";
import { FileUpload } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { addAnime } from "../utils/api_animes";

export default function AnimeNew() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState([]);
  const [poster, setPoster] = useState();
  const [posterPre, setPosterPre] = useState();
  const [background, setBackground] = useState();
  const [backgroundPre, setBackgroundPre] = useState();
  const [cookie] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookie;
  const { token, role } = currentUser;

  const handleGenresChange = (e) => {
    setGenre(
      typeof e.target.value === "string"
        ? e.target.value.split(",")
        : e.target.value
    );
  };

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const UploadButton = styled("input")({ display: "none" });

  const imageHandler = async (e) => {
    const file1 = e.target.files[0];

    const posterBase64 = await fileToBase64(file1);
    setPoster(file1);
    setPosterPre(posterBase64);
  };

  const bgHandler = async (e) => {
    const file2 = e.target.files[0];

    const bgBase64 = await fileToBase64(file2);
    setBackground(file2);
    setBackgroundPre(bgBase64);
  };

  const fileToBase64 = (bold) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(bold);
    });
  };

  const addAnimeMutation = useMutation({
    mutationFn: addAnime,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully added an anime",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["animes"],
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

  const handlerSubmit = (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      genre.length === 0 ||
      poster.length === 0 ||
      background.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "All fields are required",
      });
    } else {
      addAnimeMutation.mutate({
        name,
        description,
        genres: genre.join(", "),
        poster,
        background,
        token,
      });
    }
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
        <Card sx={{ mt: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: 3,
              }}
            >
              Add New Series
            </Typography>
            <Grid container sx={{ paddingX: 4, paddingY: 4, gap: 4 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Name"
                  variant="outlined"
                  value={name}
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  fullWidth
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Genres</InputLabel>
                  <Select
                    required
                    value={genre}
                    label="Genr"
                    multiple
                    onChange={handleGenresChange}
                    renderValue={(selected) => selected.join(", ")}
                    sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                  >
                    {genres.map((g) => (
                      <MenuItem key={g._id} value={g.name}>
                        <Checkbox checked={genre.indexOf(g.name) > -1} />
                        <ListItemText primary={g.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap:1
                }}
              >
                <Box sx={{ height: "250px" }}>
                  {poster && (
                    <img
                      src={posterPre}
                      alt="poster"
                      style={{ height: "220px", width: "auto" }}
                    />
                  )}
                </Box>

                <label htmlFor="upload-poster">
                  <UploadButton
                    type="file"
                    id="upload-poster"
                    accept="image/*"
                    onChange={imageHandler}
                  />
                  <Button
                    component="span"
                    sx={{
                      px: 4,
                      py: 2,
                      bgcolor: "#17202A",
                      "&:hover": {
                        bgcolor: "#212F3D",
                      },
                      color: "white",
                    }}
                    variant="contained"
                    startIcon={<FileUpload />}
                  >
                    Upload Poster
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap:1
                }}
              >
                <Box
                  sx={{
                    height: "250px",
                    display:"flex",
                    alignItems: "center",
                  }}
                >
                  {background && (
                    <img
                      src={backgroundPre}
                      alt="bg"
                      style={{ height: "200px", width: "auto" }}
                    />
                  )}
                </Box>
                <label htmlFor="upload-background">
                  <UploadButton
                    type="file"
                    id="upload-background"
                    accept="image/*"
                    onChange={bgHandler}
                  />
                  <Button
                    component="span"
                    sx={{
                      px: 4,
                      py: 2,
                      bgcolor: "#17202A",
                      "&:hover": {
                        bgcolor: "#212F3D",
                      },
                      color: "white",
                    }}
                    variant="contained"
                    startIcon={<FileUpload />}
                  >
                    Upload Background
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                display={"flex"}
                gap={2}
                justifyContent={"end"}
              >
                <Button
                  variant="outlined"
                  sx={{
                    color: "#17202A",
                    border: "2px solid #212F3D",
                    "&:hover": {
                      border: "2px solid #212F3D",
                    },
                  }}
                  onClick={() => nav("/series")}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#17202A",
                    "&:hover": {
                      bgcolor: "#212F3D",
                    },
                    color: "white",
                  }}
                  onClick={(e) => handlerSubmit(e)}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
