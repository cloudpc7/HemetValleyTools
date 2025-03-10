import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RepairPage from './pages/RepairPage';
import ShopPage from './pages/ShopPage';
import AccountPage from './pages/AccountPage';
import RentalPage from './pages/RentalPage';
import HomePage from "./pages/HomePage";
import SafetyPage from './pages/SafetyPage';
import "./styles/main.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/repair" element={<RepairPage />} />
      <Route path="/rental" element={<RentalPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/safety-guidlines" element={<SafetyPage />} />
    </Routes>
  );
}

export default App;