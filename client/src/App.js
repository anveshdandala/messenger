import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup.jsx";
import Messenger from "./pages/Messenger/index.jsx";
import Profile from "./pages/Messenger/profile.jsx";
import "./index.css";

const App = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/messenger/*" element={<Messenger />} />
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </header>
    </div>
  );
};

export default App;
