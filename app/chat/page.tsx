"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mic, Send } from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Dummy function to simulate OpenAI chatbot response
  const sendToChatBot = async (msg: string) => {
    setIsTyping(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Echo: ${msg}`);
        setIsTyping(false);
      }, 1500);
    });
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "User", text: message }]);

    try {
      const response = await sendToChatBot(message);
      setChatMessages((prev) => [...prev, { sender: "Chatbot", text: response as string }]);
      toast.success("Message sent!");
      setMessage("");
    } catch (error) {
      toast.error("Failed to get response.");
    }
  };

  const handleVoiceCommand = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported.");
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
      className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col items-center"
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

      {/* Chat Container */}
      <motion.div
        className="w-full max-w-lg bg-white/30 dark:bg-gray-900/50 backdrop-blur-lg shadow-lg rounded-2xl p-6 flex flex-col h-[500px] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Chat Messages */}
        <div className="flex flex-col space-y-3">
          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              className={`p-3 rounded-lg w-fit max-w-xs ${
                msg.sender === "User"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white self-start"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {msg.text}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg self-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 }}
            >
              Chatbot is typing...
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Chat Input */}
      <motion.div
        className="w-full max-w-lg bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <form onSubmit={handleChatSubmit} className="flex flex-col space-y-4">
          <motion.textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-3 rounded-lg h-20 resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
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
      </motion.div>
    </motion.div>
  );
}
