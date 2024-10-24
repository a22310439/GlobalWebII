import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { storage, db } from '../firebase'; // Importamos Firestore
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from 'firebase/firestore'; // Firestore para obtener documentos
import { useCart } from '../context/CartContext'; // Importamos el contexto del carrito

// Estilos para el contenedor principal
const MainContainer = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

// Sección del banner con marco
const BannerWrapper = styled.div`
  width: 80%;
  border: 5px solid #333;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Banner = styled.div`
  width: 100%;
  height: 50vh; max-height: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    @media (max-width: 768px) {
      object-fit: contain;
    }
    @media (max-width: 480px) {
      object-fit: cover;
    }
`;

// Estilo de los puntos de navegación
const DotsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  margin: 0 5px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: ${({ $isActive }) => ($isActive ? '#333' : '#ccc')};
  transition: background-color 0.3s ease;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #777;
  }
`;

// Sección de Ofertas
const OffersSection = styled.div`
  width: 80%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.5rem; @media (max-width: 768px) { font-size: 1.2rem; }
  color: #333;
  margin-bottom: 20px;
  text-align: left;
`;

const OfferGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1050px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

// Estilos para las cartas de productos
const OfferCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px; @media (max-width: 768px) { padding: 10px; }
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const ProductImage = styled.img`
  width: 100%; max-width: 100px;
  height: auto;
  object-fit: contain;
  margin-right: 20px;
  margin-left: 20px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h3 {
    font-size: 13px;
    margin: 10px 0 5px;
    color: #333;
  }

  p {
    margin: 5px 0;
    font-size: 14px;
    color: #004f9a;
    font-weight: bold;
  }

  .price {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
    color: #27ae60;
  }
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  margin-right: 10px;
`;

const DiscountTag = styled.span`
  background-color: #f00;
  color: #fff;
  width: 50px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
`;

const CartButton = styled.button`
  background-color: #004f9a;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  align-self: flex-start;

  &:hover {
    background-color: #003366;
  }
`;

const Offers = () => {
  const { addToCart } = useCart(); 
  const [bannerImages, setBannerImages] = useState([]);
  const [products, setProducts] = useState([]); // Cambiamos para obtener productos desde Firestore
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);

  // Función para obtener productos de Firestore y sus imágenes desde Firebase Storage
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products'); // La colección en Firestore
      const productsSnapshot = await getDocs(productsCollection); // Obtener todos los documentos
      const productsList = await Promise.all(
        productsSnapshot.docs.map(async (doc) => {
          const productData = doc.data();
          try {
            // Obtener la URL de la imagen desde Firebase Storage
            const imageUrl = await getDownloadURL(ref(storage, productData.image));
            return { id: doc.id, ...productData, image: imageUrl }; // Guardar la URL de la imagen en el producto
          } catch (error) {
            console.error("Error al obtener la imagen del producto:", productData.image, error);
            return null; // Si falla la imagen, devolvemos null
          }
        })
      );

      // Filtrar productos válidos (sin errores al obtener las imágenes)
      setProducts(productsList.filter(Boolean));
    } catch (error) {
      console.error("Error al obtener los productos de Firestore:", error);
    }
  };

  // Obtener los productos al cargar la página
  useEffect(() => {
    fetchProducts();
  }, []);

  // Cargar las imágenes del banner
  useEffect(() => {
    const imagePaths = [
      { path: 'Banners/cablesBanner.webp', link: '/category/cables' },
      { path: 'Banners/cargadoresBanner.webp', link: '/category/chargers' },
      { path: 'Banners/bocinasBanner.webp', link: '/category/speakers' },
      { path: 'Banners/powerbankBanner.webp', link: '/category/power-banks' },
      { path: 'Banners/audifonosBanner.webp', link: '/category/headphones' },
      { path: 'Banners/estanteBanner.webp', link: '/category/stands' }
    ];

    Promise.all(imagePaths.map(image => 
      getDownloadURL(ref(storage, image.path))
        .then(url => ({ ...image, url }))
        .catch((error) => {
          console.error(`Error al obtener la imagen: ${image.path}`, error);
          setError(error);
          return null;
        })
    ))
    .then(images => {
      const validImages = images.filter(Boolean);
      setBannerImages(validImages);
    })
    .catch((error) => {
      setError(error);
    });
  }, []);

  // Configuración del slider para las imágenes del banner
  useEffect(() => {
    if (bannerImages.length === 0) return;
    const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    };
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [bannerImages]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Filtrar productos que tienen descuento
  const discountedProducts = products.filter(product => product.discount).slice(0, 6);

  // Función para calcular el precio con descuento
  const calculateDiscountPrice = (price, discountPercentage) => {
    return price - (price * (discountPercentage / 100));
  };

  if (error) {
    return <div>Error al cargar las imágenes...</div>;
  }

  return (
    <MainContainer>
      <BannerWrapper>
        {bannerImages.length > 0 ? (
          <>
            <Link to={bannerImages[currentImageIndex].link}>
              <Banner>
                <img src={bannerImages[currentImageIndex].url} alt="Banner" />
              </Banner>
            </Link>
            <DotsContainer>
              {bannerImages.map((_, index) => (
                <Dot 
                  key={index} 
                  $isActive={index === currentImageIndex}  
                  onClick={() => goToImage(index)} 
                />
              ))}
            </DotsContainer>
          </>
        ) : (
          <div>Cargando imágenes...</div>
        )}
      </BannerWrapper>

      <OffersSection>
      <Title>Ofertas</Title>
      <OfferGrid>
        {discountedProducts.map((product) => {
          const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);

          return (
            <OfferCard key={product.id}>
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductDetails>
                  <h3>{product.name}</h3>
                  <p>
                    <OldPrice>${product.price.toFixed(2)}</OldPrice>
                    <div>
                    <DiscountTag>{product.discountPercentage}% menos</DiscountTag>
                    </div>
                  </p>
                  <span className="price">${discountedPrice.toFixed(2)}</span>
                </ProductDetails>
                <CartButton onClick={() => addToCart({
                  ...product,
                  priceBeforeDiscount: product.price,
                  price: discountedPrice, // Agregar el precio con descuento al carrito
                })}>
                  Añadir al carrito
                </CartButton>
              </ProductInfo>
            </OfferCard>
          );
        })}
      </OfferGrid>
    </OffersSection>
    </MainContainer>
  );
};

export default Offers;
