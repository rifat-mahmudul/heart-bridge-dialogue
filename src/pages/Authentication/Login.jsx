// import { Link } from "react-router-dom";

// export default function Login() {
//     return (
//       <div className="flex min-h-[calc(100vh-66px)] items-center justify-center">
//         <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
//           <h2 className="text-2xl font-bold text-center">Welcome back</h2>
//           <p className="text-center mb-6 mt-3 text-gray-500 font-medium">
//           Enter your email to log in to your account
//           </p>

//           <form className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
//               <input
//                 type="email"
//                 placeholder="name@example.com"
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
//               />
//             </div>
//             <div>
//               <div className="flex items-center justify-between">
//                 <label className="block text-sm font-medium text-gray-700">Password<span className="text-red-500">*</span></label>

//                 <Link to={'/forgot-password'}>
//                     <h1 className="block text-sm cursor-pointer hover:text-pink-500 font-semibold text-gray-500">Forgot password?<span className="text-red-500">*</span></h1>
//                 </Link>
//               </div>
//               <input
//                 type="password"
//                 placeholder="Create a password"
//                 className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-pink-700 text-white py-2 rounded-md hover:bg-pink-700 transition">
//               Sign in
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 mt-4">
//             Do not have an account? <Link to="/signup" className="text-pink-500 hover:underline">Sign Up</Link>
//           </p>
//         </div>
//       </div>
//     );
//   }

import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear errors on input change
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      // Store user data in localStorage
      const user = userCredential.user;
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );

      // Redirect to dashboard or home page
      navigate("/dashboard");
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Try again later";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Check your connection";
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-66px)] items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome back</h2>
        <p className="text-center mb-6 mt-3 text-gray-500 font-medium">
          Enter your email to log in to your account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              placeholder="name@example.com"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Password<span className="text-red-500">*</span>
              </label>
              <Link to={"/forgot-password"}>
                <h1 className="block text-sm cursor-pointer hover:text-pink-500 font-semibold text-gray-500">
                  Forgot password?
                </h1>
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-700 text-white py-2 rounded-md hover:bg-pink-800 transition disabled:bg-pink-400 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Do not have an account?{" "}
          <Link to="/signup" className="text-pink-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
