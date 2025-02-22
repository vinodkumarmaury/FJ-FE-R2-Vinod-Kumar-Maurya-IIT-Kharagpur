"use client";

import { useEffect } from "react";

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: (mode: boolean) => void;
}

export default function DarkModeToggle({ darkMode, toggleDarkMode }: DarkModeToggleProps) {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={() => toggleDarkMode(!darkMode)}
      className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition duration-300"
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
