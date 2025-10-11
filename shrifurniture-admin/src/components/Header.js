import React from 'react';

const Header = ({ onLogout }) => {
  return (
    <div className="header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Sri Furniture Village</h1>
          <p>Admin Dashboard</p>
        </div>
        <button onClick={onLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
