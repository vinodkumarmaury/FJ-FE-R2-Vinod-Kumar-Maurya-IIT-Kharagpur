"use client";

import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Check local storage for dark mode preference
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);
    if (mode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white">
        <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}
