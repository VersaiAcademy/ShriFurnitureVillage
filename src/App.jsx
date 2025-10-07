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
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
