import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Grid,
  Card,
  Box,
  CardContent,
  TextField,
  styled,
  Checkbox,
  IconButton,
} from "@mui/material";
import { addPost } from "../utils/api_posts";
import { FileUpload, Cancel } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

export default function PostNew() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [ann, setAnn] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const nav = useNavigate();

  const [cookie] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookie;
  const { token, role } = currentUser;

  const UploadButton = styled("input")({ height: 0, width: 0 });

  const addPostMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Post successfully added!",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

  const handlerSubmit = (e) => {
    e.preventDefault();
    if (title === "") {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "warning",
        title: "Title cannot be empty.",
        confirmButtonText: "OK",
      });
    } else if (content === "" && images.length === 0) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "warning",
        title: "Please add content or upload at least one image.",
        confirmButtonText: "OK",
      });
    } else {
      addPostMutation.mutate({
        title,
        content,
        tags,
        images,
        announcement: ann,
        token,
      });
    }
  };

  const handleFileChange = async (e) => {
    const validExtensions = ["image/png", "image/jpg", "image/jpeg"];
    const files = Array.from(e.target.files);

    const invalidFiles = files.filter(
      (file) => !validExtensions.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "warning",
        title: "Only .png, .jpg, and .jpeg files are allowed.",
        confirmButtonText: "OK",
      });
      return;
    }

    const newPreviews = await Promise.all(files.map(fileToBase64));

    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImgPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newImgPreviews);
  };

  if (!role && !token) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5">You need to login first</Typography>
        <Typography component={Link} to="/login">
          Go Login
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Add New Post
            </Typography>
            <Grid container sx={{ paddingX: 4, paddingY: 4, gap: 4 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Title"
                  variant="outlined"
                  value={title}
                  fullWidth
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Content"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={content}
                  fullWidth
                  onChange={(e) => setContent(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Tags"
                  variant="outlined"
                  value={tags}
                  type="text"
                  fullWidth
                  helperText="Example: #series #idol #artist"
                  onChange={(e) => setTags(e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {role === "Admin" && (
                  <>
                    <small>Announcement</small>
                    <Checkbox
                      checked={ann}
                      onChange={(e) => setAnn(e.target.checked)}
                    />
                  </>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {imagePreviews.length > 0 && (
                  <Box>
                    <Box style={{ display: "flex", flexWrap: "wrap" }}>
                      {imagePreviews.map((preview, index) => (
                        <Box
                          key={index}
                          style={{ margin: 5, position: "relative" }}
                        >
                          <img
                            src={preview}
                            alt={`Pic ${index + 1}`}
                            style={{ width: "auto", height: "220px" }}
                          />
                          <IconButton
                            variant="contained"
                            color="error"
                            sx={{ position: "absolute", top: -10, right: -10 }}
                            onClick={() => removeImage(index)}
                          >
                            <Cancel
                              sx={{
                                bgcolor: "white",
                                borderRadius: "100%",
                                p: 0,
                              }}
                            />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <label htmlFor="upload-files">
                  <UploadButton
                    id="upload-files"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    multiple
                    onChange={handleFileChange}
                  />
                  <Button
                    component="span"
                    fullWidth
                    sx={{
                      px: 4,
                      py: 2,
                      bgcolor: "#17202A",
                      "&:hover": {
                        bgcolor: "#212F3D",
                      },
                    }}
                    variant="contained"
                    startIcon={<FileUpload />}
                  >
                    Upload Images
                  </Button>
                </label>
                <span style={{ fontSize: "10px" }}>
                  Only accepts .png, .jpg, .jpeg formats.
                </span>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "end", gap: 2 }}
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
                  onClick={() => nav("/")}
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
                  onClick={handlerSubmit}
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
