import React from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  IconButton,
} from "@mui/material";
import { Post } from "../../types";
import { RootState } from "../../store/store";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Card
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <CardContent>
        <Typography variant="body1">{post.message}</Typography>
        <Typography variant="caption" color="text.secondary">
          Posted by {post.author.username} on{" "}
          {new Date(post.createdAt).toLocaleString()}
        </Typography>
        {post.media && post.media.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {post.media.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Media ${index + 1}`}
                style={{ maxWidth: "100%", marginBottom: 8 }}
              />
            ))}
          </Box>
        )}
      </CardContent>
      {user && user.username === post.author.username && (
        <CardActions>
          <Link to={`/${post.id}`}>
            <IconButton size="medium" color="primary">
              <EditIcon />
            </IconButton>
          </Link>
        </CardActions>
      )}
    </Card>
  );
};

export default PostItem;
