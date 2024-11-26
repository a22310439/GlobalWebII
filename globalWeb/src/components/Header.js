import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Header = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [userName, setUserName] = useState(''); // Estado para almacenar el nombre del usuario
  const [accountType, setAccountType] = useState(''); // Estado para almacenar el tipo de cuenta
  const { currentUser, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  // Obtener el logo desde Firebase Storage
  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const url = await getDownloadURL(ref(storage, 'logo.png'));
        setLogoUrl(url);
      } catch (error) {
        console.error('Error al obtener el logo desde Firebase Storage:', error);
      }
    };
    fetchLogoUrl();
  }, []);

  // Cargar datos del usuario desde Firestore usando email
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.email) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', currentUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserName(`${userData.firstName} ${userData.lastName}`); // Nombre completo desde Firestore
            setAccountType(userData.accountType || 'user'); // Obtener el tipo de cuenta
          } else {
            console.error('No se encontraron documentos para el correo:', currentUser.email);
            setUserName('Usuario');
            setAccountType('user');
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario desde Firestore:', error);
          setUserName('Usuario'); // En caso de error, mostrar "Usuario"
          setAccountType('user');
        }
      } else {
        setUserName(''); // Si no hay usuario autenticado, resetea el nombre
        setAccountType(''); // Resetea el tipo de cuenta
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const totalItems = getTotalItems();

  const handleLogout = async () => {
    try {
      await logout(); // Cerrar sesión
      navigate('/'); // Redirigir a la página principal
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Link to="/">
          {logoUrl && <Logo src={logoUrl} alt="Electricity company" />}
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
            <WelcomeText>Hola, {userName}</WelcomeText>
            <UserDropdown>
              {accountType === 'admin' && (
                <Link to="/admin">Administración</Link>
              )}
              <button onClick={handleLogout}>Cerrar sesión</button>
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
  cursor: pointer;
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

  a, button {
    display: block;
    width: 100%;
    background-color: transparent;
    border: none;
    color: #004f9a;
    font-size: 16px;
    cursor: pointer;
    text-align: left;
    padding: 8px 0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
