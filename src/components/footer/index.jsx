import React from "react";
import { Link } from "react-router-dom";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import "./footer.css";


export default function Footer() {
  return (
    <footer>
      {/* Subscribe Section */}
      <div className="subscribe">
        <h2>Subscribe to our emails</h2>
        <form>
          <input type="email" placeholder="Email" />
          <button type="submit">→</button>
        </form>
      </div>
      <div className="line"></div>

      {/* Divider + padding after form */}
      <div className="footer-bottom">
        {/* Payment Icons */}
        <div className="payment-icons">
          <FaCcAmex color="#2E77BC" size={36} />
          <FaCcMastercard color="#EB001B" size={36} />
          <FaCcVisa color="#1A1F71" size={36} />
        </div>

        {/* Links + Copyright */}
        <div className="links-copyright">
          <p>© 2025, Sri Furniture Village Powered by Shopify</p>
          <span>·</span>
          <Link to="policies/refund-policy">Refund policy</Link> {/* ✅ React Router Link */}
          <span>·</span>
          <Link to="policies/privacy-policy">Privacy policy</Link>
          <span>·</span>
          <Link to="policies/terms-of-service">Terms of service</Link>
          <span>·</span>
          <Link to="policies/contact-information">Contact information</Link>
        </div>
      </div>
    </footer>
  );
}
