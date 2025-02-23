"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Initialize Stripe with your publishable key (safe for client use)
const stripePromise = loadStripe("pk_test_51QvQPWC5MEnMdgz5uwIGEYJX8LtsPTzZeV3UWeV6zi8rdzTkDqC5xpYTxJgd3qDRacKEMmaHhbDayxL9472zA7ev00zIflggUx");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [nameOnCard, setNameOnCard] = useState("");
  const [processing, setProcessing] = useState(false);

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
      body: JSON.stringify({ amount: 1000 }), // Example: $10.00 in cents
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
    }
  };

  return (
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
    </div>
  );
}
