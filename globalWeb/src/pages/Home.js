import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { storage } from '../firebase';
import { ref, getDownloadURL } from "firebase/storage";
import products from '../data/products'; // Importamos los productos
import { useCart } from '../context/CartContext'; // Importamos el contexto del carrito

// Estilos para el contenedor principal
const MainContainer = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Banner = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Estilo de los puntos de navegación
const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
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
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
`;

const OfferGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Estilos para las cartas de productos
const OfferCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
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
  width: 70%;
`;

const ProductImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-right: 20px;
  margin-left: 20px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

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

const PriceDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  span {
    margin-right: 10px;
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
  const { addToCart } = useCart(); // Accedemos a la función addToCart del contexto
  const [bannerImages, setBannerImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (bannerImages.length === 0) return;

    const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    };

    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [bannerImages, currentImageIndex]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Filtramos productos de ofertas
  const offers = products.filter(product => product.discount).slice(0, 6);

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

            {/* Puntos de navegación */}
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
          {offers.map((offer) => {
            // Cálculo del precio con descuento (si aplica)
            const discountAmount = offer.discount ? (offer.price * offer.discount) / 100 : 0;
            const discountedPrice = (offer.price - discountAmount).toFixed(2);

            return (
              <OfferCard key={offer.id}>
                <ProductImage src={offer.image} alt={offer.name} />
                <ProductInfo>
                  <ProductDetails>
                    <h3>{offer.name}</h3>

                    {/* Mostrar el precio original y el precio con descuento */}
                    <PriceDetails>
                      {offer.discount && (
                        <>
                          <OldPrice>${offer.price.toFixed(2)}</OldPrice>
                          <DiscountTag>{offer.discount}% menos</DiscountTag>
                        </>
                      )}
                    </PriceDetails>

                    {/* Mostrar el precio con o sin descuento */}
                    <span className="price">${discountedPrice}</span>
                  </ProductDetails>

                  {/* Botón para añadir al carrito */}
                  <Link to="#" onClick={() => addToCart(offer)}>
                    <CartButton>Añadir al carrito</CartButton>
                  </Link>
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