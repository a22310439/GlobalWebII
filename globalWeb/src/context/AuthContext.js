// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const loginWithEmailPassword = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
  
      // Obtener datos adicionales desde Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser({
          ...result.user,
          accountType: userData.accountType, // Agregar el tipo de cuenta
        });
      } else {
        console.error('El documento del usuario no existe en Firestore.');
        setCurrentUser(result.user); // Usuario sin datos adicionales
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      throw error;
    }
  };

  const registerWithEmailPassword = async (email, password, firstName, lastName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
  
      // Guardar nombre y apellido en el perfil del usuario
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`,
      });
  
      // Forzar la actualización del usuario actual
      const updatedUser = { ...auth.currentUser };
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error during email/password registration:', error);
      throw error;
    }
  };

  const logout = () => {
    auth.signOut();
    setCurrentUser(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          ...user,
          displayName: user.displayName || 'Usuario', // Valor predeterminado si displayName no está definido
        });
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);
  

  const value = {
    currentUser,
    login,
    loginWithEmailPassword,
    registerWithEmailPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
