const products = [
    { id: 1, name: "Cable USB Tipo C a Tipo C 60W 1 metro Negro 1Hora", category: "cables", price: 109.00, image: "/images/cables/cable1.webp", stock: 2, discount: true, discountPercentage: 30 },
    { id: 2, name: "Cable USB Tipo C a Tipo C 100W 1 metro Negro UGREEN", category: "cables", price: 159.00, image: "/images/cables/cable2.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 3, name: "Cable USB Tipo A a Tipo C 1.8 metros Rojo/Negro Perfect Choice", category: "cables", price: 139.00, image: "/images/cables/cable3.webp", stock: 25, discount: true, discountPercentage: 15 },
    { id: 4, name: "Cable USB Tipo A a Tipo C 1 metro Rojo/Amarillo reforzado Billboard", category: "cables", price: 199.00, image: "/images/cables/cable4.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 5, name: "Cable USB Tipo A a Tipo C 1 metro Blanco Ackteck Mobifree", category: "cables", price: 199.00, image: "/images/cables/cable5.webp", stock: 25, discount: true, discountPercentage: 15 },
    { id: 6, name: "Cable USB Tipo C a Tipo C 60W 1 metro Negro Vorago", category: "cables", price: 199.00, image: "/images/cables/cable6.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 7, name: "Cable USB Tipo A a Tipo C 3 metros Negro Manhattan", category: "cables", price: 199.00, image: "/images/cables/cable7.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 8, name: "Cable USB Tipo C a Tipo C 3 metros Negro Belkin", category: "cables", price: 475.22, image: "/images/cables/cable8.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 9, name: "Cargador Motorola USB Tipo C 20W Salida con Cable USB Turbo Negro", category: "chargers", price: 343.00, image: "/images/chargers/cargador1.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 10, name: "Cargador Samsung USB Tipo C 45W Salida con Cable USB Negro", category: "chargers", price: 255.36, image: "/images/chargers/cargador2.webp", stock: 25, discount: true, discountPercentage: 15 },
    { id: 11, name: "Cargador Motorola USB Tipo C 30W Salida con Cable USB Negro", category: "chargers", price: 343.00, image: "/images/chargers/cargador3.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 12, name: "Cargador Huawei USB Tipo A 66W Salida con Cable USB Blanco", category: "chargers", price: 235.95, image: "/images/chargers/cargador4.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 13, name: "Cargador de carro Tipo A/Tipo C 1Hora 38W Salida con Cable USB Plateado", category: "chargers", price: 343.00, image: "/images/chargers/cargador5.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 14, name: "Cargador Lightning para iPhone 25W Salida con Cable Blanco", category: "chargers", price: 109.45, image: "/images/chargers/cargador6.webp", stock: 25, discount: true, discountPercentage: 20 },
    { id: 15, name: "Cargador Inalámbrico Magsafe 15W Star Wars", category: "chargers", price: 349.00, image: "/images/chargers/cargador7.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 16, name: "Cargador Inalámbrico para iPhone/iWatch/AirPods 3en1 Negro", category: "chargers", price: 464.80, image: "/images/chargers/cargador8.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 17, name: "Audífonos Inalámbricos Redmi Buds 4 Active Negro Bluetooth", category: "headphones", price: 299.50, image: "/images/headphones/audifonos1.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 18, name: "Audífonos in-ear Emuael Negro con Luz LED", category: "headphones", price: 457.31, image: "/images/headphones/audifonos2.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 19, name: "Audífonos Realme Buds T300 con Cancelación de Ruido 30db Negro", category: "headphones", price: 464.80, image: "/images/headphones/audifonos3.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 20, name: "Audífonos in-ear Inalámbricos Huawei FreeBuds Blanco", category: "headphones", price: 676.25, image: "/images/headphones/audifonos4.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 21, name: "Audífonos Inalámbricos Bluetooth Shenzhen Yihaotong in-ear F9-5 Negro", category: "headphones", price: 75.60, image: "/images/headphones/audifonos5.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 22, name: "Audífonos in-ear Inalámbricos ADC.mx ZY01 Negro", category: "headphones", price: 118.80, image: "/images/headphones/audifonos6.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 23, name: "Audífonos Inalámbricos JBL Tune 510BT Negro", category: "headphones", price: 579.09, image: "/images/headphones/audifonos7.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 24, name: "Audífonos Inalámbricos Gamer Dytimeem D9002 Plateado", category: "headphones", price: 296.82, image: "/images/headphones/audifonos8.webp", stock: 25, discount: true, discountPercentage: 10 },
    { id: 25, name: "Power Bank 30000mAh 22.5W HYBE YM804", category: "power-banks", price: 435.10, image: "/images/powerBanks/powerBank1.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 26, name: "Power Bank 10000mAh Bateria Portatil 2.1A con Cable Negro", category: "power-banks", price: 179.99, image: "/images/powerBanks/powerBank2.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 27, name: "Power Bank 20000mAh Adata Cargador Portatil Con Pantalla Digital Negro", category: "power-banks", price: 489.00, image: "/images/powerBanks/powerBank3.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 28, name: "Power Bank 20000mAh Bateria Portatil 1Hora Rojo Compatible con Samsung, Xiaomi, iPhone", category: "power-banks", price: 339.32, image: "/images/powerBanks/powerBank4.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 29, name: "Power Bank 20000mAh Saiviek 20W Bateria Externa Carga Rápida Para Android/iPhone Negro", category: "power-banks", price: 438.68, image: "/images/powerBanks/powerBank5.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 30, name: "Mini Power Bank 4500mAh Tipo C Con Cable 1Hora Negro", category: "power-banks", price: 129.00, image: "/images/powerBanks/powerBank6.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 31, name: "Power Bank 10000mAh 18W MagSafe Con Carga Inalámbrica Blanco", category: "power-banks", price: 489.30, image: "/images/powerBanks/powerBank7.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 32, name: "Power Bank 20000mAh Batería Portatil 12W 2 Puertos 1Hora Negro", category: "power-banks", price: 310.00, image: "/images/powerBanks/powerBank8.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 33, name: "Bocina Mifa A90 Portátil Bluetooth Waterproof Negra", category: "speakers", price: 1236.75, image: "/images/speakers/speaker1.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 34, name: "Bocina Portátil JBL Flip 6 Bluetooth A Prueba De Agua Azul", category: "speakers", price: 1570, image: "/images/speakers/speaker2.webp", stock: 25, discount: true, discountPercentage: 25 },
    { id: 35, name: "Bocina Velikka Vk-3804 Con Control Y Microfono Bluetooth Negra", category: "speakers", price: 1089, image: "/images/speakers/speaker3.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 36, name: "Bocina Tronsmart T2 Mini Bluetooth A Prueba De Agua Negra", category: "speakers", price: 350.00, image: "/images/speakers/speaker4.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 37, name: "Bocina Tronsmart T6 Mini Bluetooth A Prueba De Agua Negra", category: "speakers", price: 398.43, image: "/images/speakers/speaker5.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 38, name: "Bocina Mini Portátil 1Hora Inalámbrica Negra", category: "speakers", price: 148.99, image: "/images/speakers/speaker6.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 39, name: "Barra de Sonido Bocina Bluetooth Portátil Negra", category: "speakers", price: 229.00, image: "/images/speakers/speaker7.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 40, name: "Bocina JBL Go 2 Portátil Bluetooth A Prueba De Agua Roja", category: "speakers", price: 619.00, image: "/images/speakers/speaker8.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 41, name: "Soporte Magnético Porta Telefono Mobo Clip De Ventilador Para Auto Negro", category: "stands", price: 158.01, image: "/images/stands/stand1.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 42, name: "Soporte Magnético De Aluminio Para Celular 1Hora Color Negro", category: "stands", price: 67.99, image: "/images/stands/stand2.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 43, name: "Soporte Para Teléfono Para Coche,soporte Porta Celular 3en1", category: "stands", price: 89.57, image: "/images/stands/stand3.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 44, name: "Soporte Para Celular Moto/bicicleta Punkzz X1 Dh060113 Base Porta Teléfono Color Negro", category: "stands", price: 73.54, image: "/images/stands/stand4.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 45, name: "Soporte Base Para Tableta Y Celulares Rotación 360", category: "stands", price: 205.06, image: "/images/stands/stand5.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 46, name: "Tripie Metalico Grande 110 Cms Celular - Cámaras - 3 Niveles", category: "stands", price: 129.90, image: "/images/stands/stand6.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 47, name: "Soporte para teléfono de coche Ugreen P con rotación de 360 grados", category: "stands", price: 189.33, image: "/images/stands/stand7.webp", stock: 25, discount: false, discountPercentage: 0 },
    { id: 48, name: "Base Soporte Porta Celular Para Moto/bicicleta Cargador Usb", category: "stands", price: 117.39, image: "/images/stands/stand8.webp", stock: 25, discount: false, discountPercentage: 0 },
  ];
  
  export default products;
  