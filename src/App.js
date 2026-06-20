import React, {useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import RepairPage from './pages/RepairPage';
import ShopPage from './pages/ShopPage';
import AccountPage from './pages/AccountPage';
import RentalPage from './pages/RentalPage';
import HomePage from "./pages/HomePage";
import SafetyPage from './pages/SafetyPage';
import "./styles/main.scss";

function App() {
  const [link, setLink] = useState("");
  return (
    <Routes>
      <Route path="/" element={<HomePage link={link} setLink={setLink} />} />
      <Route path="/repairs" element={<RepairPage link={link} setLink={setLink}/>} />
      <Route path={`/rentals`} element={<RentalPage link={link} />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/safety-guidlines" element={<SafetyPage />} />
    </Routes>
  );
}

export default App;