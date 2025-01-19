import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { postService } from "../../services/post.ts";

const PostEditForm: React.FC = () => {
  const { id } = useParams();
  const postId = Number(id);

  const { posts } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const selectedPost = posts.find((post) => post.id === postId);

  const [message, setMessage] = useState(selectedPost?.message || "");

  useEffect(() => {
    if (!selectedPost || selectedPost.author.username !== user?.username) {
      navigate("/");
    }
  }, [navigate, selectedPost, user]);

  const handleUpdate = async () => {
    if (!selectedPost) return;

    try {
      await postService.updatePost(selectedPost.id, { message });
      navigate("/");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      await postService.deletePost(selectedPost.id);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <Box
      sx={{
        mt: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: "translateY(-50%)",
      }}
    >
      {selectedPost ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 600,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create Post
          </Typography>

          <Box component="form">
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={message.trim() === selectedPost.message}
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button
                type="button"
                color="error"
                variant="contained"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};

export default PostEditForm;
