import React, { useState, useEffect } from "react";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import io from "socket.io-client";
import NotificationBanner from "./NotificationBanner";
import { useSelector } from "react-redux";

const socket = io.connect("http://localhost:3001");

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8081");
    webSocket.onopen = () => {
      console.log("WebSocket connection opened");
      console.log(user._id);
      webSocket.send(JSON.stringify({ type: "init", userId: user._id }));
    };
    webSocket.onmessage = (event) => {
      console.log("Received message:", event.data);
      const notification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    };
  }, [user]);

  const generateRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    const concatenatedIds = sortedIds.join("_");
    let hash = 0;
    for (let i = 0; i < concatenatedIds.length; i++) {
      const char = concatenatedIds.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString();
  };

  return (
    <div className="flex flex-col h-screen">
      <NotificationBanner
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="md:w-1/4 lg:w-1/5 h-full border-r border-gray-200">
          <UserList
            onUserSelect={setSelectedUser}
            joinRoom={(senderId, recipientId) => {
              const roomId = generateRoomId(senderId, recipientId);
              socket.emit("join_room", roomId);
            }}
            socket={socket}
          />
        </div>
        <div className="md:w-3/4 lg:w-4/5 h-full">
          <ChatWindow
            selectedUser={selectedUser}
            joinRoom={(senderId, recipientId) => {
              const roomId = generateRoomId(senderId, recipientId);
              socket.emit("join_room", roomId);
            }}
            socket={socket}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
