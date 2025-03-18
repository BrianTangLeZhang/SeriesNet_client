import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  styled,
  OutlinedInput,
  ButtonGroup,
  Box,
} from "@mui/material";
import { registerUser } from "../utils/api_users";
import { Visibility, VisibilityOff, Upload, Cancel } from "@mui/icons-material";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [cfpassword, setCfPassword] = useState("");
  const [profile, setProfile] = useState();
  const [profilePreviews, setProfilePreviews] = useState();

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const signupMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully sign up",
        showConfirmButton: false,
        timer: 1500,
      });
      nav("/login");
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

  const ProfileButton = styled("input")({ height: 0, width: 0 });

  const handleRegister = () => {
    if (
      username === "" ||
      gender === "" ||
      email === "" ||
      password === "" ||
      cfpassword === "" ||
      !profile
    ) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: "All fields are required",
        confirmButtonText: "Try again",
      });
    } else if (
      !email.includes("@") ||
      !email.includes(".") ||
      email.includes("@.")
    ) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: "Email format is incorrect",
        confirmButtonText: "Try again",
      });
    } else if (password !== cfpassword) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: "Password and confirm password should be match",
        confirmButtonText: "Try again",
      });
    } else if (!isNaN(parseInt(username))) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: "Username shouldn't be all number",
        confirmButtonText: "Try again",
      });
    } else {
      signupMutation.mutate({
        username,
        email,
        password,
        gender,
        profile,
      });
    }
  };

  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreviews(reader.result);
      reader.readAsDataURL(file);
      setProfile(file);
    } else {
      console.error("Image format is not acceptable");
    }
  };

  const removeProfile = () => {
    setProfile(null);
    setProfilePreviews(null);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Card sx={{ mt: 5, pt: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            sx={{ marginY: 3 }}
          >
            Sign Up
          </Typography>
          <CardContent>
            <Grid container spacing={3} sx={{ px: 4 }}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Username</InputLabel>
                  <OutlinedInput
                    type="text"
                    label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Email</InputLabel>
                  <OutlinedInput
                    type="text"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth variant="outlined">
                  <ButtonGroup size="large" fullWidth>
                    {gender === "Male" ? (
                      <Button variant="outlined" disabled>
                        Male
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "midnightblue",
                          "&:hover": { bgcolor: "mediumblue" },
                        }}
                        onClick={() => setGender("Male")}
                      >
                        Male
                      </Button>
                    )}
                    {gender === "Female" ? (
                      <Button variant="outlined" disabled>
                        Female
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "BlueViolet",
                          "&:hover": { bgcolor: "MediumPurple" },
                        }}
                        onClick={() => setGender("Female")}
                      >
                        Female
                      </Button>
                    )}
                    {gender === "None" ? (
                      <Button variant="outlined" disabled>
                        Secret
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "DimGray",
                          "&:hover": {
                            bgcolor: "darkgray",
                          },
                        }}
                        onClick={() => setGender("None")}
                      >
                        Secret
                      </Button>
                    )}
                  </ButtonGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    type={show ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShow(!show)}
                          edge="end"
                        >
                          {!show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Confirm Password</InputLabel>
                  <OutlinedInput
                    type={show2 ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShow2(!show2)}
                          edge="end"
                        >
                          {!show2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                    onChange={(e) => setCfPassword(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "60px",
                    height: "60px",
                    border: "solid lightgrey 0.5px",
                    borderRadius: "50%",
                    position:"relative"
                  }}
                >
                  {profilePreviews && (
                    <img
                      src={profilePreviews}
                      alt={profilePreviews}
                      style={{
                        borderRadius: "50%",
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                {profile && (
                  <IconButton
                    variant="contained"
                    color="error"
                    sx={{
                      borderRadius: "100%",
                      position:"absolute",
                      right:"50%",
                      bottom:"-20%"
                    }}
                    onClick={() => removeProfile()}
                  >
                    <Cancel
                      sx={{
                        bgcolor: "white",
                        borderRadius: "100%",
                        p: 0,
                      }}
                    />
                  </IconButton>
                )}
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <label htmlFor="upload-files">
                  <ProfileButton
                    type="file"
                    accept="image/*"
                    id="upload-files"
                    onChange={(e) => handleProfile(e)}
                  />
                  <Button
                    component="span"
                    sx={{
                      bgcolor: "#455A64",
                      color: "white",
                      border: "0px",
                      "&:hover": {
                        bgcolor: "#607D8B",
                      },
                    }}
                    size="large"
                    variant="contained"
                    startIcon={<Upload />}
                  >
                    Profile Picture
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    bgcolor: "#17202A",
                    "&:hover": { bgcolor: "#1C2833" },
                  }}
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Typography variant="span" component={Link} to="/login">
          Already have account?
        </Typography>
      </Container>
    </>
  );
}
