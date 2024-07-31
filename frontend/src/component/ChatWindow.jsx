import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const ChatWindow = ({ selectedUser, joinRoom, socket }) => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [socket,selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (user && selectedUser) {
        try {
          const response = await axios.get(`http://localhost:3001/chat/messages/${user._id}/${selectedUser._id}`);
          joinRoom(user._id, selectedUser._id, socket);
          setMessages(response.data.messages);
          scrollToBottom();
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedUser]);

  const sendMessage = () => {
    if (message.trim() && user && selectedUser) {
      const newMessage = {
        senderId: user._id,
        recipientId: selectedUser._id,
        message: message,
      };
      socket.emit("send_message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-[#2a2a2a]">
      <div className="p-4 border-b border-[#2a2a2a] bg-[#1b1b1b] text-white">
        <h2 className="text-lg font-semibold">{selectedUser ? `Chat with ${selectedUser.name}` : 'Select a user to start chatting'}</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-[#121212]">
        {selectedUser ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg max-w-xs ${msg.senderId === user._id ? "bg-[#25d366] text-white self-end ml-auto" : "bg-[#333333] text-white self-start mr-auto"}`}
              style={{ alignSelf: msg.senderId === user._id ? 'flex-end' : 'flex-start' }}
            >
              <div className="flex justify-between">
                <span>{msg.message}</span>
                <span className="text-xs text-[#9e9e9e] ml-2">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#9e9e9e]">Select a user to start chatting</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      {selectedUser && (
        <div className="p-4 border-t border-[#2a2a2a] bg-[#1e1e1e] flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 border border-[#333333] rounded-l-md bg-[#121212] text-white"
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-[#25d366] text-white rounded-r-md"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
