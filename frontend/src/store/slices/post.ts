import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PostState } from "../../types";
import { postService } from "../../services/post.ts";

const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  return await postService.getPosts();
});

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (data: { message: string }) => {
    return await postService.createPost(data);
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      });
  },
});

export default postSlice.reducer;
