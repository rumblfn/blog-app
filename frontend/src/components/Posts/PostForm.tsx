import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { createPost } from "../../store/slices/post";
import { AppDispatch } from "../../store/store.ts";

const PostForm: React.FC = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await dispatch(createPost({ message }));
      setMessage("");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Post
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" disabled={!message.trim()}>
            Post
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PostForm;
