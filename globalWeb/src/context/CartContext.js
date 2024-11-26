import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase'; // Importa Firestore
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // Importa AuthContext para obtener el usuario actual

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth(); // Obtener el usuario actual

  // Recuperar carrito del usuario desde Firestore
  useEffect(() => {
    const fetchCart = async () => {
      if (currentUser) {
        const cartRef = doc(collection(db, 'carts'), currentUser.uid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          setCartItems(cartDoc.data().items || []);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems([]); // Limpiar el carrito si no hay usuario
      }
    };

    fetchCart();
  }, [currentUser]);

  // Guardar carrito en Firestore
  const saveCart = async (items) => {
    if (currentUser) {
      const cartRef = doc(collection(db, 'carts'), currentUser.uid);
      await setDoc(cartRef, { items });
    }
  };

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevItems, { ...product, quantity: 1 }];
      }

      saveCart(updatedCart); // Guardar en Firestore
      return updatedCart;
    });
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const updateCartItemQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCart(updatedCart); // Guardar en Firestore
      return updatedCart;
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== productId);
      saveCart(updatedCart); // Guardar en Firestore
      return updatedCart;
    });
  };

  // **Agregar la función clearCart aquí**
  const clearCart = () => {
    setCartItems([]); // Vaciar el estado local del carrito
    saveCart([]); // Guardar el carrito vacío en Firestore
  };

  // Obtener el número total de artículos en el carrito
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtener el total del carrito
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // **Asegurarse de incluir clearCart en el objeto value**
  const value = {
    cartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart, // Añadimos clearCart aquí
    getTotalItems,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
