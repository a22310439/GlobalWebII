// SearchBar.js
import React from 'react';
import styled from 'styled-components';

const SearchBar = () => {
  return (
    <SearchInput placeholder="Buscar productos..." />
  );
};

export default SearchBar;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 50px;
  font-size: 16px;

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
`;
