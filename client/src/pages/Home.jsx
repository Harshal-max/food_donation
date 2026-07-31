import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import ItemList from "../Components/ItemList";
import AddItemModal from "../Components/AddItemModal";
import { API_BASE_URL } from "../config";
import "./Home.css"; // New CSS file for page-specific styles

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("none"); // Default to no distance filter

  // Fetch items initially
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/items`, {
        credentials: "include", // Ensure auth cookies are sent
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setItems(data);
      // console.log("Fetched items:", data); // Debug
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  // Run on mount
  useEffect(() => {
    console.log("Home.jsx mounted"); // Debug re-mounts
    fetchItems();
  }, []);

  // Called after adding new item
  const handleItemAdded = (newItem) => {
    setItems((prev) => {
      // Avoid duplicates by checking _id
      const exists = prev.some((item) => item._id === newItem._id);
      if (exists) return prev;
      return [newItem, ...prev];
    });
    // Optionally re-fetch to sync with backend
    fetchItems();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onAddClick={() => setIsModalOpen(true)} />
      <Sidebar
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        selectedDistance={selectedDistance}
        onDistanceChange={setSelectedDistance}
      />
      <main className="flex-grow p-4 home-main">
        <h2 className="text-2xl font-semibold mb-4">Recently Added Items</h2>
        <ItemList
          items={items}
          setItems={setItems}
          selectedCategory={selectedCategory}
          selectedDistance={selectedDistance}
        />
      </main>
      <Footer />
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onItemAdded={handleItemAdded}
      />
    </div>
  );
};

export default Home;
