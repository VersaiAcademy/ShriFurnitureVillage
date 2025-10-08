// src/pages/Account.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Anshu Raghav',
      phone: '+91 9876543210',
      addressLine: 'House No. 123, Street Name',
      city: 'Jodhpur',
      state: 'Rajasthan',
      pincode: '342001',
      country: 'India',
      isDefault: true
    }
  ]);

  // Sample order history
  const [orders] = useState([]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newAddr = {
      ...newAddress,
      id: addresses.length + 1
    };
    setAddresses([...addresses, newAddr]);
    setNewAddress({
      name: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: false
    });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Account Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">Account</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-gray-900 underline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order History Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order history</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border-b pb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Order #{order.id}</span>
                      <span className="text-sm text-gray-600">{order.date}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>Status: {order.status}</p>
                      <p>Total: ₹{order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Details Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account details</h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-medium">{user?.displayName || user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-gray-600">India</p>
            </div>

            {/* Addresses */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Addresses ({addresses.length})
                </h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  {showAddressForm ? 'Cancel' : 'Add new address'}
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Line"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({...newAddress, addressLine: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 text-sm"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.map(address => (
                  <div key={address.id} className="border rounded-lg p-4 relative">
                    {address.isDefault && (
                      <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    <p className="font-medium text-gray-900">{address.name}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-700 mt-2">
                      {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    
                    <div className="mt-3 flex gap-3">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          Set as default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}