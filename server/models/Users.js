// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//     },
//     phone: {
//       type: String,
//       required: true,
//       match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"],
//     },
//     email: {
//       type: String,
//       unique: true,
//       required: [true, 'Email is required'],
//       match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: [6, 'Password must be at least 6 characters long'],
//     },
//     profileImage: String, // store image path like /uploads/profile.jpg
//   },
//   { timestamps: true } // Automatically adds createdAt and updatedAt fields
// );

// export default mongoose.model('User', userSchema);


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    profileImage: String, // store image path like /uploads/profile.jpg
    lat: { // Add latitude
      type: Number,
      required: true,
    },
    lon: { // Add longitude
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.model('User', userSchema);