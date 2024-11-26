import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

const AdminPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    discount: 'false',
    discountPercentage: '',
  });
  const [editFormData, setEditFormData] = useState({
    // Campos para productos
    name: '',
    price: '',
    category: '',
    stock: '',
    discount: '',
    discountPercentage: '',
    // Campos para usuarios
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    accountType: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (selectedOption) {
        try {
          const collectionRef = collection(db, selectedOption);
          let q = query(collectionRef);

          if (searchTerm) {
            if (selectedOption === 'products') {
              q = query(
                collectionRef,
                where('name', '>=', searchTerm),
                where('name', '<=', searchTerm + '\uf8ff')
              );
            } else if (selectedOption === 'users') {
              q = query(
                collectionRef,
                where('firstName', '>=', searchTerm),
                where('firstName', '<=', searchTerm + '\uf8ff')
              );
            }
          }

          const querySnapshot = await getDocs(q);
          const data = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const docData = doc.data();
              if (docData.image) {
                const imageUrl = await getDownloadURL(ref(storage, docData.image));
                return { id: doc.id, ...docData, imageUrl };
              }
              return { id: doc.id, ...docData };
            })
          );
          setItems(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [selectedOption, searchTerm]);

  const handleNavigation = (option) => {
    setSelectedOption(option);
    setSearchTerm('');
    setItems([]);
    setEditingItem(null);
    setShowAddProductForm(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    if (selectedOption === 'products') {
      setEditFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        stock: item.stock,
        discount: item.discount,
        discountPercentage: item.discountPercentage,
        // Limpiar campos de usuario
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        accountType: '',
      });
    } else if (selectedOption === 'users') {
      setEditFormData({
        // Limpiar campos de producto
        name: '',
        price: '',
        category: '',
        stock: '',
        discount: '',
        discountPercentage: '',
        // Establecer campos de usuario
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        username: item.username || '',
        email: item.email || '',
        accountType: item.accountType || '',
      });
    }
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const itemRef = doc(db, selectedOption, editingItem.id);
      if (selectedOption === 'products') {
        await updateDoc(itemRef, {
          name: editFormData.name,
          price: parseFloat(editFormData.price),
          category: editFormData.category,
          stock: parseInt(editFormData.stock, 10),
          discount: editFormData.discount === 'true',
          discountPercentage: parseFloat(editFormData.discountPercentage),
        });
      } else if (selectedOption === 'users') {
        await updateDoc(itemRef, {
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          username: editFormData.username,
          email: editFormData.email,
          accountType: editFormData.accountType,
        });
      }
      alert('Actualizado correctamente');
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === editingItem.id ? { ...prevItem, ...editFormData } : prevItem
        )
      );
      setEditingItem(null);
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Hubo un error al actualizar');
    }
  };

  const handleDeleteClick = async (item) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar "${item.name || item.email}"?`
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, selectedOption, item.id));
        alert('Eliminado correctamente');
        setItems((prevItems) => prevItems.filter((prevItem) => prevItem.id !== item.id));
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Hubo un error al eliminar');
      }
    }
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, 'products'), {
        ...newProductData,
        price: parseFloat(newProductData.price),
        stock: parseInt(newProductData.stock, 10),
        discount: newProductData.discount === 'true',
        discountPercentage: parseFloat(newProductData.discountPercentage),
      });
      alert('Producto agregado correctamente');
      setShowAddProductForm(false);
      setNewProductData({
        name: '',
        price: '',
        category: '',
        stock: '',
        discount: 'false',
        discountPercentage: '',
      });
      setItems([]); // Refrescar la lista de productos
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Hubo un error al agregar el producto');
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({
      // Restablecer los campos de edición al estado inicial
      name: '',
      price: '',
      category: '',
      stock: '',
      discount: '',
      discountPercentage: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      accountType: '',
    });
  };

  return (
    <AdminContainer>
      <h1>Herramientas de Administración</h1>
      <ButtonContainer>
        <StyledButton onClick={() => handleNavigation('products')}>
          Gestionar Productos
        </StyledButton>
        <StyledButton onClick={() => handleNavigation('users')}>
          Gestionar Usuarios
        </StyledButton>
      </ButtonContainer>
      {selectedOption && (
        <CrudInfoContainer>
          {selectedOption === 'products' && (
            <>
              <AddProductButton onClick={() => setShowAddProductForm(true)}>
                Agregar Producto
              </AddProductButton>
              {showAddProductForm && (
                <AddProductForm>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      name="name"
                      value={newProductData.name}
                      onChange={handleNewProductChange}
                    />
                  </label>
                  <label>
                    Precio:
                    <input
                      type="number"
                      name="price"
                      value={newProductData.price}
                      onChange={handleNewProductChange}
                    />
                  </label>
                  <label>
                    Categoría:
                    <input
                      type="text"
                      name="category"
                      value={newProductData.category}
                      onChange={handleNewProductChange}
                    />
                  </label>
                  <label>
                    Stock:
                    <input
                      type="number"
                      name="stock"
                      value={newProductData.stock}
                      onChange={handleNewProductChange}
                    />
                  </label>
                  <label>
                    Descuento:
                    <select
                      name="discount"
                      value={newProductData.discount}
                      onChange={handleNewProductChange}
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </label>
                  <label>
                    Porcentaje de Descuento:
                    <input
                      type="number"
                      name="discountPercentage"
                      value={newProductData.discountPercentage}
                      onChange={handleNewProductChange}
                    />
                  </label>
                  <FormButtonGroup>
                    <SaveButton onClick={handleAddProduct}>Agregar Producto</SaveButton>
                    <CancelButton onClick={() => setShowAddProductForm(false)}>
                      Cancelar
                    </CancelButton>
                  </FormButtonGroup>
                </AddProductForm>
              )}
            </>
          )}
          <SearchBarContainer>
            <SearchInput
              type="text"
              placeholder={`Buscar ${
                selectedOption === 'products' ? 'productos' : 'usuarios'
              }...`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBarContainer>
          <ItemsList>
            {items.map((item) => (
              <Item key={item.id}>
                {/* Mostrar imagen sólo si es un producto y existe una imagen */}
                {selectedOption === 'products' && item.imageUrl && (
                  <ProductImage src={item.imageUrl} alt={item.name} />
                )}
                <ItemDetails>
                  {/* Verificar si se está editando este item */}
                  {editingItem && editingItem.id === item.id ? (
                    <EditFieldsContainer>
                      {selectedOption === 'products' ? (
                        // Formulario de edición para productos
                        <>
                          <label>
                            Nombre:
                            <input
                              type="text"
                              name="name"
                              value={editFormData.name}
                              onChange={handleEditFormChange}
                            />
                          </label>
                          <label>
                            Precio:
                            <input
                              type="number"
                              name="price"
                              value={editFormData.price}
                              onChange={handleEditFormChange}
                            />
                          </label>
                          <label>
                            Categoría:
                            <input
                              type="text"
                              name="category"
                              value={editFormData.category}
                              onChange={handleEditFormChange}
                            />
                          </label>
                          <label>
                            Stock:
                            <input
                              type="number"
                              name="stock"
                              value={editFormData.stock}
                              onChange={handleEditFormChange}
                            />
                          </label>
                          <label>
                            Descuento:
                            <select
                              name="discount"
                              value={editFormData.discount}
                              onChange={handleEditFormChange}
                            >
                              <option value="true">Sí</option>
                              <option value="false">No</option>
                            </select>
                          </label>
                          <label>
                            Porcentaje de Descuento:
                            <input
                              type="number"
                              name="discountPercentage"
                              value={editFormData.discountPercentage}
                              onChange={handleEditFormChange}
                            />
                          </label>
                        </>
                      ) : selectedOption === 'users' ? (
                        // Formulario de edición para usuarios
                        <>
                          <label>
                            Nombre:
                            <input
                              type="text"
                              name="firstName"
                              value={editFormData.firstName}
                              onChange={handleEditFormChange}
                            />
                          </label>
                          <label>
                            Apellido:
                            <input
                              type="text"
                              name="lastName"
                              value={editFormData.lastName}
                              onChange={handleEditFormChange}
                            />
                          </label>
                          <label>
                            Nombre de Usuario:
                            <input
                              type="text"
                              name="username"
                              value={editFormData.username}
                              onChange={handleEditFormChange}
                            />
                          </label>
                          <label>
                            Email:
                            <input
                              type="email"
                              name="email"
                              value={editFormData.email}
                              onChange={handleEditFormChange}
                            />
                          </label>
                          <label>
                            Tipo de Cuenta:
                            <select
                              name="accountType"
                              value={editFormData.accountType}
                              onChange={handleEditFormChange}
                            >
                              <option value="">Selecciona un tipo</option>
                              <option value="admin">Administrador</option>
                              <option value="user">Usuario</option>
                            </select>
                          </label>
                        </>
                      ) : null}
                    </EditFieldsContainer>
                  ) : (
                    // Mostrar detalles del item
                    <div>
                      {selectedOption === 'products' ? (
                        // Detalles del producto
                        <>
                          <strong>Nombre:</strong> {item.name}
                          <br />
                          <strong>Precio:</strong> ${item.price}
                          <br />
                          <strong>Categoría:</strong> {item.category}
                          <br />
                          <strong>Stock:</strong> {item.stock}
                          <br />
                          <strong>Descuento:</strong> {item.discount ? 'Sí' : 'No'}
                          <br />
                          <strong>Porcentaje de Descuento:</strong>{' '}
                          {item.discountPercentage}%
                        </>
                      ) : selectedOption === 'users' ? (
                        // Detalles del usuario
                        <>
                          <strong>Nombre:</strong> {item.firstName}
                          <br />
                          <strong>Apellido:</strong> {item.lastName}
                          <br />
                          <strong>Nombre de Usuario:</strong> {item.username}
                          <br />
                          <strong>Email:</strong> {item.email}
                          <br />
                          <strong>Tipo de Cuenta:</strong> {item.accountType}
                          <br />
                        </>
                      ) : null}
                    </div>
                  )}
                </ItemDetails>
                {/* Botones de acción */}
                {editingItem && editingItem.id === item.id ? (
                  <EditActionsContainer>
                    <SaveButton onClick={handleEditSave}>Guardar Cambios</SaveButton>
                    <CancelEditButton onClick={handleCancelEdit}>Cancelar</CancelEditButton>
                  </EditActionsContainer>
                ) : (
                  <ButtonGroup>
                    <EditButton onClick={() => handleEditClick(item)}>Editar</EditButton>
                    <DeleteButton onClick={() => handleDeleteClick(item)}>
                      Eliminar
                    </DeleteButton>
                  </ButtonGroup>
                )}
              </Item>
            ))}
          </ItemsList>
        </CrudInfoContainer>
      )}
    </AdminContainer>
  );
};

export default AdminPage;

// Estilos
const AdminContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const StyledButton = styled.button`
  background-color: #003366;
  color: white;
  padding: 20px 40px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #002244;
  }
`;

const AddProductButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const AddProductForm = styled.div`
  margin-bottom: 20px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CrudInfoContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 60%;
  margin-left: auto;
  margin-right: auto;
`;

const SearchBarContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 50%;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #003366;
  }
`;

const ItemsList = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Item = styled.div`
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
`;

const ItemDetails = styled.div`
  text-align: center;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
`;

const EditFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditButton = styled.button`
  background-color: #ffa500;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e69500;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const SaveButton = styled.button`
  background-color: #28a745; /* Verde */
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  align-self: center; /* Centrar el botón */

  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled.button`
  background-color: #dc3545; /* Rojo */
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FormButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const CancelEditButton = styled.button`
  background-color: #dc3545; /* Rojo */
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  align-self: center;

  &:hover {
    background-color: #c82333;
  }
`;

const EditActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;