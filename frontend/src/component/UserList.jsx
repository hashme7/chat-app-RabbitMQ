import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const UserList = ({ onUserSelect, joinRoom, socket }) => {
  const [users, setUsers] = useState([]);
  const sender = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/users");
        setUsers(res.data.userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    onUserSelect(user);
    joinRoom(sender._id, user._id, socket);
  };

  return (
    <div className="bg-[#1e1e1e] border-r border-[#2a2a2a] h-full">
      <h2 className="text-lg font-semibold p-4 border-b border-[#2a2a2a] bg-[#1b1b1b] text-white">Chats</h2>
      <ul className="overflow-y-auto">
        {users.map((user) => (
          <li
            key={user._id}
            className="p-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center border-b border-[#2a2a2a]"
            onClick={() => handleUserSelect(user)}
          >
            <FontAwesomeIcon icon={faUserCircle} className="w-10 h-10 text-[#8e8e8e] mr-3" />
            <div className="flex-1 text-white">
              <span className="text-base font-medium">{sender._id === user._id ? "Me" : user.name}</span>
              <p className="text-sm text-[#9e9e9e]">Last message...</p>
            </div>
            <span className="text-xs text-[#6e6e6e]">Time</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
