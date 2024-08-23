import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GlobalStyle from './styles/Styles';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import SearchResultsPage from './pages/SearchResultsPage';
import { CartProvider } from './context/CartContext';  // Importa el proveedor de contexto

function App() {
  return (
    <CartProvider> {/* Envuelve la aplicación en CartProvider */}
      <Router>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search/:searchTerm" element={<SearchResultsPage />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
