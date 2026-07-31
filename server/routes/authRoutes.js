



// // // routes/authRoutes.js
// // import express from 'express';
// // import bcrypt from 'bcrypt'; // ✅ Used to securely hash passwords
// // import User from '../models/Users.js'; // ✅ Import the Mongoose User model
// // import upload from '../middleware/upload.js'; // ✅ Handles profile image upload (using multer)

// // const router = express.Router(); // ✅ Create an Express router instance

// // // ========================= REGISTER ROUTE ========================= //
// // router.post('/register', upload.single('profileImage'), async (req, res) => {
// //   // ✅ Extract user details from request body
// //   const { username, phone, email, password, confirmPassword } = req.body;

// //   // ❗ Check if any required field is missing
// //   if (!username || !phone || !email || !password || !confirmPassword) {
// //     return res.status(400).json({ message: "All fields are required" });
// //   }

// //   // ❗ Check if passwords match
// //   if (password !== confirmPassword) {
// //     return res.status(400).json({ message: "Passwords do not match" });
// //   }

// //   try {
// //     // 🔍 Check if user with the same email already exists
// //     const existing = await User.findOne({ email });
// //     if (existing) {
// //       return res.status(400).json({ message: "Email already registered" });
// //     }

// //     // 🔐 Hash the password for security
// //     const saltRounds = 10;
// //     const hashedPassword = await bcrypt.hash(password, saltRounds);

// //     // 📷 Handle uploaded profile image (if any)
// //     const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

// //     // 🆕 Create a new user instance
// //     const newUser = new User({
// //       name: username, // Save the full name
// //       phone,
// //       email,
// //       password: hashedPassword, // Save hashed password
// //       profileImage, // Save image path (if uploaded)
// //     });

// //     // 💾 Save the user to MongoDB
// //     await newUser.save();

// //     // ✅ Send success response
// //     res.status(201).json({ message: "Registered successfully", userId: newUser._id });

// //   } catch (err) {
// //     // ❌ Handle any server/database error
// //     res.status(500).json({ message: "Registration failed", error: err.message });
// //   }
// // });


// // // ========================= LOGIN ROUTE ========================= //
// // router.post('/login', async (req, res) => {
// //   // ✅ Extract email and password from request
// //   const { email, password } = req.body;
// //   console.log("Login Attempt:", email); // 👀 Log login attempt

// //   try {
// //     // 🔍 Find user by email
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       console.log("User not found");
// //       return res.status(400).json({ message: "User not found" });
// //     }

// //     // 🔐 Compare password with hashed one in DB
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     console.log("Password Match:", isMatch); // 👀 Log password check

// //     if (!isMatch) {
// //       console.log("Invalid password");
// //       return res.status(401).json({ message: "Invalid password" });
// //     }

// //     // ✅ Login successful — send user data
// //     res.status(200).json({
// //       message: "Login successful",
// //       userId: user._id,
// //       name: user.name,
// //       profileImage: user.profileImage || '', // send image URL if available
// //     });

// //   } catch (err) {
// //     console.log("Login Error:", err); // 👀 Log errors if any
// //     res.status(500).json({ message: "Login failed", error: err.message });
// //   }
// // });


// // // ================== GET USER BY ID ================== //
// // router.get('/user/:id', async (req, res) => {
// //   try {
// //     const user = await User.findById(req.params.id).select('name email phone');
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }
// //     res.status(200).json(user); // ✅ This will include phone number
// //   } catch (err) {
// //     res.status(500).json({ message: "Failed to fetch user", error: err.message });
// //   }
// // });

// // // ✅ Export this router to use in server.js
// // export default router;




// // routes/authRoutes.js
// import express from 'express';
// import bcrypt from 'bcrypt'; // ✅ Used to securely hash passwords
// import User from '../models/Users.js'; // ✅ Import the Mongoose User model
// import upload from '../middleware/upload.js'; // ✅ Handles profile image upload (using multer)

// const router = express.Router(); // ✅ Create an Express router instance

// // ========================= REGISTER ROUTE ========================= //
// router.post('/register', upload.single('profileImage'), async (req, res) => {
//   // ✅ Extract user details from request body
//   const { username, phone, email, password, confirmPassword, lat, lon } = req.body;

//   // ❗ Check if any required field is missing
//   if (!username || !phone || !email || !password || !confirmPassword || !lat || !lon) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // ❗ Check if passwords match
//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: "Passwords do not match" });
//   }

//   try {
//     // 🔍 Check if user with the same email already exists
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // 🔐 Hash the password for security
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // 📷 Handle uploaded profile image (if any)
//     // req.file.path is now the permanent Cloudinary URL (see middleware/upload.js),
//     // not a local filename — store it as-is.
//     const profileImage = req.file ? req.file.path : '';

//     // 🆕 Create a new user instance
//     const newUser = new User({
//       name: username, // Save the full name
//       phone,
//       email,
//       password: hashedPassword, // Save hashed password
//       profileImage, // Save image path (if uploaded)
//       lat: parseFloat(lat), // Save latitude as number
//       lon: parseFloat(lon), // Save longitude as number
//     });

//     // 💾 Save the user to MongoDB
//     await newUser.save();

//     // ✅ Send success response
//     res.status(201).json({ message: "Registered successfully", userId: newUser._id });
//   } catch (err) {
//     // ❌ Handle any server/database error
//     res.status(500).json({ message: "Registration failed", error: err.message });
//   }
// });

// // ========================= LOGIN ROUTE ========================= //
// router.post('/login', async (req, res) => {
//   // ✅ Extract email and password from request
//   const { email, password } = req.body;
//   console.log("Login Attempt:", email); // 👀 Log login attempt

//   try {
//     // 🔍 Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found");
//       return res.status(400).json({ message: "User not found" });
//     }

//     // 🔐 Compare password with hashed one in DB
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("Password Match:", isMatch); // 👀 Log password check

//     if (!isMatch) {
//       console.log("Invalid password");
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     // ✅ Login successful — send user data and store lat/lon
//     res.status(200).json({
//       message: "Login successful",
//       userId: user._id,
//       name: user.name,
//       profileImage: user.profileImage || '',
//       lat: user.lat, // Send lat to frontend
//       lon: user.lon, // Send lon to frontend
//     });
//   } catch (err) {
//     console.log("Login Error:", err); // 👀 Log errors if any
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// });

// // ================== GET USER BY ID ================== //
// router.get('/user/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('name email phone');
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user); // ✅ This will include phone number
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch user", error: err.message });
//   }
// });

// // ✅ Export this router to use in server.js
// export default router;



// routes/authRoutes.js
// import express from 'express';
// import bcrypt from 'bcrypt'; // ✅ Used to securely hash passwords
// import User from '../models/Users.js'; // ✅ Import the Mongoose User model
// import upload from '../middleware/upload.js'; // ✅ Handles profile image upload (using multer)

// const router = express.Router(); // ✅ Create an Express router instance

// // ========================= REGISTER ROUTE ========================= //
// router.post('/register', upload.single('profileImage'), async (req, res) => {
//   // ✅ Extract user details from request body
//   const { username, phone, email, password, confirmPassword, lat, lon } = req.body;

//   // ❗ Check if any required field is missing
//   if (!username || !phone || !email || !password || !confirmPassword || !lat || !lon) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // ❗ Check if passwords match
//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: "Passwords do not match" });
//   }

//   try {
//     // 🔍 Check if user with the same email already exists
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // 🔐 Hash the password for security
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // 📷 Handle uploaded profile image (if any)
//     // req.file.path is now the permanent Cloudinary URL (see middleware/upload.js),
//     // not a local filename — store it as-is.
//     const profileImage = req.file ? req.file.path : '';

//     // 🆕 Create a new user instance
//     const newUser = new User({
//       name: username, // Save the full name
//       phone,
//       email,
//       password: hashedPassword, // Save hashed password
//       profileImage, // Save image path (if uploaded)
//       lat: parseFloat(lat), // Save latitude as number
//       lon: parseFloat(lon), // Save longitude as number
//     });

//     // 💾 Save the user to MongoDB
//     await newUser.save();

//     // ✅ Send success response
//     res.status(201).json({ message: "Registered successfully", userId: newUser._id });
//   } catch (err) {
//     // ❌ Handle any server/database error
//     console.error("🔥 Registration failed:", err && err.message ? err.message : err);
//     if (err && err.stack) console.error(err.stack);
//     res.status(500).json({ message: "Registration failed", error: err.message });
//   }
// });

// // ========================= LOGIN ROUTE ========================= //
// router.post('/login', async (req, res) => {
//   // ✅ Extract email and password from request
//   const { email, password } = req.body;
//   console.log("Login Attempt:", email); // 👀 Log login attempt

//   try {
//     // 🔍 Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found");
//       return res.status(400).json({ message: "User not found" });
//     }

//     // 🔐 Compare password with hashed one in DB
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("Password Match:", isMatch); // 👀 Log password check

//     if (!isMatch) {
//       console.log("Invalid password");
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     // ✅ Login successful — send user data and store lat/lon
//     res.status(200).json({
//       message: "Login successful",
//       userId: user._id,
//       name: user.name,
//       profileImage: user.profileImage || '',
//       lat: user.lat, // Send lat to frontend
//       lon: user.lon, // Send lon to frontend
//     });
//   } catch (err) {
//     console.log("Login Error:", err); // 👀 Log errors if any
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// });

// // ================== GET USER BY ID ================== //
// router.get('/user/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('name email phone');
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user); // ✅ This will include phone number
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch user", error: err.message });
//   }
// });

// // ✅ Export this router to use in server.js
// export default router;




import express from 'express';
import bcrypt from 'bcrypt'; // ✅ Used to securely hash passwords
import User from '../models/Users.js'; // ✅ Import the Mongoose User model
import upload from '../middleware/upload.js'; // ✅ Handles profile image upload (using multer)
import multer from "multer";
const router = express.Router(); // ✅ Create an Express router instance

// ========================= REGISTER ROUTE ========================= //
router.post("/register", (req, res, next) => {
  upload.single("profileImage")(req, res, (err) => {
    if (err) {
      console.error("========== MULTER/CLOUDINARY ERROR ==========");
      console.error(err);

      if (err instanceof multer.MulterError) {
        return res.status(500).json({
          message: "Multer Error",
          error: err.message,
        });
      }

      return res.status(500).json({
        message: "Upload Error",
        error: err.message || err,
      });
    }

    next();
  });
}, async (req, res) => {

  const { username, phone, email, password, confirmPassword, lat, lon } = req.body;

  if (!username || !phone || !email || !password || !confirmPassword || !lat || !lon) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImage = req.file ? req.file.path : "";

    const newUser = new User({
      name: username,
      phone,
      email,
      password: hashedPassword,
      profileImage,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });

    await newUser.save();

    return res.status(201).json({
      message: "Registered successfully",
      userId: newUser._id,
    });

  } catch (err) {
    console.error("========== REGISTER ERROR ==========");
    console.error(err);

    return res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
});

// ========================= LOGIN ROUTE ========================= //
router.post('/login', async (req, res) => {
  // ✅ Extract email and password from request
  const { email, password } = req.body;
  console.log("Login Attempt:", email); // 👀 Log login attempt

  try {
    // 🔍 Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 Compare password with hashed one in DB
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); // 👀 Log password check

    if (!isMatch) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Login successful — send user data and store lat/lon
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      name: user.name,
      profileImage: user.profileImage || '',
      lat: user.lat, // Send lat to frontend
      lon: user.lon, // Send lon to frontend
    });
  } catch (err) {
    console.log("Login Error:", err); // 👀 Log errors if any
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// ================== GET USER BY ID ================== //
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email phone');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // ✅ This will include phone number
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

// ✅ Export this router to use in server.js
export default router;