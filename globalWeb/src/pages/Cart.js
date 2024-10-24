import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart();

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calcular el monto total del descuento
  const totalDiscount = cartItems.reduce((total, item) => {
    if (item.discount) {
      const discountAmount = (item.priceBeforeDiscount - item.price) * item.quantity;
      return total + discountAmount;
    }
    return total;
  }, 0);

  // Calcular el subtotal después del descuento
  const subtotalAfterDiscount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0) - totalDiscount;

  // Calcular el IVA (16% del subtotal después del descuento)
  const iva = subtotalAfterDiscount * 0.16;

  const handleIncreaseQuantity = (item) => {
    if (item.quantity < 5 && item.quantity < item.stock) {
      updateCartItemQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.quantity - 1);
    }
  };

  const [emptyCartImageUrl, setEmptyCartImageUrl] = useState('');

  useEffect(() => {
    const fetchEmptyCartImage = async () => {
      try {
        const url = await getDownloadURL(ref(storage, 'carritoVacio.webp'));
        setEmptyCartImageUrl(url);
      } catch (error) {
        console.error('Error al obtener la imagen del carrito vacío desde Firebase Storage:', error);
      }
    };
    fetchEmptyCartImage();
  }, []);

  if (totalItemsInCart === 0) {
    return (
      <EmptyCartContainer>
        {emptyCartImageUrl && <img src={emptyCartImageUrl} alt="Carrito vacío" />}
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

                {/* Mostrar el precio original y el precio con descuento si aplica */}
                {item.discount ? (
                  <div>
                    <p>
                      <span style={{ textDecoration: 'line-through', color: '#999' }}>
                        ${item.priceBeforeDiscount ? item.priceBeforeDiscount.toFixed(2) : item.price.toFixed(2)}
                      </span>{' '}
                      <DiscountTag>{item.discountPercentage}% menos</DiscountTag>
                    </p>
                  </div>
                ) : (
                  <p>${item.price.toFixed(2)}</p>
                )}

                <QuantityControls>
                  <button onClick={() => handleDecreaseQuantity(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncreaseQuantity(item)} disabled={item.quantity >= 5 || item.quantity >= item.stock}>
                    +
                  </button>
                </QuantityControls>

                {item.stock <= 0 && <p style={{ color: 'red' }}>Sin stock disponible</p>}
                {item.quantity === item.stock && <p style={{ color: 'orange' }}>Stock limitado: No hay más unidades</p>}

                <RemoveButton onClick={() => removeFromCart(item.id)}>Eliminar</RemoveButton>
              </ProductDetails>
              <TotalPrice>${(item.price * item.quantity).toFixed(2)}</TotalPrice>
            </CartItem>
          ))}
        </CartItems>
        <CartSummary>
          <p>Subtotal ({totalItemsInCart} artículo{totalItemsInCart !== 1 && 's'}): <span>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span></p>

          {/* Mostrar el total del descuento en color verde */}
          {totalDiscount > 0 && <DiscountText>Descuento: <span>-${totalDiscount ? totalDiscount.toFixed(2) : '0.00'}</span></DiscountText>}

          {/* Mostrar el IVA (16%) */}
          <p>IVA (16%): <span>${iva.toFixed(2)}</span></p>

          {/* Barra separadora */}
          <Separator />

          {/* Mostrar el total en negritas */}
          <TotalText>Total: <span>${(subtotalAfterDiscount + iva).toFixed(2)}</span></TotalText>
          <CheckoutButton>Continuar</CheckoutButton>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default CartPage;

// Definimos el componente CategoryLinks
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

// Estilos adicionales
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

const CartContainer = styled.div`
  width: 80%;
  margin: 0px auto;
  padding: 20px;
`;

const CartContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
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
  flex-wrap: wrap;

  img {
    width: 100px;
    height: auto;
    margin-right: 20px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    img {
      margin-bottom: 10px;
    }
  }
`;

const ProductDetails = styled.div`
  flex-grow: 1;
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

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
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
  align-self: flex-end;
  margin: 0;
  text-align: right;
  flex: 0 0 auto;

  @media (max-width: 480px) {
    align-self: flex-end;
    margin-top: 10px;
  }
`;

const CartSummary = styled.div`
  flex: 1;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  height: fit-content;
  align-self: flex-start;

  @media (max-width: 480px) {
    padding: 15px;
    font-size: 16px;
    align-self: flex-end;
  }

  p {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    font-size: 18px;
  }
`;

const DiscountTag = styled.span`
  background-color: #f00;
  color: #fff;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
`;

const DiscountText = styled.p`
  color: #27ae60;
  font-size: 18px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const TotalText = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Separator = styled.hr`
  border: none;
  border-top: 2px solid #ccc;
  margin: 20px 0;
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
  @media (max-width: 480px) {
    padding: 12px;
    font-size: 16px;
  }
`;
