import React from "react";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import { MemoryRouter } from "react-router-dom";
import Main from "./pages/Main";

function App() {
  return (
    <div className="App">
      <MemoryRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />
        </Routes>
        <Footer />
      </MemoryRouter>
    </div>
  );
}

export default App;
