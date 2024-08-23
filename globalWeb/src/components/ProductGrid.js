import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => (
  <Grid>
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </Grid>
);

export default ProductGrid;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px;
`;
