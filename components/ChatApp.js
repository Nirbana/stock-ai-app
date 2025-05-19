'use client';  // Required to make the component work in the new App Router (Next.js 13+)

import { useState, useRef, useEffect } from 'react';
//const [isTyping, setIsTyping] = useState(false);

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  
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
  
    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true); // start typing indicator
  
    fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    })
      .then((res) => res.json())
      .then((data) => {
        const botMessage = { ...data.reply, sender: 'bot' };
        console.log('🤖 botMessage', botMessage);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      })
      .catch(() => {
        const errorMessage = { text: 'Error talking to the bot. Try again.', sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      })
      .finally(() => {
        setIsTyping(false); // stop typing indicator
      });
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#eaeaea] px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1e1e1e] text-white px-6 py-4">
          <h1 className="text-xl font-semibold">Rank Scout AI</h1>
          <p className="text-sm text-gray-300">Your friendly SEO audit assistant</p>
        </div>
  
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f9f9f9] transition-all duration-300">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">Ask about your page SEO to get started</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'cards' ? (
                  <div className="flex flex-col gap-2 w-full max-w-sm">
                    {message.data.map((card, i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                      >
                        <p className="text-sm text-gray-700">{card}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`px-4 py-3 rounded-lg max-w-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.data ?? message.text}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg animate-pulse">
                Typing...
              </div>
          </div>
        )}
        </div>
  
        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border-t border-gray-200 p-4 flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Paste a URL or ask something..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
  
}