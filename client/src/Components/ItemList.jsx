import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./ItemList.css";
import ImageModal from "./ImageModal";
import { API_BASE_URL, getImageUrl } from "../config";

const ItemList = ({ items, setItems, selectedCategory, selectedDistance }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState({});
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const initialShowMoreInfo = items.reduce((acc, item) => {
      acc[item._id] = false;
      return acc;
    }, {});
    setShowMoreInfo(initialShowMoreInfo);

    // Set current user ID and coordinates (captured via geolocation/map at login) from localStorage
    const userId = localStorage.getItem("userId");
    if (userId) setCurrentUserId(userId);
    const storedLat = localStorage.getItem("userLat");
    const storedLon = localStorage.getItem("userLon");
    if (storedLat && storedLon) {
      setUserLat(parseFloat(storedLat));
      setUserLon(parseFloat(storedLon));
    }
  }, [items]);

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredItems = items.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" ||
      (selectedCategory === "General"
        ? item.category.toLowerCase() !== "food" &&
          item.category.toLowerCase() !== "clothes"
        : item.category.toLowerCase() === selectedCategory.toLowerCase());

    let distanceMatch = true;
    if (
      selectedDistance &&
      selectedDistance !== "none" &&
      userLat != null &&
      userLon != null &&
      item.latitude != null &&
      item.longitude != null
    ) {
      const distance = getDistanceInKm(userLat, userLon, item.latitude, item.longitude);
      distanceMatch = distance <= parseFloat(selectedDistance);
    }

    return categoryMatch && distanceMatch;
  });

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
        const updatedRes = await fetch(`${API_BASE_URL}/api/items`, {
          credentials: "include",
        });
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setItems(updatedData);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your item has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Failed to delete item.", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Something went wrong while deleting.", "error");
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl || `${API_BASE_URL}/placeholder.jpg`);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const toggleMoreInfo = (itemId) => {
    setShowMoreInfo((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div className="items-grid">
      {filteredItems.length === 0 ? (
        <div className="no-items">No items match your filters.</div>
      ) : (
        filteredItems.map((item) => (
          <div key={item._id} className="item-card">
            {/* User info at the top */}
            <div className="item-user-info">
              <img
                src={
                  item.userId && item.userId.profileImage
                    ? getImageUrl(item.userId.profileImage)
                    : `${API_BASE_URL}/placeholder.jpg`
                }
                alt={`${item.userId?.name || "User"}'s profile`}
                className="user-profile-image"
              />
              <span className="user-name">{item.userId?.name || "Unknown"}</span>
            </div>

            <div
              className="item-image-container"
              onClick={() => handleImageClick(getImageUrl(item.image))}
            >
              <img
                src={getImageUrl(item.image) || `${API_BASE_URL}/placeholder.jpg`}
                alt={item.itemName}
                className="item-image"
              />
            </div>
            <div className="item-content">
              <h3 className="item-name">{item.itemName}</h3>
              <p className="item-description"><strong>Category:</strong> {item.category}</p>
              <p className="item-description"><strong>Description:</strong> {item.description}</p>
              <p className="item-description"><strong>Status:</strong> {item.status}</p>
              {item.userId && String(item.userId._id) === String(currentUserId) && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item._id)}
                  title="Delete item"
                >
                  ❌
                </button>
              )}
              <button
                onClick={() => toggleMoreInfo(item._id)}
                className="more-info-btn"
              >
                {showMoreInfo[item._id] ? "Hide Info" : "More Info"}
              </button>
              <details className="item-details" open={showMoreInfo[item._id]}>
                <summary>More Info</summary>
                <p><strong>Contact:</strong> {item.contact || "N/A"}</p>
                <p><strong>Landmark:</strong> {item.landmark || "N/A"}</p>
                {userLat != null && userLon != null && item.latitude != null && item.longitude != null && (
                  <p>
                    <strong>Distance:</strong>{" "}
                    {getDistanceInKm(userLat, userLon, item.latitude, item.longitude).toFixed(2)} km
                  </p>
                )}
              </details>
            </div>
          </div>
        ))
      )}
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ItemList;
