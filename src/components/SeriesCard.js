import { Card, Typography, Box, CardMedia } from "@mui/material";
import { url } from "../utils/url";
import { useNavigate } from "react-router-dom";

export default function SeriesCard(props) {
  const { anime } = props;
  const nav = useNavigate();
  return (
    <Card
      onClick={() => nav(`/series/${anime._id}`)}
      sx={{
        height: 350,
        width: 250,
        position: "relative",
        boxShadow: "10px 10px 10px rgba(0,0,0,0.3)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          height: "25%",
          width: "100%",
          bottom: 0,
          bgcolor: "rgba(0,0,0,0.6)",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="p" fontWeight={"bold"} sx={{ width: "99%" }}>
          {anime.name}
        </Typography>
      </Box>
      <CardMedia
        component="img"
        height="100%"
        image={url + "/poster/" + anime.poster}
      />
    </Card>
  );
}
