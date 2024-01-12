"use client";

import React from "react";

function Header() {
  return (
    <header className="bg-blue-800 text-white p-5">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">HyrOnline</h1>
        <nav>
          <a
            href="/login"
            className="text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Logga in
          </a>
          <a
            href="/register"
            className="text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Registrera dig
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
