import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import '../policies/refundpolicy.css'; // Optional CSS for global styles

const ContactInformation = () => {
  return (
    <div className="contact-page" style={{ fontFamily: 'Arial, sans-serif', padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', color: '#333' }}>Contact Us</h1>

      {/* Contact Info Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <div style={{ flex: '1 1 250px', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <FaMapMarkerAlt style={{ fontSize: '1.5rem', color: '#5e5845ff', marginBottom: '0.5rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Our Office</h3>
          <p>123 Furniture Street, Jaipur, Rajasthan, India<br />Pin Code: 302001</p>
        </div>

        <div style={{ flex: '1 1 250px', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <FaPhoneAlt style={{ fontSize: '1.5rem', color: '#5e5845ff', marginBottom: '0.5rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Call / Email</h3>
          <p>
            Phone: <a href="tel:+911234567890" style={{ color: '#5e5845ff', textDecoration: 'none' }}>+91 123 456 7890</a><br />
            Email: <a href="mailto:srifurniturevillageofficial@gmail.com" style={{ color: '#5e5845ff', textDecoration: 'none' }}>srifurniturevillageofficial@gmail.com</a>
          </p>
        </div>

        <div style={{ flex: '1 1 250px', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <FaEnvelope style={{ fontSize: '1.5rem', color: '#5e5845ff', marginBottom: '0.5rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Follow Us</h3>
          <p>
            <a href="https://facebook.com/srifurniturevillage" target="_blank" rel="noopener noreferrer" style={{ marginRight: '0.5rem', color: '#4267B2' }}><FaFacebookF /></a>
            <a href="https://instagram.com/srifurniturevillage" target="_blank" rel="noopener noreferrer" style={{ marginRight: '0.5rem', color: '#C13584' }}><FaInstagram /></a>
            <a href="https://linkedin.com/company/srifurniturevillage" target="_blank" rel="noopener noreferrer" style={{ color: '#0A66C2' }}><FaLinkedinIn /></a>
          </p>
        </div>
      </div>

      {/* Map + Form Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Google Map */}
        <div style={{ flex: '1 1 500px', minHeight: '400px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <iframe
            title="Sri Furniture Village Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.123456789!2d75.812345!3d26.912345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c123456789%3A0xabcdef123456!2sSri%20Furniture%20Village!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Contact Form */}
        <div style={{ flex: '1 1 500px', padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Send Us a Message</h2>
          <form
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! Your message has been sent.');
            }}
          >
            <input type="text" name="name" placeholder="Your Name" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input type="email" name="email" placeholder="Your Email" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input type="text" name="subject" placeholder="Subject" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <textarea name="message" placeholder="Your Message" required rows="5" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}></textarea>
            <button type="submit" style={{ padding: '1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
