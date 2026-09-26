import React from 'react';

const Navbar = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        🤖 <strong>Flexzy Smart(AI) Velocity Analytics</strong>
      </div>
      <div style={linksStyle}>
        <span onClick={() => scrollToSection('dashboard')} style={linkStyle}>Dashboard</span>
        <span onClick={() => scrollToSection('reports')} style={linkStyle}>Reports</span>
        <span onClick={() => scrollToSection('settings')} style={linkStyle}>Settings</span>
      </div>
    </nav>
  );
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  backgroundColor: '#0f172a',
  color: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
};

const logoStyle = {
  fontSize: '18px',
  letterSpacing: '0.5px',
  cursor: 'pointer'
};

const linksStyle = {
  display: 'flex',
  gap: '25px'
};

const linkStyle = {
  cursor: 'pointer',
  fontSize: '14px',
  color: '#cbd5e1',
  fontWeight: '500',
  transition: 'color 0.2s'
};

export default Navbar;