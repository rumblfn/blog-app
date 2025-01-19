import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { fetchPosts } from "../../store/slices/post";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import { AppDispatch, RootState } from "../../store/store";

const PostList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      {user && <PostForm />}
      {posts?.length > 0 &&
        posts.map((post) => <PostItem key={post.id} post={post} />)}
    </Box>
  );
};

export default PostList;
