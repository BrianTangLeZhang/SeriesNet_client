import { Upload } from "@mui/icons-material";
import {
  Modal,
  Typography,
  Box,
  TextField,
  Button,
  styled,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { uploadEp } from "../utils/api_episodes";
import Swal from "sweetalert2";

export default function EpisodeAddModal(props) {
  const { animeId, uploading, setUploading } = props;

  const queryClient = useQueryClient();

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const [newEpisode, setNewEpisode] = useState(null);
  const [epTitle, setEpTitle] = useState("");

  const UploadEp = styled("input")({ display: "none" });

  const videoHandler = (e) => {
    setNewEpisode(e.target.files[0]);
  };

  const uploadEpisodeMutation = useMutation({
    mutationFn: uploadEp,
    onSuccess: () => {
      setUploading(false);
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "success",
        title: "Successfully uploaded the episode",
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ["anime"],
      });
    },
    onError: (e) => {
      setUploading(false);
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "error",
        title: `${e.response.data.msg}`,
        confirmButtonText: "Try again",
      });
    },
  });

  const handleSummit = async (e) => {
    e.preventDefault();
    if (epTitle === "" || !newEpisode) {
      Swal.fire({
        color: "#fff",
        background: "#17202A",
        icon: "warning",
        title: "Title and video are required",
        confirmButtonText: "OK",
      });
    } else {
      uploadEpisodeMutation.mutate({
        id: animeId,
        title: epTitle,
        video: newEpisode,
        token,
      });
    }
  };

  return (
    <Modal open={uploading} onClose={() => setUploading(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 350,
          bgcolor: "#17202A",
          border: "1px solid #34495E",
          color: "white",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <Typography variant="h5" textAlign={"center"}>
          Uplaod New Episode
        </Typography>
        <TextField
          fullWidth
          type="text"
          value={epTitle}
          size="small"
          placeholder="Title"
          sx={{ bgcolor: "white", borderRadius: "10px" }}
          onChange={(e) => setEpTitle(e.target.value)}
        />
        <label htmlFor="episode">
          <UploadEp
            id="episode"
            type="file"
            accept="video/*"
            onChange={videoHandler}
          />
          <Button
            component="h6"
            size="large"
            fullWidth
            sx={{ color: "white", border: "1px solid #34495E", height: 120 }}
          >
            <Upload fontSize="large" />
          </Button>
        </label>
        <Button
          variant="contained"
          size="small"
          onClick={handleSummit}
          fullWidth
        >
          add
        </Button>
      </Box>
    </Modal>
  );
}
