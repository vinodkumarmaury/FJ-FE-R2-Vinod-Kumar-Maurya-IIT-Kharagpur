"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLoyaltyStore } from '@/store/loyaltyStore';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const navLinks = [
    { name: "Book Ride", path: "/booking" },
    { name: "Ride History", path: "/history" },
    { name: "Payments", path: "/payment" },
    { name: "Profile", path: "/profile" },
    { name: "Chat", path: "/chat" },
    { name: "Tracking", path: "/tracking" },
    { name: "Loyalty", path: "/loyalty" },
  ];

  const { points, tier } = useLoyaltyStore();

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-[999] bg-gray-900 shadow-md backdrop-blur-lg bg-opacity-95 transition-all duration-500"
      initial={{ y: 0 }} // Changed from -10 to 0
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }} // Reduced from 0.3 to 0.2
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/">
            <motion.span
              className="text-2xl font-extrabold text-yellow-400 tracking-wide cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              Ride Sharing
            </motion.span>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
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
        <div className="hidden md:flex items-center space-x-4">
          <div className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20">
            <span className="text-sm font-medium text-yellow-400">
              {tier} • {points} pts
            </span>
          </div>
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
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="text-white" size={30} /> : <Menu className="text-white" size={30} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden absolute top-16 left-0 w-full bg-gray-900 shadow-lg flex flex-col items-center py-4 space-y-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} onClick={() => setMenuOpen(false)}>
                <motion.span
                  className="text-gray-300 hover:text-yellow-400 transition duration-300 ease-in-out transform hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
            <div className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-4">
              <span className="text-sm font-medium text-yellow-400">
                {tier} • {points} pts
              </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                <motion.span
                  className="px-4 py-2 rounded-lg text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  Login
                </motion.span>
              </Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                <motion.span
                  className="px-4 py-2 rounded-lg text-sm font-medium text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  Register
                </motion.span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
