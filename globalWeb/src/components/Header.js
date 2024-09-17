import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; // Usa el contexto de autenticación

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { getTotalItems } = useContext(CartContext);
  const { currentUser, logout } = useAuth(); // Obtén currentUser y logout desde AuthContext

  const totalItems = getTotalItems();

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
      {currentUser ? (
        <UserMenu>
          <WelcomeText>Hola, {currentUser.displayName}</WelcomeText>
          <UserDropdown>
            <button onClick={logout}>Cerrar sesión</button>
          </UserDropdown>
        </UserMenu>
        ) : (
        <LoginLink to="/login">Iniciar sesión</LoginLink>
        )}

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

// Estilos
const HeaderContainer = styled.header`
  background-color: #004f9a;
  padding: 0px 20px;
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
  width: 80%;
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
  display: flex;
  flex: 0.8;
  align-items: center;
  justify-content: flex-end;
  margin-left: 20px;
  gap: 20px;
`;

const LoginLink = styled(Link)`
  font-size: 18px;
  margin-right: 20px;
  color: white;
  flex: 1;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CartIconContainer = styled.div`
  position: relative;
`;

const CartIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
  cursor: pointer;
  margin-right: 20px;
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
  right: 0;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
  flex: 1;
`;

const WelcomeText = styled.span`
  font-size: 16px;
  margin-right: 10px;
`;

const UserDropdown = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  padding: 12px;
  left: 0;
  top: 100%;
  min-width: 150px;
  z-index: 1;

  ${UserMenu}:hover & {
    display: block;
  }

  button {
    background-color: transparent;
    border: none;
    color: #004f9a;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
