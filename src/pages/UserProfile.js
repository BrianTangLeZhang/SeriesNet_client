import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getUser } from "../utils/api_users";
import { getUserPosts } from "../utils/api_posts";
import { useQuery } from "@tanstack/react-query";
import { url } from "../utils/url";
import { useCookies } from "react-cookie";
import PostCard from "../components/PostCard";

export default function UserProfile() {
  const { id } = useParams();

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token, role } = currentUser;

  const { data: user = {} } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getUserPosts(id),
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

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Card component={Paper}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              bgcolor: "black",
            }}
          >
            <Box sx={{ textAlign: "center", py: 3 }}>
              <img
                src={`${url}/profileImg/${user.profile}`}
                alt=""
                style={{
                  borderRadius: 100,
                  height: "100px",
                  width: "100px",
                  objectFit: "cover",
                }}
              />
              <Typography variant="h4" color="white" fontWeight="bold">
                {user.username}
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ padding: 5 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontSize: "20px" }}>
              Email: {user.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontSize: "20px" }}>
              Gender: {user.gender}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontSize: "20px" }}>
              Role: {user.role}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontSize: "20px" }}>
              Online: {user.isOnline ? "Yes" : "No"}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </CardContent>
        </Card>
        <Typography
          variant="h6"
          sx={{ my: "10px", textAlign: "center", fontWeight: "bolder" }}
        >
          Post of user
        </Typography>
        <Box component={Paper}>
          {posts && posts.length > 0 ? (
            <Box>
              {posts.map(
                (post) =>
                  post.announcement && (
                    <Grid item xs={12} key={post._id}>
                      <PostCard post={post} />
                    </Grid>
                  )
              )}
              {posts.map(
                (post) => !post.announcement && <PostCard post={post} />
              )}
            </Box>
          ) : (
            <Box sx={{ p: 3, mt: 5 }}>
              <Typography variant="h6" align="center" sx={{ fontSize: "22px" }}>
                This user does not have any post.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}
