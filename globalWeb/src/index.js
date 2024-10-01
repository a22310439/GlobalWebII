import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de importar el AuthProvider
import { CartProvider } from './context/CartContext';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> {/* Asegúrate de envolver App con AuthProvider */}
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
