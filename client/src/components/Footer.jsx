import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Velocity Report Dashboard by inekeonubifelix@gmail.com, All rights reserved.</p>
      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Enterprise Inventory & Velocity Management System</p>
    </footer>
  );
};

const footerStyle = {
  textAlign: 'center',
  padding: '20px',
  backgroundColor: '#1e293b',
  color: '#cbd5e1',
  marginTop: '50px',
  borderTop: '1px solid #334155',
  fontSize: '14px'
};

export default Footer;