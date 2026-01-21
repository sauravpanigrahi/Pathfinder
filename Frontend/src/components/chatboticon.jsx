import ChatBot from './chatbot'; // 🧠 added chatbot component
import { MessageCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';
import React, { useState } from 'react';

const Chatboticon = () => {
    const [showChat, setShowChat] = useState(false);
    const { resume } = useAppContext();
  return <div>
    <button
              onClick={() => setShowChat((prev) => !prev)}
              className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 z-50"
            >
              <MessageCircle size={28} />
            </button>
      
            {/* 🧠 Chatbot Popup */}
            {showChat && (
              <div className="fixed bottom-20 right-6 w-[360px] max-h-[500px] bg-white shadow-2xl rounded-lg border border-gray-200 z-50 overflow-hidden">
                <ChatBot resumeText={resume?.text || ""} />
              </div>
            )}
  </div>;
};
export default Chatboticon;