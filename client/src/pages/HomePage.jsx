import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

function HomePage() {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-grey-500 dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-white">Welcome to the App!</h1>
      <nav>
        <div className="flex flex-col space-y-2">
          <Link
            to="/login"
            className="px-4 py-2 font-bold text-white bg-blue-400 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-300 text-center"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 font-bold text-white bg-blue-400 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-300 text-center"
          >
            Signup
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default HomePage;
