import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { register, clearError, login } from "../../store/slices/auth";
import { AppDispatch, RootState } from "../../store/store";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      await dispatch(
        login({ username: formData.username, password: formData.password }),
      ).unwrap();
    } catch (e) {
      console.error("Failed to register and login:", e);
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
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            error={!!validationErrors.username || !!error}
            helperText={validationErrors.username}
            disabled={isLoading}
            autoFocus
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            error={!!validationErrors.password || !!error}
            helperText={validationErrors.password}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            error={!!validationErrors.confirmPassword || !!error}
            helperText={validationErrors.confirmPassword}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={
              isLoading ||
              !formData.username ||
              !formData.password ||
              !formData.confirmPassword
            }
          >
            {isLoading ? <CircularProgress size={24} /> : "Register"}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate("/login")}
            disabled={isLoading}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
