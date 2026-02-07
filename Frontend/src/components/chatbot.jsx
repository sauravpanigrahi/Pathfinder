import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Bot, User } from "lucide-react";

const ChatBot = ({ resumeText }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI Resume Coach. Ask me anything about your resume.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Auto-scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://pathfinder-maob.onrender.com/chat_ai",
        {
          user_message: input,
          resume_text: resumeText || "",
        },
      );

      const botMessage = { sender: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl w-full md:w-[360px] flex flex-col  h-[400px] overflow-y-autoborder border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-semibold text-lg">NextStep AI</span>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto h-[420px] bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar */}
            {msg.sender === "bot" && (
              <div className="mr-2 mt-1 bg-indigo-100 text-indigo-600 p-2 rounded-full">
                <Bot size={16} />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>

            {/* Avatar for user */}
            {msg.sender === "user" && (
              <div className="ml-2 mt-1 bg-gray-200 text-gray-700 p-2 rounded-full">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Bot size={14} /> <span>AI is thinking...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="border-t bg-white flex items-center px-3 py-2">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ask something about your resume..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`ml-2 p-2 rounded-full transition ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
