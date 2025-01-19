export const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.CLIENT_URL]
      : ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};
