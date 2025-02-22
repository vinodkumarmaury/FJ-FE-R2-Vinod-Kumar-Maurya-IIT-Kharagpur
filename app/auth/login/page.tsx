"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/utils/api";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa6";

const LockIcon: React.FC = () => <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful!");
      router.push("/profile");
    } catch (error) {
      console.error("Login error", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          <div className="relative">
            <LockIcon />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}