import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket: any;

export default function ChatRoom() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Connect to socket.io server (ensure you run a backend or use a public testing server)
    socket = io("http://localhost:3000"); // update with your socket.io endpoint
    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="text-xl font-bold mb-2">Chat Room</h3>
      <div className="h-40 overflow-y-scroll border mb-2 p-2">
        {messages.map((msg, i) => (
          <p key={i} className="mb-1">{msg}</p>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Type your message"
          aria-label="Chat message"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
