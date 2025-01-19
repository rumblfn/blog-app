import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PostList from "./components/Posts/PostList";
import Header from "./components/Header/Header.tsx";
import PostEditForm from "./components/Posts/PostEditForm.tsx";

function App() {
  return (
    <Router>
      <Container
        maxWidth="md"
        sx={{
          minHeight: "100dvh",
          height: "100%",
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:id" element={<PostEditForm />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
