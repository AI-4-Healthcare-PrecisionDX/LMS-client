"use client";
import { useState, useEffect, useRef, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";

const ScrollableArea = forwardRef((props, ref) => (
  <ScrollArea {...props} ref={ref} />
));
ScrollableArea.displayName = "ScrollableArea";

export default function ChatSystem() {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [userInput, setUserInput] = useState(""); // Store user input
  const [loading, setLoading] = useState(false); // Track loading state
  const [debugResponse, setDebugResponse] = useState(null); // Debugging: store raw response
  const [isChatOpen, setIsChatOpen] = useState(false); // Track chat panel state
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    };

    scrollToBottom();
  }, [messages]);

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
      const response = await fetch(
        "https://chatbot.diagnotech-ai.com/api/edu_admin_chat_bot/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "query", query: userInput }),
        },
      );

      const data = await response.json();
      const botResponse = data.response ? data.response : "No response"; // Check if response exists and is not null

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
      const response = await fetch(
        "https://chatbot.diagnotech-ai.com/api/edu_admin_chat_bot/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "clear" }),
        },
      );

      const data = await response.json();
      if (data.response) {
        setMessages([]); // Clear chat messages in state
      }
      // setDebugResponse(data); // Debugging: store the raw response data
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to render message based on type
  const renderMessage = (message, index) => {
    const isLongMessage = message.content.length > 100;
    const iconSize = 24;

    return (
      <div
        key={index}
        className={`message ${
          message.role === "user"
            ? "flex items-start justify-end space-x-2 mb-2"
            : "flex items-start space-x-2 mb-2"
        }`}
      >
        {message.role === "user" ? (
          <>
            <div className="p-2 text-white bg-blue-500 rounded-lg max-w-[70%]">
              <p className="text-sm break-words">{message.content}</p>
            </div>
            <User
              className="flex-shrink-0 pr-2 mt-1 dark:text-white"
              size={iconSize}
            />
          </>
        ) : (
          <>
            <Bot
              className="flex-shrink-0 mt-1 dark:text-white"
              size={iconSize}
            />
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-[70%]">
              <p className="text-sm break-words dark:text-white">
                {message.content}
              </p>
            </div>
          </>
        )}
      </div>
    );
  };

  // Toggle chat open/close
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        className={`fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform duration-300 ${isChatOpen ? "rotate-45" : ""}`}
        onClick={toggleChat}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={isChatOpen ? "M12 4v16m8-8H4" : "M8 10h8M8 14h4"}
          />
        </svg>
      </button>
      <div
        className={`z-100 fixed bottom-20 right-6 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg w-96 overflow-hidden transform transition-all duration-500 ease-in-out ${isChatOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}
      >
        <header className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700">
          <h1 className="text-lg font-semibold dark:text-white">Chat</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            disabled={loading}
          >
            New Chat
          </Button>
        </header>
        <main className="flex-1 p-4 space-y-4 overflow-y-auto h-80">
          <ScrollableArea ref={scrollAreaRef} className="h-full">
            {messages.map(renderMessage)}
          </ScrollableArea>
        </main>
        <footer className="flex items-center p-2 space-x-2 border-t dark:border-gray-700">
          <Input
            className="flex-1 dark:text-white dark:bg-gray-800 dark:border-gray-700"
            placeholder="Type your message..."
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "Loading..." : "Send"}
          </Button>
        </footer>
      </div>
    </>
  );
}
