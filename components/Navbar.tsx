"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { motion } from "framer-motion";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, [setDarkMode]);

  const toggleDarkMode = useCallback((mode: boolean) => {
    setDarkMode(mode);
    localStorage.setItem("darkMode", mode.toString());
    document.documentElement.classList.toggle("dark", mode);
  }, [setDarkMode]);

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 bg-gray-900 shadow-md backdrop-blur-lg transition-all duration-500"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left Side - Logo & Links */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <motion.span
              className="text-2xl font-extrabold text-yellow-400 tracking-wide cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              Ride Sharing
            </motion.span>
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
              <Link key={link.path} href={link.path}>
                <motion.span
                  className="text-gray-300 hover:text-yellow-400 transition duration-300 ease-in-out transform hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side - Auth & Dark Mode */}
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <motion.span
              className="px-4 py-2 rounded-lg text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              Login
            </motion.span>
          </Link>
          <Link href="/auth/register">
            <motion.span
              className="px-4 py-2 rounded-lg text-sm font-medium text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              Register
            </motion.span>
          </Link>
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
    </motion.nav>
  );
}
