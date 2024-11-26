import React from 'react';
import {Route, Routes } from 'react-router-dom';
import GlobalStyle from './styles/Styles';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import SearchResultsPage from './pages/SearchResultsPage';
import { CartProvider } from './context/CartContext';  
import { AuthProvider } from './context/AuthContext';  // Importa el proveedor de autenticación

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search/:searchTerm" element={<SearchResultsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
