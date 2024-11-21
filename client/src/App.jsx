import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBarApp from "./components/NavBar";
import Login from "./pages/Login";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import "./App.css";

const App = () => {
  const { user } = useContext(AuthContext);
  return (
    <ChatContextProvider user={user}>
      <NavBarApp />
      <Container>
        <Routes>
          <Route path="/:id" element={user ? <Chat /> : <Login />} />

          <Route path="register" element={user ? <Chat /> : <Register />} />
          <Route path="login" element={user ? <Chat /> : <Login />} />
          <Route path="/" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
};

export default App;
