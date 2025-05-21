import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-address-card"></i>
          台灣用戶名片系統
        </Link>
        <ul className="navbar-nav">
          <li><Link to="/" className="nav-link">首頁</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 