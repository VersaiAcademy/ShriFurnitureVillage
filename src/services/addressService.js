// src/services/addressService.js
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

// Get user's addresses
export const getUserAddresses = async (userId) => {
  try {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const snapshot = await getDocs(addressesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
};

// Add new address
export const addAddress = async (userId, addressData) => {
  try {
    const addressRef = doc(collection(db, 'users', userId, 'addresses'));
    await setDoc(addressRef, {
      ...addressData,
      createdAt: new Date().toISOString()
    });
    return { id: addressRef.id, ...addressData };
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

// Update address
export const updateAddress = async (userId, addressId, addressData) => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await updateDoc(addressRef, addressData);
    return true;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Delete address
export const deleteAddress = async (userId, addressId) => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressRef);
    return true;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Set default address
export const setDefaultAddress = async (userId, addressId) => {
  try {
    // First, remove default from all addresses
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const snapshot = await getDocs(addressesRef);
    
    const promises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { isDefault: false })
    );
    await Promise.all(promises);

    // Then set the selected address as default
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await updateDoc(addressRef, { isDefault: true });
    
    return true;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};

// Save user profile
export const saveUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, profileData, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};