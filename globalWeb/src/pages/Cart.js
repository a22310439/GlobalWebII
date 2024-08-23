import React, { useContext } from 'react';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useContext(CartContext);

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleIncreaseQuantity = (item) => {
    updateCartItemQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.quantity - 1);
    }
  };

  if (totalItemsInCart === 0) {
    return (
      <EmptyCartContainer>
        <img src="/images/carritoVacio.webp" alt="Carrito vacío" />
        <h2>Es momento de comprar</h2>
        <p>Tu carrito está vacío</p>
        <p>Llénalo con productos de estas categorías:</p>
        <CategoryLinks>
          <Link to="/category/cables">Cables</Link>
          <Link to="/category/chargers">Cargadores</Link>
          <Link to="/category/headphones">Audífonos</Link>
          <Link to="/category/stands">Soportes</Link>
          <Link to="/category/power-banks">Power Banks</Link>
          <Link to="/category/speakers">Bocinas</Link>
        </CategoryLinks>
        <Link to="/">Inicio</Link>
      </EmptyCartContainer>
    );
  }

  return (
    <CartContainer>
      <h1>Carrito ({totalItemsInCart} artículo{totalItemsInCart !== 1 && 's'})</h1>
      <CartContent>
        <CartItems>
          {cartItems.map((item) => (
            <CartItem key={item.id}>
              <img src={item.image} alt={item.name} />
              <ProductDetails>
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
                <QuantityControls>
                  <button onClick={() => handleDecreaseQuantity(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncreaseQuantity(item)}>+</button>
                </QuantityControls>
                <RemoveButton onClick={() => removeFromCart(item.id)}>Eliminar</RemoveButton>
              </ProductDetails>
              <TotalPrice>${(item.price * item.quantity).toFixed(2)}</TotalPrice>
            </CartItem>
          ))}
        </CartItems>
        <CartSummary>
          <p>Subtotal ({totalItemsInCart} artículo{totalItemsInCart !== 1 && 's'}): ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
          <p>Envío a domicilio: $54.00</p>
          <p>Total: ${(cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + 54).toFixed(2)}</p>
          <CheckoutButton>Continuar</CheckoutButton>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default CartPage;

// Estilos
const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px;

  img {
    width: 200px;
    height: auto;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    margin-bottom: 20px;
  }

  a {
    text-decoration: none;
    color: #004f9a;
    font-size: 16px;
    margin: 5px 0;
    padding: 10px 20px;
    border: 1px solid #004f9a;
    border-radius: 50px;
    display: inline-block;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #004f9a;
      color: white;
    }
  }
`;

const CategoryLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;

  a {
    margin: 5px;
    padding: 10px 20px;
    border: 1px solid #004f9a;
    border-radius: 50px;
    text-decoration: none;
    color: #004f9a;
    font-size: 16px;

    &:hover {
      background-color: #004f9a;
      color: white;
    }
  }
`;

const CartContainer = styled.div`
  margin-top: 40px; /* Agrega espacio entre el header y el contenido del carrito */
  padding: 20px;
`;

const CartContent = styled.div`
  display: flex;
  justify-content: space-between;

  /* Media query para apilar CartItems y CartSummary en pantallas pequeñas */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CartItems = styled.div`
  flex: 2;
  margin-right: 20px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;

  img {
    width: 100px;
    height: auto;
    margin-right: 20px;
  }
`;

const ProductDetails = styled.div`
  flex-grow: 1; /* Esto permite que el contenedor ocupe el espacio disponible */
  display: flex;
  flex-direction: column;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;

  button {
    background-color: #004f9a;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #003366;
    }
  }

  span {
    margin: 0 10px;
    font-size: 18px;
  }
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: #e74c3c;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

const TotalPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  align-self: flex-end; /* Alinea el precio a la derecha */
  margin: 0;
`;

const CartSummary = styled.div`
  flex: 1;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  height: fit-content;

  p {
    font-size: 18px;
    margin: 10px 0;
  }

  p:nth-child(3) {
    font-size: 24px;
    font-weight: bold;
    color: #27ae60;
  }
`;

const CheckoutButton = styled.button`
  background-color: #004f9a;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 18px;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #003366;
  }
`;
