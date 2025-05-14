'use client';  // Required to make the component work in the new App Router (Next.js 13+)

import { useState, useRef, useEffect } from 'react';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim() === '') return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear the input field
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = { text: `Hey! did you just say: ${input}` +'? ', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);  // Simulate delay for bot response
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl">
    {/* Header with Logo */}
    <div className="bg-white dark:bg-gray-800 py-3 px-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="flex items-center space-x-4 w-full justify-center sm:justify-start">
          {/* Stock chart section */}
          <div className="w-24 flex-shrink-0">
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M20,70 L50,40 L80,60 L110,30 L140,50 L170,20" 
                    stroke="#4885ed" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeLinejoin="round" />
              <circle cx="170" cy="20" r="8" fill="#4885ed" />
            </svg>
          </div>
          
          {/* Circuit symbol */}
          <div className="w-16 flex-shrink-0">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="25" fill="none" stroke="#4885ed" strokeWidth="5" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="#4885ed" strokeWidth="5" />
              <line x1="50" y1="25" x2="50" y2="15" stroke="#4885ed" strokeWidth="5" />
              <line x1="50" y1="75" x2="50" y2="85" stroke="#4885ed" strokeWidth="5" />
              <line x1="25" y1="50" x2="15" y2="50" stroke="#4885ed" strokeWidth="5" />
              <line x1="75" y1="50" x2="85" y2="50" stroke="#4885ed" strokeWidth="5" />
            </svg>
          </div>
          
          {/* Text */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-blue-500 dark:text-blue-400">Stock Sage</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your AI Trading Partner</p>
          </div>
        </div>
      </div>
    </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Ask a question about stocks to get started
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 px-4 py-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Ask about stocks..."
            className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-full text-gray-800 dark:text-gray-200 focus:outline-none"
          />
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full focus:outline-none transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}