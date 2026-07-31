

// import React from 'react';
// import './Sidebar.css';

// // Sidebar component to handle category and distance filters
// const Sidebar = ({ onCategorySelect, selectedCategory, selectedDistance, onDistanceChange }) => {
//   // List of available categories to filter items
//   const categories = ["All", "Food", "Clothes", "General"];

//   return (
//     <div className="sidebar">
//       <h3>Categories</h3>

//       {/* Buttons for each category */}
//       <div className="category-buttons">
//         {categories.map((category) => (
//           <button
//             key={category}
//             // Apply 'active' class if this category is currently selected
//             className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
//             // Call function to change selected category
//             onClick={() => onCategorySelect(category)}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       {/* Dropdown to filter items by distance */}
//       <div className="distance-filter">
//         <label htmlFor="distance-select">Filter by Distance:</label>
//         <select
//           id="distance-select"
//           value={selectedDistance} // Current selected value
//           onChange={(e) => onDistanceChange(e.target.value)} // Update on selection change
//         >
//           {/* Options for distance range */}
//           <option value="none">No distance filter</option>
//           <option value="2">Within 2 km</option>
//           <option value="4">Within 4 km</option>
//           <option value="6">Within 6 km</option>
//           <option value="10">Within 10 km</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useEffect, useState } from 'react';
// import './Sidebar.css';

// // Sidebar component to handle category and distance filters
// const Sidebar = ({ onCategorySelect, selectedCategory, selectedDistance, onDistanceChange }) => {
//   const categories = ["All", "Food", "Clothes", "General"];
//   const [topDonor, setTopDonor] = useState(null);

//   // Fetch donor of the day from your backend API
//   useEffect(() => {
//     const fetchTopDonor = async () => {
//       try {
//         const res = await fetch("/api/items/top-donor-today"); // Update with your actual endpoint if needed
//         const data = await res.json();
//         if (data && data.name) {
//           setTopDonor(data);
//         }
//       } catch (err) {
//         console.error("Error fetching top donor:", err);
//       }
//     };

//     fetchTopDonor();
//   }, []);

//   return (
//     <div className="sidebar">
//       <h3>Categories</h3>
//       <div className="category-buttons">
//         {categories.map((category) => (
//           <button
//             key={category}
//             className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
//             onClick={() => onCategorySelect(category)}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       <div className="distance-filter">
//         <label htmlFor="distance-select">Filter by Distance:</label>
//         <select
//           id="distance-select"
//           value={selectedDistance}
//           onChange={(e) => onDistanceChange(e.target.value)}
//         >
//           <option value="none">No distance filter</option>
//           <option value="2">Within 2 km</option>
//           <option value="4">Within 4 km</option>
//           <option value="6">Within 6 km</option>
//           <option value="10">Within 10 km</option>
//         </select>
//       </div>

//       {/* Donor of the Day */}
//       {topDonor && (
//         <div className="donor-of-the-day">
//           <h4>🏆 Donor of the Day</h4>
//           <img
//             src={topDonor.profileImage || "https://via.placeholder.com/80"}
//             alt={topDonor.name}
//             style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
//           />
//           <p><strong>{topDonor.name}</strong></p>
//           <p style={{ fontSize: "14px", color: "#888" }}>{topDonor.count} items today</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from 'react';
import { API_BASE_URL, getImageUrl } from '../config';
import './Sidebar.css';

const Sidebar = ({ onCategorySelect, selectedCategory, selectedDistance, onDistanceChange }) => {
  // Available categories to choose from
  const categories = ["All", "Food", "Clothes", "General"];
  
  // State to hold today's top donor data
  const [topDonor, setTopDonor] = useState(null);

  // useEffect to fetch the top donor of the day when the component mounts
  useEffect(() => {
    const fetchTopDonor = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/items/top-donor-today`, {
          method: 'GET',
          credentials: 'include', // include credentials (like cookies) if backend requires auth
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json(); // Parse response data
        // console.log('Top Donor Data:', data); // Log data for debugging

        // If valid donor data received, update state
        if (data && data.name) {
          setTopDonor(data);
        } else {
          console.log('No top donor data received');
        }
      } catch (err) {
        console.error('Error fetching top donor:', err);
      }
    };

    fetchTopDonor(); // Call the fetch function
  }, []);

  return (
    <div className="sidebar">
      <h3>Categories</h3>

      {/* Category Buttons for Filtering */}
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`} // Highlight selected
            onClick={() => onCategorySelect(category)} // Call parent function with selected category
          >
            {category}
          </button>
        ))}
      </div>

      {/* Distance Filter Dropdown */}
      <div className="distance-filter">
        <label htmlFor="distance-select">Filter by Distance:</label>
        <select
          id="distance-select"
          value={selectedDistance} // Selected value from parent state
          onChange={(e) => onDistanceChange(e.target.value)} // Update distance filter in parent
        >
          <option value="none">No distance filter</option>
          <option value="2">Within 2 km</option>
          <option value="4">Within 4 km</option>
          <option value="6">Within 6 km</option>
          <option value="10">Within 10 km</option>
        </select>
      </div>

      {/* Donor of the Day Section */}
      <div className="donor-of-the-day">
        <h4>🏆 Donor of the Day</h4>

        {/* If topDonor is available, show their info */}
        {topDonor ? (
          <div className="donor-info">
            <img
              src={
                topDonor.profileImage
                  ? getImageUrl(topDonor.profileImage) // Load actual image
                  : 'https://via.placeholder.com/80' // Fallback image
              }
              alt={topDonor.name}
              className="donor-image"
            />
            <p className="donor-name">{topDonor.name}</p>
            <p className="donor-count">{topDonor.count} items donated today</p>
          </div>
        ) : (
          // If no donor data, show default message
          <p className="no-donor">No donations yet today.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
