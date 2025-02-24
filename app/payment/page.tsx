"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import 'react-toastify/dist/ReactToastify.css';
import { useRideStore } from '@/store/rideStore';
import { useRouter } from 'next/navigation';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51QvQPWC5MEnMdgz5uwIGEYJX8LtsPTzZeV3UWeV6zi8rdzTkDqC5xpYTxJgd3qDRacKEMmaHhbDayxL9472zA7ev00zIflggUx");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentRide, clearCurrentRide } = useRideStore();
  const router = useRouter();
  const [nameOnCard, setNameOnCard] = useState("");
  const [amount, setAmount] = useState(() => {
    // Initialize amount based on currentRide if available
    return currentRide ? Math.round(currentRide.fare * 100) : 1000;
  });
  const [processing, setProcessing] = useState(false);

  // Add useEffect to update amount when currentRide changes
  useEffect(() => {
    if (currentRide) {
      setAmount(Math.round(currentRide.fare * 100));
    }
  }, [currentRide]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Card element not found. Please try again.");
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: nameOnCard,
      },
    });

    if (error) {
      console.error("Payment error", error);
      toast.error("Payment failed. Please try again.");
      return;
    }

    setProcessing(true);

    const response = await fetch("/api/auth/payment/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }), // Use the amount entered by the user
    });

    if (!response.ok) {
      toast.error("Failed to create PaymentIntent");
      setProcessing(false);
      return;
    }

    const data = await response.json();

    if (!data.clientSecret) {
      toast.error("Failed to create PaymentIntent");
      setProcessing(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: paymentMethod.id,
    });

    setProcessing(false);

    if (confirmError) {
      console.error("Payment confirmation error:", confirmError);
      toast.error("Payment confirmation failed. Please try again.");
    } else {
      toast.success("Payment processed successfully!");
      
      // Clear the current ride after successful payment
      clearCurrentRide();
      
      // Redirect to history page after payment
      router.push('/history');
      
      // Clear form data
      setNameOnCard("");
      setAmount(1000);
      elements.getElement(CardElement)?.clear();
    }
  };

  return (
    <form onSubmit={handlePayment} className="flex flex-col space-y-4">
      <motion.input
        type="text"
        placeholder="Name on Card"
        value={nameOnCard}
        onChange={(e) => setNameOnCard(e.target.value)}
        className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
        whileFocus={{ scale: 1.02 }}
        required
      />
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-300">Amount to Pay</label>
        <motion.input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          whileFocus={{ scale: 1.02 }}
          required
          disabled={!!currentRide} // Disable amount input if there's a current ride
        />
        <span className="text-sm text-gray-400">
          {currentRide ? `Ride Fare: $${(amount / 100).toFixed(2)}` : 'Enter amount in cents'}
        </span>
      </div>
      <div className="bg-gray-700 text-white p-3 rounded-lg">
        <CardElement />
      </div>
      <motion.button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!stripe || processing}
      >
        {processing ? "Processing..." : "Process Payment"}
      </motion.button>
    </form>
  );
};

export default function PaymentPage() {
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
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </motion.div>
      <ToastContainer />
    </div>
  );
}
