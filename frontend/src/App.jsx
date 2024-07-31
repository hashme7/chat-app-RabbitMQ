import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./component/Chat.jsx";
import Login from "./component/Login.jsx";
import Signup from "./component/Signup.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import RedirectRoute from "./component/RedirectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
        <Route path="/" element={<RedirectRoute element={<Login />} />} />
        <Route path="/signup" element={<RedirectRoute element={<Signup />} />} />
      </Routes>
    </Router>
  );
}

export default App;
