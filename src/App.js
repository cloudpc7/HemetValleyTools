import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RepairPage from './pages/RepairPage';
import ShopPage from './pages/ShopPage';
import AccountPage from './pages/AccountPage';
import RentalPage from './pages/RentalPage';
import HomePage from './pages/HomePage';
import SafetyPage from './pages/SafetyPage';
import "./styles/main.scss";

function App() {
  return (
    <Routes>
      <Route to="/home" element={<HomePage />}/>
      <Route to="/repair" element={<RepairPage />}/>
      <Route to="/rental" element={<RentalPage />}/>
      <Route to="/account" element={<AccountPage />}/>
      <Route to="/shop" element={<ShopPage />}/>
      <Route to="/safety-guidlines" element={<SafetyPage />}/>
    </Routes>
  );
}

export default App;
