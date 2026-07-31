// ✅ Importing necessary packages and components
import React, { useState } from "react"; // useState for storing form inputs
import axios from "axios"; // for sending data to the backend (HTTP requests)
import { useNavigate } from "react-router-dom"; // to redirect after registration
import LocationPicker from "../Components/LocationPicker"; // map/geolocation based location picker
import { API_BASE_URL } from "../config";
import "./Register.css"; // custom styling for the registration form

// ✅ Main functional component
const Register = () => {
  // 🌟 State variables to store what user types/selects in the form
  const [username, setName] = useState(""); // for full name
  const [phone, setPhone] = useState(""); // for phone number
  const [email, setEmail] = useState(""); // for email
  const [password, setPassword] = useState(""); // for password
  const [confirmPassword, setConfirmPassword] = useState(""); // for confirming password
  const [profileImage, setProfileImage] = useState(null); // for uploading profile picture
  const [location, setLocation] = useState({ lat: null, lon: null }); // set via LocationPicker instead of manual typing

  const navigate = useNavigate(); // 👈 used to redirect user to login page after successful registration

  // ✅ Function that runs when the user submits the form
  const handleRegister = async (e) => {
    e.preventDefault(); // 👈 Prevent page from reloading

    // Location is required, but there's no <input required> to hook into
    // anymore since it's picked on a map - validate manually instead.
    if (location.lat == null || location.lon == null) {
      alert("Please set your location using the map before registering.");
      return;
    }

    // 📦 Creating a FormData object to store all user inputs (including image)
    const formData = new FormData(); // formData is used to send both text and file (image) to backend
    formData.append("username", username);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("lat", location.lat);
    formData.append("lon", location.lon);

    // 📸 Only append image if user has selected one
    if (profileImage) {
      formData.append("profileImage", profileImage); // add image to the form data
    }

    try {
      // 🚀 Send the form data to backend using POST request
      await axios.post(`${API_BASE_URL}/api/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // tell backend you're sending file + text
      });

      // ✅ If registration is successful, redirect user to login page
      navigate("/login");
    } catch (err) {
      // ❌ If something goes wrong, show error message
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // ✅ What will be displayed on the screen (form + navbar)
  return (
    <div className="register-wrapper">
      {/* 🌐 Top navigation bar */}
      <nav className="navbar">
        <h1 className="logo">ZeroWasteMart</h1>
      </nav>

      {/* 🧾 Main form area */}
      <div className="register-container">
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Register</h2>

          {/* 👤 Full Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            value={username}
            required
            onChange={(e) => setName(e.target.value)} // update name as user types
          />

          {/* 📞 Phone Input */}
          <input
            type="tel"
            name="phone"
            placeholder="Contact Number"
            value={phone}
            pattern="[6-9]{1}[0-9]{9}" // for Indian numbers starting with 6-9
            maxLength="10"
            required
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* 📧 Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* 🔒 Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 🔒 Confirm Password Input */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* 📍 Location - replaces the old manual latitude/longitude inputs */}
          <label className="location-label">
            Your location:
            <LocationPicker value={location} onChange={setLocation} required />
          </label>

          {/* 📷 Profile Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])} // store selected file
          />

          {/* 🧾 Submit Button */}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

// ✅ Export the component so it can be used in your app
export default Register;
