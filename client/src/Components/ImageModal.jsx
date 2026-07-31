import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "./ImageModal.css";

const ImageModal = ({ imageUrl, onClose }) => {
  const { theme } = useContext(ThemeContext);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <img src={imageUrl} alt="Full Item" className="modal-image" />
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default ImageModal;