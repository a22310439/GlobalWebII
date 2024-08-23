import products from '../data/products';

export const getProductData = (categoryName) => {
  return products.filter(product => product.category === categoryName);
};
