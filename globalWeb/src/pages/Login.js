import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext'; // Usa el contexto de autenticación
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login, loginWithEmailPassword, registerWithEmailPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // Nombre
  const [lastName, setLastName] = useState('');   // Apellido
  const [isRegister, setIsRegister] = useState(false); // Estado para cambiar entre login y registro
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate('/'); // Redirigir al home después del login
    } catch (err) {
      setError('Hubo un problema al iniciar sesión con Google.');
    }
  };

  const handleEmailPasswordLogin = async (event) => {
    event.preventDefault();
    try {
      await loginWithEmailPassword(email, password);
      navigate('/'); // Redirigir al home después del login
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
    }
  };

  const handleEmailPasswordRegister = async (event) => {
    event.preventDefault();
    try {
      await registerWithEmailPassword(email, password, firstName, lastName); // Pasa el nombre y apellido
      navigate('/'); // Redirigir al home después del registro
    } catch (err) {
      setError('No se pudo crear la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</Title>

        <form onSubmit={isRegister ? handleEmailPasswordRegister : handleEmailPasswordLogin}>
          {isRegister && (
            <>
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
            </>
          )}
          <Input
            type="email"
            placeholder="Correo electrónico"
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
          <LoginButton type="submit">
            {isRegister ? 'Registrarse con correo' : 'Iniciar sesión con correo'}
          </LoginButton>
        </form>

        <Separator>O</Separator>

        {!isRegister && (
          <LoginButton onClick={handleGoogleLogin}>Iniciar sesión con Google</LoginButton>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Cambiar entre Login y Registro */}
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

const Separator = styled.div`
  margin: 20px 0;
  font-size: 16px;
  color: #666;
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
