import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';

// Mapeo de traducciones de categorías
const categoryTranslations = {
  chargers: 'Cargadores',
  cables: 'Cables',
  headphones: 'Audífonos',
  stands: 'Soportes',
  'power-banks': 'Baterías externas',
  speakers: 'Bocinas'
};

// Estilo para el título
const Title = styled.h1`
  font-size: 1.5rem;
  color: #004f9a;
  text-align: center;
  margin: 40px 0;
  letter-spacing: 2px;
  border-bottom: 2px solid #004f9a;
  padding-bottom: 10px;
`;

// Estilos para la lista de productos
const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px;
  justify-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Estilos para cada tarjeta de producto
const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: auto;
    max-height: 150px;
    object-fit: contain;
    margin-bottom: 5px;
  }

  .product-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    margin-top: 5px;
  }

  h3 {
    font-size: 16px;
    margin-bottom: 5px;
    color: #333;
  }

  p {
    margin: 5px 0;
    font-size: 14px;
    color: #999;
  }

  .price {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
    color: #27ae60;
  }

  .add-to-cart {
    align-self: center;
    margin-top: auto;
    background-color: #004f9a;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #003366;
    }
  }
`;

  const DiscountTag = styled.span`
  background-color: #f00;
  color: #fff;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
  margin-left: 10px;
  }

  .price {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
    color: #27ae60;
  }

  .add-to-cart {
    background-color: #004f9a;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
    margin-top: auto;

    &:hover {
      background-color: #003366;
    }
  }
`;

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = await Promise.all(
          productsSnapshot.docs.map(async (doc) => {
            const productData = doc.data();
            if (productData.category === categoryName) {
              try {
                const imageUrl = await getDownloadURL(ref(storage, productData.image));
                return { id: doc.id, ...productData, image: imageUrl };
              } catch (error) {
                console.error('Error al obtener la imagen desde Firebase Storage:', error);
                return { id: doc.id, ...productData };
              }
            }
            return null;
          })
        );
        setFilteredProducts(productsList.filter(Boolean));
      } catch (error) {
        console.error('Error al obtener los productos desde Firestore:', error);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Obtener la traducción de la categoría si existe, de lo contrario usar el nombre original
  const categoryTitle = categoryTranslations[categoryName] || categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div>
      <Title>Productos en {categoryTitle}</Title>
      <ProductList>
        {filteredProducts.map(product => (
          <ProductCard key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              {product.discount ? (
                <>
                  <div>
                  <span className='old-price' style={{ textDecoration: 'line-through' }}>${product.priceBeforeDiscount ? product.priceBeforeDiscount.toFixed(2) : product.price.toFixed(2)}</span>
                  <DiscountTag>{product.discountPercentage ? product.discountPercentage : 0}% menos</DiscountTag>
                </div>
                  <span className="price">${(product.price - (product.price * (product.discountPercentage ? product.discountPercentage : 0) / 100)).toFixed(2)}</span>
                </>
              ) : (
                <p className="price" style={{ textDecoration: product.discount ? 'line-through' : 'none' }}>${product.price.toFixed(2)}</p>
              )}
              <button className="add-to-cart" onClick={() => addToCart(product)}>+ Agregar</button>
            </div>
          </ProductCard>
        ))}
      </ProductList>
    </div>
  );
};

export default CategoryPage;
