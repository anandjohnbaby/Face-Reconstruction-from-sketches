import React from 'react';
import './Footer.css';
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto text-center">
        <p className="names">
          © {new Date().getFullYear()} | Developed by Aiswarya Biju , Anand John Baby, Harijith M.M, Niveditha Manoj 
        </p>
      </div>
    </footer>
  );
};

export default Footer;