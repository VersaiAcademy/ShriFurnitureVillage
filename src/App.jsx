// App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/header";
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import WoodenSofas from "./pages/collections/WoodenSofas";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import WoodenSofas from './pages/collections/WoodenSofas';
import RefundPolicy from './pages/policies/refund-policy';
import PrivacyPolicy from './pages/policies/privacy-policy';
import TermsOfService from './pages/policies/terms-of-service';
import ContactInformation from './pages/policies/contact-information';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/collections/wooden-sofas" element={<WoodenSofas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections/wooden-sofas" element={<WoodenSofas />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/policies/refund-policy" element={<RefundPolicy />} />
              <Route path="/policies/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/policies/terms-of-service" element={<TermsOfService />} />
              <Route path="/policies/contact-information" element={<ContactInformation />} />
            </Routes>
          
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
