



import express from 'express';
import Item from '../models/Item.js';
import upload from '../middleware/upload.js';
import User from '../models/Users.js';

const router = express.Router();

// ✅ POST: Add new item (with location coordinates and optional deleteAfter)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      itemName,
      category,
      description,
      contact,
      latitude,
      longitude,
      landmark, // New field for location context
      userId,
      expiryHours //  New field to determine auto-deletion timing
    } = req.body;

    // Guard against missing required fields - previously `category.toLowerCase()`
    // below would throw an unhandled TypeError (opaque 500) if category was
    // omitted, and lat/lon could silently be saved as NaN.
    if (!itemName || !category || !userId) {
      return res.status(400).json({ message: "itemName, category, and userId are required" });
    }
    if (latitude === undefined || longitude === undefined || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res.status(400).json({ message: "A valid location (latitude/longitude) is required" });
    }

    const newItem = new Item({
      itemName,
      category,
      description,
      contact,
      latitude: parseFloat(latitude), // Ensure numeric
      longitude: parseFloat(longitude), // Ensure numeric
      landmark, // Use landmark instead of location
      // req.file.path is now the permanent Cloudinary URL (see middleware/upload.js).
      image: req.file ? req.file.path : '',
      userId,
    });

    //  If food and expiryHours is provided, calculate deleteAfter timestamp
    if (category.toLowerCase() === 'food' && expiryHours) {
      const hours = parseInt(expiryHours);
      const expiryTime = new Date(Date.now() + hours * 60 * 60 * 1000);
      newItem.deleteAfter = expiryTime;
      newItem.isPerishable = true;
    }
    if (category.toLowerCase() !== 'food' || !expiryHours) {
      newItem.isPerishable = false;
    }

    await newItem.save();
    await newItem.populate('userId', 'name profileImage');

    res.status(201).json({
      message: "Item added successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

//  DELETE: Remove an item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

//  GET: Fetch all active items with user info
router.get('/', async (req, res) => {
  try {
    const now = new Date();

    //  Fetch only active and not expired (for food) items
    const items = await Item.find({
      status: "active",
      $or: [
        { deleteAfter: { $exists: false } }, // items with no expiry
        { deleteAfter: { $gt: now } }        // items not yet expired
      ]
    })
      .populate("userId", "name profileImage phone")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items", error });
  }
});

//  GET: Donor of the Day - the user who posted the most items today
router.get('/top-donor-today', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const topDonor = await Item.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          profileImage: "$user.profileImage",
          count: 1
        }
      }
    ]);

    if (!topDonor.length) return res.json({ message: "No items posted today." });

    res.json(topDonor[0]);
  } catch (err) {
    console.error("Error fetching top donor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
