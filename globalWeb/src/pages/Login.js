import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDocs, query, where, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Configuración de Firebase

const LoginPage = () => {
  const { loginWithEmailPassword, login, registerWithEmailPassword } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);

  // Manejo del inicio de sesión
  const handleEmailPasswordLogin = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      // Buscar al usuario por correo o nombre de usuario
      const userQuery = query(
        collection(db, 'users'),
        identifier.includes('@')
          ? where('email', '==', identifier)
          : where('username', '==', identifier)
      );
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        throw new Error('Usuario o correo no encontrado');
      }

      const user = querySnapshot.docs[0].data();

      if (user.password !== password) {
        throw new Error('Contraseña incorrecta');
      }

      // Iniciar sesión en Firebase Authentication
      await loginWithEmailPassword(user.email, password);

      // Verificar el tipo de cuenta y redirigir
      if (user.accountType === 'admin') {
        navigate('/admin'); // Redirige a la pantalla de administración
      } else {
        navigate('/'); // Redirige a la pantalla principal
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Manejo del registro
  const handleEmailPasswordRegister = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const userQuery = query(collection(db, 'users'), where('username', '==', username));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Registrar usuario en Firebase Authentication
      await registerWithEmailPassword(email, password);

      // Guardar datos adicionales en Firestore
      await addDoc(collection(db, 'users'), {
        username,
        email,
        firstName,
        lastName,
        password,
        accountType: 'usuario', // Tipo de cuenta por defecto
      });

      navigate('/'); // Redirigir al home después del registro
    } catch (err) {
      setError(err.message);
    }
  };

  // Manejo del inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate('/'); // Redirigir al home después del login
    } catch (err) {
      setError('Hubo un problema al iniciar sesión con Google.');
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</Title>

        {isRegister ? (
          <form onSubmit={handleEmailPasswordRegister}>
            <Input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <LoginButton type="submit">Registrarse</LoginButton>
          </form>
        ) : (
          <form onSubmit={handleEmailPasswordLogin}>
            <Input
              type="text"
              placeholder="Correo o Nombre de Usuario"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <LoginButton type="submit">Iniciar Sesión con Correo</LoginButton>
          </form>
        )}

        {!isRegister && (
          <>
            <Separator>O</Separator>
            <LoginButton onClick={handleGoogleLogin}>Iniciar sesión con Google</LoginButton>
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ToggleText onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? '¿Ya tienes cuenta? Inicia sesión aquí.'
            : '¿No tienes cuenta? Regístrate aquí.'}
        </ToggleText>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginPage;

// Estilos
const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
`;

const LoginBox = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Separator = styled.div`
  margin: 20px 0;
  font-size: 16px;
  color: #666;
  text-align: center;
  &::before,
  &::after {
    content: '';
    display: inline-block;
    width: 30%;
    height: 1px;
    background: #ccc;
    vertical-align: middle;
    margin: 0 10px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #004f9a;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const LoginButton = styled.button`
  background-color: #004f9a;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #003366;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 10px;
  font-size: 14px;
`;

const ToggleText = styled.p`
  color: #004f9a;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
