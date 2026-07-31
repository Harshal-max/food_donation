// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Navbar.css';
// import AddItemModal from './AddItemModal';


// const Navbar = () => {
//   // 🔄 Modal state for Add Item
//   const [isModalOpen, setModalOpen] = useState(false);

//   // 👤 User state
//   const [userName, setUserName] = useState('');
//   const [userImage, setUserImage] = useState('');

//   // 🔁 Navigation
//   const navigate = useNavigate();

  

//   // 🧠 Load user data on mount
//   useEffect(() => {
//     setUserName(localStorage.getItem("userName") || "");
//     setUserImage(localStorage.getItem("userImage") || "");
//   }, []);

//   // ➕ Open Add Item modal
//   const handleAddItemClick = () => setModalOpen(true);

//   // 🚪 Logout logic
//   const handleLogout = () => {
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userImage");
//     navigate("/login");
//   };

//   return (
//     <>
//       <nav className="Navbar">
//         {/* 🔗 Logo */}
//         <div className="Navbar-logo">
//           <Link to="/" className="logo-link">
//             <h1>ZeroWasteMart</h1>
//           </Link>
//         </div>

//         {/* 🎯 Right side actions */}
//         <div className="Navbar-actions">
//           {/* 👤 User profile */}
//           {userImage && (
//             <div className="user-info">
//               <img
//                 src={`http://localhost:5000${userImage}`}
//                 alt="Profile"
//                 className="user-img"
//               />
//               <span className="user-name">{userName}</span>
//             </div>
//           )}

//           {/* ➕ Add Item */}
//           <button className="modal-btn-link" onClick={handleAddItemClick}>
//             Add Item
//           </button>

//           {/* 🚪 Logout */}
//           <button className="logout-link" onClick={handleLogout}>
//             Logout
//           </button>

      
//         </div>
//       </nav>

//       {/* 🧩 Add Item Modal */}
//       <AddItemModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
//     </>
//   );
// };

// export default Navbar;

import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import AddItemModal from './AddItemModal';
import { ThemeContext } from '../ThemeContext';
import { API_BASE_URL, getImageUrl } from '../config';

const Navbar = () => {
  // Modal state for Add Item
  const [isModalOpen, setModalOpen] = useState(false);

  // User state
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  // Navigation
  const navigate = useNavigate();

  // Theme context
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Load user data on mount
  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "");
    setUserImage(localStorage.getItem("userImage") || "");
  }, []);

  // Open Add Item modal
  const handleAddItemClick = () => setModalOpen(true);

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
    navigate("/login");
  };

  return (
    <>
      <nav className="Navbar">
        {/* Logo */}
        <div className="Navbar-logo">
          <Link to="/" className="logo-link">
            <h1>ZeroWasteMart</h1>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="Navbar-actions">
          {/* User profile */}
          {userImage && (
            <div className="user-info">
              <img
                src={getImageUrl(userImage)}
                alt="Profile"
                className="user-img"
              />
              <span className="user-name">{userName}</span>
            </div>
          )}

          {/* Add Item */}
          <button className="modal-btn-link" onClick={handleAddItemClick}>
            Add Item
          </button>

          {/* Theme Toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Logout */}
          <button className="logout-link" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Add Item Modal */}
      <AddItemModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;