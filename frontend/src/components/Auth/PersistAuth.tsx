import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";
import { checkAuth } from "../../store/slices/auth";
import { AppDispatch, RootState } from "../../store/store";

interface PersistAuthProps {
  children: React.ReactNode;
}

const PersistAuth: React.FC<PersistAuthProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, token } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          return;
        }

        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        console.error("Token verification failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken().catch(console.error);
  }, [dispatch]);

  if (isChecking || isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default PersistAuth;
