// import mongoose from "mongoose";

// const itemSchema = new mongoose.Schema({
//   itemName: String,
//   category: String,
//   description: String,
//   contact: String,
//   location: String,
//   image: String, // ✅ Add this line
//   status: { type: String, default: "active" },
//   createdAt: { type: Date, default: Date.now },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // ✅ reference to User model
//   },

// });

// export default mongoose.model("Item", itemSchema);

// models/Item.js
import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  description: String,
  contact: String,
  location: String,
  image: String,
  landmark: String, // Add landmark field
  latitude: { type: Number },
  longitude: { type: Number },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPerishable: { type: Boolean, default: false },
  deleteAfter: Date,
});

export default mongoose.model("Item", itemSchema);
