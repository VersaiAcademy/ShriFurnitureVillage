import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductPage from './pages/ProductPage';
import Layout from './components/Layout';
import CollectionPage from './pages/collections/CollectionPage';

import ProtectedRoute from './components/ProtectedRoute'; // ✅ Add this import
import Account from './pages/Account'; // ✅ Add this
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Footer from './components/footer';
import RefundPolicy from "./pages/policies/refund-policy";
import PrivacyPolicy from "./pages/policies/privacy-policy";
import TermsOfService from "./pages/policies/terms-of-service";
import ContactInformation from "./pages/policies/contact-information";

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  return (
    <AuthProvider>
      <CartProvider>
      <Layout>
        {/* <Header /> */}

        {/* Admin Routes */}
        {adminToken ? (
          <Routes>
            <Route path="/admin" element={<AdminDashboard onLogout={() => setAdminToken(null)} />} />
            <Route path="*" element={<AdminDashboard onLogout={() => setAdminToken(null)} />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/admin" element={<AdminLogin onLogin={(token) => setAdminToken(token)} />} />
            <Route path="/admin/login" element={<AdminLogin onLogin={(token) => setAdminToken(token)} />} />
            
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/collections/:category" element={<CollectionPage />} />
            <Route path="/policies/refund-policy" element={<RefundPolicy />} />
            <Route path="/policies/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/policies/terms-of-service" element={<TermsOfService />} />
            <Route path="/policies/contact-information" element={<ContactInformation />} />
          </Routes>
        )}
      {/* <Footer /> */}
    </Layout>     
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
