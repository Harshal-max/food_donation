// // 📦 Importing React and required hooks
// import React, { useState } from "react";
// import axios from "axios"; // 📡 For making HTTP requests
// import { useNavigate, Link } from "react-router-dom"; // 🚀 For page navigation and links
// import "./Login.css"; // 🎨 Import styling

// const Login = () => {
//   // 🧠 State to manage form inputs and loading state
//   const [email, setEmail] = useState(""); // Email input state
//   const [password, setPassword] = useState(""); // Password input state
//   const [loading, setLoading] = useState(false); // To show "Logging in..." on button

//   const navigate = useNavigate(); // 🚀 Helps us programmatically redirect user to another page

//   // ✅ Function triggered on form submission
//   const handleLogin = async (e) => {
//     e.preventDefault(); // ⛔ Prevents default form reload
//     setLoading(true); // ⏳ Show loading state while request is in progress

//     try {
//       // ✅ Sending login credentials to backend
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       // ✅ Save returned user data in localStorage for future use
//       localStorage.setItem("userId", res.data.userId); // Save user ID
//       localStorage.setItem("userName", res.data.name); // Save user name
//       localStorage.setItem("userImage", res.data.profileImage); // Save profile image URL

//       // ✅ Redirect to homepage after successful login
//       navigate("/");
//     } catch (err) {
//       // ⚠️ If login fails, show proper error message
//       const message =
//         err.response?.data?.message || "Login failed. Please try again.";
//       alert(message);
//     } finally {
//       setLoading(false); // ✅ End loading whether request succeeds or fails
//     }
//   };

//   // ✅ UI of Login Component
//   return (
//     <div className="login-container">
//       {/* 🔝 Navigation Bar */}
//       <nav className="navbar">
//         <h1 className="logo">ZeroWasteMart</h1>
//       </nav>

//       {/* 📝 Login Form */}
//       <form className="login-form" onSubmit={handleLogin}>
//         <h2>Welcome Back</h2>

//         {/* 📧 Email Input */}
//         <input
//           type="email"
//           placeholder="Email Address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)} // Update email state
//           required
//         />

//         {/* 🔒 Password Input */}
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)} // Update password state
//           required
//         />

//         {/* 🚪 Login Button */}
//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"} {/* Button text based on loading */}
//         </button>

//         {/* 🔗 Redirect to Register */}
//         <p className="redirect-msg">
//           First time here?{" "}
//           <Link to="/register" className="link-style">
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login; // ✅ Export so we can use <Login /> in other components



// 📦 Importing React and required hooks
import React, { useState } from "react";
import axios from "axios"; // 📡 For making HTTP requests
import { useNavigate, Link } from "react-router-dom"; // 🚀 For page navigation and links
import { API_BASE_URL } from "../config";
import "./Login.css"; // 🎨 Import styling

const Login = () => {
  // 🧠 State to manage form inputs and loading state
  const [email, setEmail] = useState(""); // Email input state
  const [password, setPassword] = useState(""); // Password input state
  const [loading, setLoading] = useState(false); // To show "Logging in..." on button

  const navigate = useNavigate(); // 🚀 Helps us programmatically redirect user to another page

  // ✅ Function triggered on form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // ⛔ Prevents default form reload
    setLoading(true); // ⏳ Show loading state while request is in progress

    try {
      // ✅ Sending login credentials to backend
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      // ✅ Save returned user data in localStorage for future use
      localStorage.setItem("userId", res.data.userId); // Save user ID
      localStorage.setItem("userName", res.data.name); // Save user name
      localStorage.setItem("userImage", res.data.profileImage); // Save profile image URL
      localStorage.setItem("userLat", res.data.lat); // Save latitude
      localStorage.setItem("userLon", res.data.lon); // Save longitude

      // ✅ Redirect to homepage after successful login
      navigate("/");
    } catch (err) {
      // ⚠️ If login fails, show proper error message
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      alert(message);
    } finally {
      setLoading(false); // ✅ End loading whether request succeeds or fails
    }
  };

  // ✅ UI of Login Component
  return (
    <div className="login-container">
      {/* 🔝 Navigation Bar */}
      <nav className="navbar">
        <h1 className="logo">ZeroWasteMart</h1>
      </nav>

      {/* 📝 Login Form */}
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>

        {/* 📧 Email Input */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />

        {/* 🔒 Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />

        {/* 🚪 Login Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"} {/* Button text based on loading */}
        </button>

        {/* 🔗 Redirect to Register */}
        <p className="redirect-msg">
          First time here?{" "}
          <Link to="/register" className="link-style">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login; // ✅ Export so we can use <Login /> in other components