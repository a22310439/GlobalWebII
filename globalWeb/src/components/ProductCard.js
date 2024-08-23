import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import products from '../data/products'; // Asegúrate de que la ruta de importación sea correcta

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  align-items: center; /* Centrar las cartas en la página */
`;

const ProductCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 80%; /* Ajusta el ancho de las cartas */
  max-width: 600px; /* Limita el ancho máximo de las cartas */
  background-color: #f9f9f9;

  img {
    width: 80px; /* Ajusta el tamaño de la imagen si es necesario */
    height: 80px;
    object-fit: cover;
    margin-right: 20px;
  }

  div {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  h3 {
    font-size: 16px; /* Reduce el tamaño de la fuente si es necesario */
    margin-bottom: 5px; /* Ajusta el espacio debajo del título */
  }

  p {
    margin: 0; /* Elimina cualquier margen adicional alrededor del precio */
    font-size: 14px; /* Ajusta el tamaño de la fuente para el precio */
    color: #333;
  }
`;

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const data = products.filter(product => product.category === categoryName);
    setFilteredProducts(data);
  }, [categoryName]);

  return (
    <div>
      <h1>Productos en {categoryName}</h1>
      <ProductList>
        {filteredProducts.map(product => (
          <ProductCard key={product.id}>
            <img src={product.image} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
          </ProductCard>
        ))}
      </ProductList>
    </div>
  );
};

export default CategoryPage;
