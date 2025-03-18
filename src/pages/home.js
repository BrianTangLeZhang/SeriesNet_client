import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  MenuItem,
  FormControl,
  TextField,
  IconButton,
} from "@mui/material";
import { getPosts } from "../utils/api_posts";
import PostCard from "../components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Add, ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

export default function Home() {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");

  const postsPerPage = 10; 

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;

  const nav = useNavigate();

  const { data: posts = [] } = useQuery({
    queryKey: ["posts", search, tags, page, sort],
    queryFn: () => getPosts(search, tags, page, sort),
  });

  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ flexDirection: "column", mt: 4 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControl sx={{ flex: 2 }}>
              <TextField
                size="small"
                label="Search"
                placeholder="Search By Title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ flex: 2 }}>
              <TextField
                size="small"
                label="Tags"
                placeholder="Search By Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <TextField
                size="small"
                select
                label="Sort By"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="popularity">Popularity</MenuItem>
              </TextField>
            </FormControl>
            {role && (
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
                onClick={() => nav("/addPost")}
              >
                <Add />
              </Button>
            )}
          </Box>
          <Box>
            {posts && posts.length > 0 ? (
              <Box>
                <Grid container spacing={2}>
                  {posts.map((post) =>
                    post.announcement ? (
                      <Grid item xs={12} key={post._id}>
                        <PostCard post={post} />
                      </Grid>
                    ) : null
                  )}
                  {posts.map((post) =>
                    !post.announcement ? (
                      <Grid item xs={12} key={post._id}>
                        <PostCard post={post} />
                      </Grid>
                    ) : null
                  )}
                </Grid>

                {posts.length === postsPerPage && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      py: 3,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => page !== 1 && setPage(page - 1)}
                      disabled={page === 1}
                      sx={{
                        bgcolor: "#EAECEE",
                        "&:hover": { bgcolor: "#CACFD2" },
                        transition: "background-color 0.3s ease-in-out",
                      }}
                    >
                      <ArrowBackIosNew fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontWeight: "bold" }}>{page}</Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        posts.length === postsPerPage && setPage(page + 1)
                      }
                      disabled={posts.length < postsPerPage}
                      sx={{
                        bgcolor: "#EAECEE",
                        "&:hover": { bgcolor: "#CACFD2" },
                        transition: "background-color 0.3s ease-in-out",
                      }}
                    >
                      <ArrowForwardIos fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ p: 3, mt: 5, textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  No Posts Found
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Try adjusting your search or filters.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}
