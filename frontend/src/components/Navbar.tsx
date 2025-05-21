import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-address-card"></i>
          Vibe Coding 測試名片系統
        </Link>
        <ul className="navbar-nav">
          <li><Link to="/" className="nav-link">首頁</Link></li>
          <li>
            <button 
              className="theme-toggle-btn" 
              onClick={toggleDarkMode}
              aria-label={darkMode ? '切換至亮色模式' : '切換至深色模式'}
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 