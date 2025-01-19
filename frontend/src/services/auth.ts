import api from "./api";
import { LoginCredentials, RegisterCredentials } from "../types";
import axios, { AxiosError } from "axios";

interface ApiError {
  message: string;
  statusCode?: number;
  errors?: string[];
}

export class AuthError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public errors?: string[],
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response) {
      const errorData = axiosError.response.data as ApiError;
      throw new AuthError(
        errorData.message || "Authentication failed",
        axiosError.response.status,
        errorData.errors,
      );
    } else if (axiosError.request) {
      throw new AuthError(
        "No response from server. Please check your internet connection.",
      );
    } else {
      throw new AuthError("Failed to make request: " + axiosError.message);
    }
  }

  throw new AuthError(
    error instanceof Error ? error.message : "An unexpected error occurred",
  );
};

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      if (!credentials.username.trim()) {
        throw new AuthError("Username is required");
      }
      if (!credentials.password.trim()) {
        throw new AuthError("Password is required");
      }

      const response = await api.post<LoginResponse>(
        "/users/login",
        credentials,
      );
      if (!response.data.token) {
        throw new AuthError("Invalid response from server: missing token");
      }

      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async checkAuth() {
    try {
      const response = await api.get("/users/refresh", {
        withCredentials: true,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      throw handleApiError(error);
    }
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      if (!credentials.username.trim()) {
        throw new AuthError("Username is required");
      }
      if (!credentials.password.trim()) {
        throw new AuthError("Password is required");
      }
      if (credentials.password !== credentials.confirmPassword) {
        throw new AuthError("Passwords do not match");
      }
      if (credentials.password.length < 6) {
        throw new AuthError("Password must be at least 6 characters long");
      }

      const response = await api.post<RegisterResponse>("/users/register", {
        username: credentials.username.trim(),
        password: credentials.password,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout() {
    try {
      localStorage.removeItem("token");
      localStorage.clear();
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("token");
    }
  },
};
