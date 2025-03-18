import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { loginUser } from "../utils/api_users";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const nav = useNavigate();
  const [cookies, setCookie] = useCookies(["currentUser"]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setCookie("currentUser", data, { maxAge: 3600 * 8 });
      localStorage.setItem("user", data.token);
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully logged-in",
        showConfirmButton: false,
        timer: 1500,
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

  const handleLogin = () => {
    if (username === "" || email === "" || password === "") {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: "All fields are required",
        confirmButtonText: "Try again",
      });
    } else {
      loginMutation.mutate({
        username,
        email,
        password,
      });
    }
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
            Login
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
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Typography variant="span" component={Link} to="/register">
          No account yet?
        </Typography>
      </Container>
    </>
  );
}
