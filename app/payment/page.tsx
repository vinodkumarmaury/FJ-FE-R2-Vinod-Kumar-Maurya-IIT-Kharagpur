"use client";

import { useState } from "react";
import { processPayment } from "../../utils/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const paymentInfo = { cardNumber, expiry, cvc, nameOnCard };
    try {
      await processPayment(paymentInfo);
      toast.success("Payment processed successfully!");
    } catch (error) {
      console.error("Payment error", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <motion.div 
        className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Payment Methods
        </h2>
        <form onSubmit={handlePayment} className="flex flex-col space-y-4">
          <motion.input
            type="text"
            placeholder="Name on Card"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileFocus={{ scale: 1.02 }}
            required
          />
          <motion.input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileFocus={{ scale: 1.02 }}
            required
          />
          <div className="flex space-x-4">
            <motion.input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="bg-gray-700 text-white p-3 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="bg-gray-700 text-white p-3 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileFocus={{ scale: 1.02 }}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Process Payment
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
