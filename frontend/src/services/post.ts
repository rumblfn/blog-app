import api from "./api";
import { Post } from "../types";

export const postService = {
  async getPosts(): Promise<Post[]> {
    const response = await api.get("/posts");
    return response.data;
  },

  async createPost(data: { message: string }) {
    const response = await api.post("/posts", data);
    return response.data;
  },

  async updatePost(id: number, data: { message: string }) {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id: number) {
    await api.delete(`/posts/${id}`);
  },
};
