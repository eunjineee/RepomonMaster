import React from "react";
import "./App.scss";
import { MemoryRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Battle from "./pages/Battle";

function App() {
  return (
    <div className="App">
      <MemoryRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
        <Footer />
      </MemoryRouter>
    </div>
  );
}

export default App;
