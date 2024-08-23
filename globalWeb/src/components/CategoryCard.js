// src/components/CategoryCard.js
import React from 'react';
import styled from 'styled-components';

const CategoryCard = ({ image, name }) => (
  <Card>
    <Image src={image} alt={name} />
    <CategoryName>{name}</CategoryName>
  </Card>
);

export default CategoryCard;

const Card = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CategoryName = styled.h2`
  font-size: 24px;
  margin: 20px 0;
  color: #333;
`;
