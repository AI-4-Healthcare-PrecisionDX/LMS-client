import RTEditor from "@/components/brand/rich-text-editor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, Plus, Search, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const dummyMessages = [
  {
    id: 1,
    from: "John Doe",
    subject: "Question about assignment",
    content:
      "Hello Professor, I have a question about the recent assignment. Could you please clarify the requirements for the third section?",
    date: "2023-09-25",
    read: false,
    messages: [],
  },
  {
    id: 2,
    from: "Jane Smith",
    subject: "Extension request",
    content:
      "Dear Teacher, I was wondering if I could get an extension on the upcoming project due to some unforeseen circumstances.",
    date: "2023-09-24",
    read: true,
    messages: [
      {
        type: "text",
        content: "Certainly, Jane. Please submit your project by next Friday.",
        date: "2023-09-24T14:30:00Z",
      },
    ],
  },
  {
    id: 3,
    from: "Mike Johnson",
    subject: "Absence notification",
    content:
      "I will not be able to attend class tomorrow due to a doctor's appointment. Could you please let me know what I'll miss?",
    date: "2023-09-23",
    read: true,
    messages: [],
  },
  {
    id: 4,
    from: "Sarah Williams",
    subject: "Project group formation",
    content:
      "Our group for the semester project consists of myself, Alex, and Emily. We'd like to focus on renewable energy if that's okay.",
    date: "2023-09-22",
    read: false,
    messages: [
      {
        type: "text",
        content:
          "That sounds like an excellent topic, Sarah. Please proceed with your group's plan.",
        date: "2023-09-22T16:45:00Z",
      },
      {
        type: "image",
        content: "/placeholder.svg?height=200&width=300",
        date: "2023-09-22T16:46:00Z",
      },
    ],
  },
  {
    id: 5,
    from: "Chris Brown",
    subject: "Extra credit opportunity",
    content:
      "I was wondering if there are any extra credit opportunities available. I'm really interested in improving my grade in the class.",
    date: "2023-09-21",
    read: true,
    messages: [
      {
        type: "text",
        content:
          "Hi Chris, I've attached an audio explanation of the extra credit options.",
        date: "2023-09-21T10:15:00Z",
      },
      {
        type: "audio",
        content: "/extra-credit-explanation.mp3",
        date: "2023-09-21T10:16:00Z",
      },
    ],
  },
];

export default function TeacherInbox({ selectedStudent }) {
  const [messages, setMessages] = useState(dummyMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [newMessageRecipient, setNewMessageRecipient] = useState("");
  const [newMessageSubject, setNewMessageSubject] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const [isCreatingNewMessage, setIsCreatingNewMessage] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      setNewMessageRecipient(selectedStudent.email);
      setNewMessageSubject("Regarding Your Academic Performance");
      handleNewMessage();
    }
  }, [selectedStudent]);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsCreatingNewMessage(false);
    if (!message.read) {
      setMessages(
        messages.map((msg) =>
          msg.id === message.id ? { ...msg, read: true } : msg,
        ),
      );
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendMessage = () => {
    if (selectedMessage) {
      const newMessages = [];
      if (messageContent) {
        newMessages.push({
          type: "text",
          content: messageContent,
          date: new Date().toISOString(),
        });
      }
      if (selectedFile) {
        newMessages.push({
          type: "file",
          content: selectedFile.name,
          date: new Date().toISOString(),
        });
      }
      if (newMessages.length > 0) {
        const updatedMessages = messages.map((msg) =>
          msg.id === selectedMessage.id
            ? { ...msg, messages: [...msg.messages, ...newMessages] }
            : msg,
        );
        setMessages(updatedMessages);
        setSelectedMessage({
          ...selectedMessage,
          messages: [...selectedMessage.messages, ...newMessages],
        });
        setMessageContent(""); // Clear the message content
        setSelectedFile(null); // Clear the selected file
      }
    }
  };

  const handleNewMessage = () => {
    setIsCreatingNewMessage(true);
    setSelectedMessage(null);
    setSelectedFile(null);
  };

  const handleSendNewMessage = () => {
    const newMessageArray = [];
    if (newMessageContent) {
      newMessageArray.push({
        type: "text",
        content: newMessageContent,
        date: new Date().toISOString(),
      });
    }
    if (selectedFile) {
      newMessageArray.push({
        type: "file",
        content: selectedFile.name,
        date: new Date().toISOString(),
      });
    }

    const newMessage = {
      id: messages.length + 1,
      from: newMessageRecipient,
      subject: newMessageSubject,
      content: newMessageContent,
      date: new Date().toISOString().split("T")[0],
      read: true,
      messages: newMessageArray,
    };
    setMessages([newMessage, ...messages]);
    setSelectedMessage(newMessage);
    setNewMessageRecipient("");
    setNewMessageSubject("");
    setNewMessageContent("");
    setSelectedFile(null);
    setIsCreatingNewMessage(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📃";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📽️";
      default:
        return "📎";
    }
  };

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      <div className="w-1/3 border-r">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleNewMessage} className="w-full mb-2">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
        <div className="overflow-auto h-[calc(100%-60px)]">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-b cursor-pointer ${
                selectedMessage?.id === message.id
                  ? "bg-accent text-accent-foreground"
                  : message.read
                    ? "bg-background"
                    : "bg-muted"
              }`}
              onClick={() => handleMessageClick(message)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{message.from}</span>
                <span className="text-xs text-muted-foreground">
                  {message.date}
                </span>
              </div>
              <div className="text-sm truncate">{message.subject}</div>
              {!message.read && (
                <div className="mt-1 text-xs inline-block px-2 py-1 rounded bg-blue-100 text-blue-800">
                  Unread
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {isCreatingNewMessage ? (
          <div className="p-4 flex-1 flex flex-col">
            <Input
              placeholder="Recipient"
              value={newMessageRecipient}
              onChange={(e) => setNewMessageRecipient(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Subject"
              value={newMessageSubject}
              onChange={(e) => setNewMessageSubject(e.target.value)}
              className="mb-2"
            />
            <RTEditor
              value={newMessageContent}
              onChange={(value) => setNewMessageContent(value)}
              className="flex-1 mb-2"
              onSend={handleSendNewMessage}
            />
            <div className="flex items-center space-x-2 mb-2">
              <Button onClick={() => fileInputRef.current.click()}>
                <PaperclipIcon className="h-4 w-4 mr-2" />
                Attach File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              {selectedFile && (
                <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                  <span className="text-2xl">
                    {getFileIcon(selectedFile.name)}
                  </span>
                  <span className="flex-grow truncate">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <Button onClick={handleSendNewMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send New Message
            </Button>
          </div>
        ) : selectedMessage ? (
          <>
            <div className="p-4 border-b">
              <Input
                value={selectedMessage.subject}
                onChange={(e) =>
                  setSelectedMessage({
                    ...selectedMessage,
                    subject: e.target.value,
                  })
                }
                className="text-xl font-semibold mb-2"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{selectedMessage.from[0]}</AvatarFallback>
                  </Avatar>
                  <span>{selectedMessage.from}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedMessage.date}
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              {selectedMessage.messages.map((message, index) => (
                <div key={index} className="bg-muted p-3 rounded-lg mb-2">
                  {message.type === "text" && (
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  )}
                  {message.type === "file" && (
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getFileIcon(message.content)}
                      </span>
                      <span className="text-sm">{message.content}</span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.date).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end space-x-2">
                  <div className="flex-grow">
                    <RTEditor
                      placeholder="Type your message here..."
                      value={messageContent}
                      onChange={(value) => setMessageContent(value)}
                      className="min-h-[50px] resize-none"
                      onSend={handleSendMessage}
                    />
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current.click()}
                      className="h-10 w-10"
                    >
                      <PaperclipIcon className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleSendMessage} className="h-10">
                      <Send className="h-5 w-5 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center space-x-2 bg-gray-100 p-2 rounded">
                    <span className="text-2xl">
                      {getFileIcon(selectedFile.name)}
                    </span>
                    <span className="flex-grow truncate">
                      {selectedFile.name}
                    </span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-semibold mb-4">
              Select a message or create a new one
            </p>
            <Button onClick={handleNewMessage}>
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
