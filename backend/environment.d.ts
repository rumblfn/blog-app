declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      JWT_ACCESS: string;
      JWT_REFRESH: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      NODE_ENV: "development" | "production";
      CLIENT_URL: string;
    }
  }
}

export {};
