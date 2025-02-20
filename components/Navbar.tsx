import { useEffect, useState } from "react";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg dark:bg-gray-900/30 shadow-md transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left Side - Logo & Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-extrabold text-blue-600 dark:text-yellow-300 tracking-wide">
            Ride Sharing
          </Link>
          <div className="hidden md:flex space-x-6">
            {[
              { name: "Book Ride", path: "/booking" },
              { name: "Ride History", path: "/history" },
              { name: "Payments", path: "/payment" },
              { name: "Profile", path: "/profile" },
              { name: "Chat", path: "/chat" },
              { name: "Tracking", path: "/tracking" },
              { name: "Loyalty", path: "/loyalty" },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-yellow-300 transition duration-300 ease-in-out transform hover:scale-110"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side - Auth & Dark Mode */}
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-yellow-400 dark:hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-yellow-300 border border-blue-600 dark:border-yellow-300 hover:bg-blue-600 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register
          </Link>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    </nav>
  );
}
