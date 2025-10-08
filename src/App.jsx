import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Layout from './components/Layout';

import ProtectedRoute from './components/ProtectedRoute'; // ✅ Add this import
import Account from './pages/Account'; // ✅ Add this
import WoodenSofas from './pages/collections/WoodenSofas';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Footer from './components/footer';
import RefundPolicy from "./pages/policies/refund-policy";
import PrivacyPolicy from "./pages/policies/privacy-policy";
import TermsOfService from "./pages/policies/terms-of-service";
import ContactInformation from "./pages/policies/contact-information";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Layout>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Footer />} /> */}

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            /> */}
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
            />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wooden-sofas" element={<WoodenSofas />} />
          <Route path="/policies/refund-policy" element={<RefundPolicy />} />
          <Route path="/policies/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/policies/terms-of-service" element={<TermsOfService />} />
          <Route path="/policies/contact-information" element={<ContactInformation />} />
        </Routes>
      {/* <Footer /> */}
    </Layout>     
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
