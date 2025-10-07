// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth } from '../firebase';
// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   onAuthStateChanged,   // ✅ add this
//   signOut               // ✅ add this
// } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config"; // ✅ correct path

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to user login/logout
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
