// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import itemsRoutes from "./routes/items.js";
// import authRoutes from "./routes/authRoutes.js";
// import Item from './models/Item.js'; //  Needed for auto-delete
// import startDeleteExpiredItemsJob from "./cronJobs/deleteExpired.js";


// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// //  Middleware - place BEFORE any routes
// // CLIENT_ORIGIN accepts one or more comma-separated origins so this works
// // whether the frontend is on localhost, a LAN IP, or a deployed domain,
// // instead of only ever accepting http://localhost:5173.
// const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
//   .split(",")
//   .map((origin) => origin.trim());

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (curl, mobile apps, server-to-server)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`Not allowed by CORS: ${origin}`));
//     }
//   },
//   credentials: true
// }));
// app.use(express.json());

// //  Serve uploaded images
// app.use("/uploads", express.static("uploads"));

// //  Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/items", itemsRoutes);

// //  Test Route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// //  MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);
//       // startDeleteExpiredItemsJob();


//       //  Auto-delete expired items every 10 minutes
//       setInterval(async () => {
//         const now = new Date();

//         try {
//           const expiredItems = await Item.find({
//             deleteAfter: { $exists: true, $lte: now }
//           });

//           if (expiredItems.length > 0) {
//             const expiredIds = expiredItems.map(item => item._id);
//             await Item.deleteMany({ _id: { $in: expiredIds } });

//             console.log(`🧹 Deleted ${expiredIds.length} expired item(s)`);
//           }
//         } catch (error) {
//           console.error("Auto-delete failed:", error);
//         }
//       }, 10 * 60 * 1000); // 10 minutes in ms
//     });
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import itemsRoutes from "./routes/items.js";
import authRoutes from "./routes/authRoutes.js";
import Item from './models/Item.js'; //  Needed for auto-delete
import startDeleteExpiredItemsJob from "./cronJobs/deleteExpired.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//  Middleware - place BEFORE any routes
// CLIENT_ORIGIN accepts one or more comma-separated origins so this works
// whether the frontend is on localhost, a LAN IP, or a deployed domain,
// instead of only ever accepting http://localhost:5173.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));
app.use(express.json());

//  Serve uploaded images
app.use("/uploads", express.static("uploads"));

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

//  Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler — must be defined AFTER all routes.
// Without this, an error thrown inside middleware (like the Cloudinary
// upload step) falls through to Express's default handler, which returns
// a raw HTML page and prints an unhelpful "[object Object]" to the logs
// instead of the actual error details. This logs the real error clearly
// and always responds with JSON, which the frontend already expects.
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err && err.message ? err.message : err);
  if (err && err.stack) console.error(err.stack);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err && err.message ? err.message : "Server error",
  });
});

//  MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      // startDeleteExpiredItemsJob();


      //  Auto-delete expired items every 10 minutes
      setInterval(async () => {
        const now = new Date();

        try {
          const expiredItems = await Item.find({
            deleteAfter: { $exists: true, $lte: now }
          });

          if (expiredItems.length > 0) {
            const expiredIds = expiredItems.map(item => item._id);
            await Item.deleteMany({ _id: { $in: expiredIds } });

            console.log(`🧹 Deleted ${expiredIds.length} expired item(s)`);
          }
        } catch (error) {
          console.error("Auto-delete failed:", error);
        }
      }, 10 * 60 * 1000); // 10 minutes in ms
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });