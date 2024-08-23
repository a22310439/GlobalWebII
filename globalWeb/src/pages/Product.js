import React from 'react';
import { useParams } from 'react-router-dom';

const Product = () => {
  const { id } = useParams();
  // Aquí puedes obtener la información del producto con el id
  return (
    <div>
      <h1>Product Details for {id}</h1>
      {/* Mostrar detalles del producto */}
    </div>
  );
};

export default Product;
