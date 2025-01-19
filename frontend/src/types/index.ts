export interface User {
  id: number;
  username: string;
}

export interface Post {
  id: number;
  message: string;
  media: string[];
  createdAt: string;
  author: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}
