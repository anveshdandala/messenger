import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Corrected the import for Link
import { AlertCircle } from "lucide-react"; // For displaying an error icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Login successful!", JSON.stringify(data)); // this has (token, user)
      localStorage.setItem("user-own-profile", data.token); //keyName, keyValue
      navigate("/messenger");
    } catch (err) {
      // The catch block now receives the REAL error message
      console.error("Login failed:", err.message);
      setError(err.message); // Set the error message to be displayed on the UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-white">Login</h2>
      <form onSubmit={submit} className="space-y-6">
        {/* Display API errors here */}
        {error && (
          <div className="p-3 text-center text-red-400 bg-red-900/30 rounded-md flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isLoading} // Disable button while loading
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-blue-400 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
