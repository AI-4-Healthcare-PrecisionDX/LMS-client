"use client";
import { useState } from "react";

export default function ChatSystem() {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [userInput, setUserInput] = useState(""); // Store user input
  const [loading, setLoading] = useState(false); // Track loading state
  const [debugResponse, setDebugResponse] = useState(null); // Debugging: store raw response

  // Function to handle user input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Function to handle sending the message
  const sendMessage = async () => {
    if (!userInput) return;

    // Add user message to chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "text", role: "user", content: userInput },
    ]);

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/edu_chat_bot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "query", query: userInput }),
      });

      const data = await response.json();
      setDebugResponse(data); // Debugging: store the raw response data

      const botResponse = data.response.response; // Extract the text from nested response

      // Add chatbot response to chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "text", role: "bot", content: botResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "text",
          role: "bot",
          content: "Error fetching response from the server.",
        },
      ]);
    } finally {
      setLoading(false);
      setUserInput(""); // Clear input after sending
    }
  };

  // Function to clear chat history
  const clearChat = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/edu_chat_bot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "clear" }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages([]); // Clear chat messages in state
      }
      setDebugResponse(data); // Debugging: store the raw response data
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to render message based on type
  const renderMessage = (message, index) => (
    <div
      key={index}
      className={`message ${message.role === "user" ? "text-right" : "text-left"} mb-2`}
    >
      <span
        className={`message-content ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} p-2 rounded-md inline-block`}
      >
        {message.content}
      </span>
    </div>
  );

  return (
    <div className="chat-system">
      <div className="chat-messages p-4 bg-white border rounded-md max-h-80 overflow-y-auto">
        {messages.map(renderMessage)}
        {/* Debugging: Display raw response data */}
        <pre>{JSON.stringify(debugResponse, null, 2)}</pre>
      </div>

      <div className="input-area mt-4">
        <input
          type="text"
          className="p-2 border rounded-md w-full"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleInputChange}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>
        <button
          onClick={clearChat}
          className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
          disabled={loading}
        >
          New Chat
        </button>
      </div>
    </div>
  );
}
