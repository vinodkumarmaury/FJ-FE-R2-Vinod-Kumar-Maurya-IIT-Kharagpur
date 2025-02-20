"use client";

import { useEffect, useState } from "react";
import ChatRoom from "../../components/ChatRoom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mic, Send } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatBotResponse, setChatBotResponse] = useState("");

  // Dummy function to simulate OpenAI chatbot response
  const sendToChatBot = async (msg: string) => {
    return `Echo: ${msg}`;
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendToChatBot(message);
      setChatBotResponse(response);
      toast.success("Message sent to chatbot!");
      setMessage("");
    } catch (error) {
      toast.error("Failed to get response from chatbot.");
    }
  };

  // Voice command using Web Speech API
  const handleVoiceCommand = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      toast.info(`Voice input: ${transcript}`);
    };
    recognition.start();
  };

  return (
    <motion.div
      className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-4xl font-extrabold text-center text-blue-600 dark:text-blue-400"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Live Chat 💬
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <ChatRoom />
      </motion.div>

      <motion.div
        className="mt-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg max-w-lg mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <form onSubmit={handleChatSubmit} className="flex flex-col space-y-4">
          <motion.textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            whileFocus={{ scale: 1.02 }}
          />

          <div className="flex space-x-4">
            <motion.button
              type="submit"
              className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <Send className="mr-2" size={18} /> Send
            </motion.button>

            <motion.button
              type="button"
              onClick={handleVoiceCommand}
              className="flex items-center justify-center bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="mr-2" size={18} /> Voice
            </motion.button>
          </div>
        </form>

        {chatBotResponse && (
          <motion.p
            className="mt-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <strong>Chatbot:</strong> {chatBotResponse}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
