import {
  Card,
  Container,
  IconButton,
  Box,
  CardMedia,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { url } from "../utils/url";
import { getEpisode } from "../utils/api_episodes";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

export default function WatchingPage() {
  const nav = useNavigate();
  const { id } = useParams();

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token, role } = currentUser;

  const { data: episode = {}, isLoading } = useQuery({
    queryKey: ["episode"],
    queryFn: () => getEpisode({ id, token }),
  });

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

  if (isLoading)
    return (
      <>
        <Navbar />
        <Container
          sx={{ display: "flex",alignContent:"center", justifyContent: "center", height: 500 }}
        >
          <CircularProgress />
        </Container>
      </>
    );

  return (
    <>
      <Navbar />
      <Container sx={{ display: "flex", flexDirection: "column",height:"800px" }}>
        <Box sx={{ height: "auto", width: "100%" }}>
          <IconButton onClick={() => nav(`/animes/${episode.anime}`)}>
            <ArrowBackIosNew />
          </IconButton>
        </Box>
        <Card
          component={Paper}
          sx={{
            display: "flex",
            justifyContent: "center",
            mx: "auto",
            bgcolor: "black",
            width: "90%",
            height: "auto",
          }}
        >
          <CardMedia
            component="video"
            src={url + "/" + episode.video}
            controls
            sx={{
              width: "100%",
              height: "auto",
            }}
          />
        </Card>
      </Container>
    </>
  );
}
