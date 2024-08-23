import React from 'react';
import styled from 'styled-components';

const Footer = () => (
  <FooterContainer>
    <p>© 2024 Tech Space. All rights reserved.</p>
  </FooterContainer>
);

export default Footer;

const FooterContainer = styled.footer`
  background-color: #004f9a;
  padding: 20px;
  color: white;
  text-align: center;
`;
