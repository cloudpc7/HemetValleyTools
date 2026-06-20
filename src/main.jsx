import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Providers/ThemeContext.jsx';
import HomePage from './pages/HomePage.jsx';
import RentalsPage from './pages/RentalsPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import RepairPage from './pages/RepairPage.jsx';
import B2BPage from './pages/B2BPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import B2BDashboardPage from './pages/B2BDashboardPage.jsx';
import ProPortalLoginPage from './pages/ProPortalLoginPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import AuthListener from './ui/components/AuthListener.jsx';
import ProtectedRoute from './ui/components/ProtectedRoute.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthListener />
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/repair" element={<RepairPage />} />
            <Route path="/b2b" element={<B2BPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pro-login" element={<ProPortalLoginPage />} />
            <Route path="/pro-portal" element={<ProtectedRoute><B2BDashboardPage /></ProtectedRoute>} />
            <Route path="/b2b-dashboard" element={<ProtectedRoute><B2BDashboardPage /></ProtectedRoute>} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
