import React, { useState, useEffect } from "react"; // React hooks for managing state and lifecycle
import Swal from "sweetalert2"; // Library for displaying styled alerts
import LocationPicker from "./LocationPicker"; // map/geolocation based location picker
import { API_BASE_URL } from "../config";
import "./AddItemModal.css"; // Import custom CSS for modal

// Component receives props to control open state, close function, and callback after item is added
const AddItemModal = ({ isOpen, onClose, onItemAdded }) => {
  if (!isOpen) return null; // If modal is not open, render nothing

  // Store user's phone number (fetched from DB)
  const [userPhone, setUserPhone] = useState("");

  // Store form field values for item details
  const [formData, setFormData] = useState({
    category: "",
    itemName: "",
    description: "",
    perishability: "",
  });

  // Store uploaded image file
  const [imageFile, setImageFile] = useState(null);

  // Store selected coordinates (latitude and longitude) - set via LocationPicker
  const [coords, setCoords] = useState({ lat: null, lon: null });

  // Store nearby landmark entered by user
  const [landmark, setLandmark] = useState("");

  // Runs when modal opens: resets location and fetches phone number using userId from localStorage
  useEffect(() => {
    if (isOpen) {
      setCoords({ lat: null, lon: null });

      const userId = localStorage.getItem("userId");
      if (userId) {
        fetch(`${API_BASE_URL}/api/auth/user/${userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.phone) {
              setUserPhone(data.phone); // Set user's phone in state
            }
          })
          .catch((err) => console.error("Failed to fetch user phone", err));
      }
    }
  }, [isOpen]);

  // Handle updates to form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit form data to backend when user clicks submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show warning if no location is selected
    if (coords.lat == null || coords.lon == null) {
      return Swal.fire("Location Required", "Please set a location on the map.", "warning");
    }

    // Create FormData object to send image and item details
    const formPayload = new FormData();
    formPayload.append("userId", localStorage.getItem("userId"));
    formPayload.append("category", formData.category);
    formPayload.append("itemName", formData.itemName);
    formPayload.append("description", formData.description);
    formPayload.append("latitude", coords.lat);
    formPayload.append("longitude", coords.lon);
    formPayload.append("landmark", landmark);
    formPayload.append("contact", userPhone);

    // Append expiry time if food is perishable
    if (formData.category === "food") {
      if (formData.perishability === "perishable-2") {
        formPayload.append("expiryHours", 2);
      } else if (formData.perishability === "perishable-6") {
        formPayload.append("expiryHours", 6);
      }
    }

    // Attach image file if uploaded
    if (imageFile) {
      formPayload.append("image", imageFile);
    }

    try {
      // Send POST request to backend API to add item
      const res = await fetch(`${API_BASE_URL}/api/items`, {
        method: "POST",
        body: formPayload,
      });

      const result = await res.json();

      // Show success popup if item was added
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Item Added!",
          text: "Your item has been posted.",
          timer: 1800,
          showConfirmButton: false,
        });

        // Notify parent component about new item
        if (onItemAdded && result.item) {
          onItemAdded(result.item);
        }

        // Close modal
        onClose();
      } else {
        // Show error if backend responds with failure
        Swal.fire("Error", result.message || "Failed to add item", "error");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // Modal UI content
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Add New Item</h2>

        <form onSubmit={handleSubmit} className="item-form" encType="multipart/form-data">
          {/* Select item category */}
          <label>
            Category:
            <select name="category" required value={formData.category} onChange={handleChange}>
              <option value="">Select</option>
              <option value="food">Food</option>
              <option value="clothes">Clothes</option>
              <option value="general">General</option>
            </select>
          </label>

          {/* Show perishability field only for food */}
          {formData.category === "food" && (
            <label>
              Food Type:
              <select name="perishability" required value={formData.perishability} onChange={handleChange}>
                <option value="">Select</option>
                <option value="perishable-2">Perishable (2 hours)</option>
                <option value="perishable-6">Perishable (6 hours)</option>
                <option value="non-perishable">Non-perishable</option>
              </select>
            </label>
          )}

          {/* Image file input */}
          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleImageChange} required />
          </label>

          {/* Item name */}
          <label>
            Name:
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </label>

          {/* Location input section - map/geolocation based, replaces manual lat/lon typing */}
          <label>
            📍 Location:
            <LocationPicker value={coords} onChange={setCoords} required />
          </label>

          {/* Landmark input */}
          <label>
            Landmark:
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g., Near the park or Main Street"
            />
          </label>

          {/* Item description */}
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          {/* Submit button */}
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal; // Export modal component
