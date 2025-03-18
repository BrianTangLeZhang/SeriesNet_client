import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  TableContainer,
  TableFooter,
  TableRow,
  TableBody,
  Container,
  Typography,
  Paper,
  FormControl,
  Box,
  TextField,
  Button,
  Grid,
  Divider,
  Table,
  IconButton,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getUsers } from "../utils/api_users";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { url } from "../utils/url";

export default function UsersPage() {
  const nav = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;

  const [username, setUsername] = useState("");
  const [page, setPage] = useState(1);

  const usersPerPage = 10;

  const { data: users = [] } = useQuery({
    queryKey: ["users", username, page],
    queryFn: () => getUsers(username, page),
  });

  if (!role) {
    return (
      <>
        <Navbar />
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h5">You need to login first</Typography>
          <Typography component={Link} to="/login" sx={{ color: "#0066cc" }}>
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
        <Box sx={{ my: 3 }}>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  label="Search User"
                  placeholder="Search by username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setPage(1);
                  }}
                  sx={{ mb: 3 }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableBody>
                {users.map((user) => {
                  if (user.role !== "Admin") {
                    return (
                      <TableRow
                        onClick={() => nav(`/users/${user._id}`)}
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 3,
                          py: 2,
                          "&:hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                        key={user._id}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={`${url}/profileImg/${user.profile}`}
                            alt={user.username}
                            style={{
                              height: "40px",
                              width: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginRight: "10px",
                            }}
                          />
                          <Typography variant="h6" fontWeight="bold">
                            {user.username}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: user.isOnline ? "green" : "red",
                          }}
                        />
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>

            <Divider sx={{ mt: 2 }} />
            {users.length === usersPerPage && (
              <>
                <TableFooter
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <IconButton
                    variant="outlined"
                    onClick={() => page > 1 && setPage(page - 1)}
                    disabled={page === 1}
                  >
                    {"<"}
                  </IconButton>
                  <Typography variant="body1">Page {page}</Typography>
                  <IconButton
                    variant="outlined"
                    onClick={() => users.length === 10 && setPage(page + 1)}
                    disabled={users.length < 10}
                  >
                    {">"}
                  </IconButton>
                </TableFooter>
              </>
            )}
          </TableContainer>
        </Box>
      </Container>
    </>
  );
}
