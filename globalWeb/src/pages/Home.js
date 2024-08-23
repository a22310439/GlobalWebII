import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columnas en pantallas grandes */
  gap: 20px;
  padding: 20px;
  background-color: #fafafa;
  margin-bottom: 5px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas cuando la pantalla es mediana */
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 1 columna cuando la pantalla es pequeña */
  }
`;

const CategoryCard = styled.div`
  background-color: #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 300px;
  margin-top: 20px;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin-bottom: 10px;
    transition: transform 0.3s ease;
  }

  h3 {
    font-size: 18px;
    margin-top: auto;
    color: #333;
  }
`;

const Home = () => (
  <CategoriesContainer>
    <Link to="/category/chargers">
      <CategoryCard>
        <img src='images/categories/chargers.webp' alt="Cargadores" />
        <h3>Cargadores</h3>
      </CategoryCard>
    </Link>
    <Link to="/category/cables">
      <CategoryCard>
        <img src='images/categories/cables.webp' alt="Cables" />
        <h3>Cables</h3>
      </CategoryCard>
    </Link>
    <Link to="/category/headphones">
      <CategoryCard>
        <img src='images/categories/headphones.webp' alt="Audífonos" />
        <h3>Audífonos</h3>
      </CategoryCard>
    </Link>
    <Link to="/category/stands">
      <CategoryCard>
        <img src='images/categories/stands.webp' alt="Soportes" />
        <h3>Soportes</h3>
      </CategoryCard>
    </Link>
    <Link to="/category/power-banks">
      <CategoryCard>
        <img src='images/categories/power-banks.webp' alt="Baterías externas" />
        <h3>Baterías externas</h3>
      </CategoryCard>
    </Link>
    <Link to="/category/speakers">
      <CategoryCard>
        <img src='images/categories/speakers.webp' alt="Bocinas" />
        <h3>Bocinas</h3>
      </CategoryCard>
    </Link>
  </CategoriesContainer>
);

export default Home;
