import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><a href="/" className="active">Dashboard</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/categories">Categories</a></li>
        <li><a href="/orders">Orders</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
