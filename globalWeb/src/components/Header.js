import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../context/CartContext'; // Importa el contexto del carrito

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { getTotalItems } = useContext(CartContext); // Obtén el número total de artículos
  const totalItems = getTotalItems(); // Calcula el total de artículos

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Link to="/">
          <Logo src='/images/logo.png' alt="Electricity company" />
        </Link>
      </LogoContainer>
      <SearchBarContainer onSubmit={handleSearchSubmit}>
        <SearchInput
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <SearchButton type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </SearchButton>
      </SearchBarContainer>
      <Nav>
        <Link to="/cart">
          <CartIconContainer>
            <CartIcon icon={faShoppingCart} />
            {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
          </CartIconContainer>
        </Link>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  background-color: #004f9a;
  padding: 0px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 129px;
  margin-right: 15px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(-10deg);
    animation: swing 0.2s ease forwards;
  }

  @keyframes swing {
    20% { transform: rotate(10deg); }
    40% { transform: rotate(-10deg); }
    60% { transform: rotate(5deg); }
    80% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
  }
`;

const SearchBarContainer = styled.form`
  display: flex;
  width: 50%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 50px 0 0 50px;
  border: none;
  font-size: 16px;

  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  background-color: #003366;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 0 50px 50px 0;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #002244;
  }
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  
  a {
    font-size: 18px;
    margin-right: 50px;
  }
`;

const CartIconContainer = styled.div`
  position: relative;
`;

const CartIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    animation: bounce 0.6s ease infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -20px;
  right: -20px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
`;
