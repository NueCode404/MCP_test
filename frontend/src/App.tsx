import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UserDetailPage from './pages/UserDetailPage';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserDetailPage />} />
      </Routes>
      <footer className="footer">
        <div className="container">
          <div className="footer-text">
            &copy; {new Date().getFullYear()} 台灣用戶名片系統 | 設計與開發
          </div>
          <div>
            <i className="fas fa-code"></i> 使用React和TypeScript
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App; 