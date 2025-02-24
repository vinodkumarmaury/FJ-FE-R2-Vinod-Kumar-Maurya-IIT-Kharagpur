"use client";

import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
        <main className="pt-16">
          {children}
        </main>
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
