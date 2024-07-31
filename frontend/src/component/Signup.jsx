import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/slices/authSlice";
import {useNavigate} from 'react-router-dom'

function Singup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSignup = async(e) => {
    try {
      e.preventDefault();
      let res =await dispatch(signupUser({ name:username, password, email }));
      console.log(res,"dfakjsdkfja");
      if(res.type === "auth/signup/fulfilled"){
        navigate('/');
      }
    } catch (error) {
      console.log(`error on handle signup ${error}`);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          disabled={loading}
          onClick={handleSignup}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </div>
    </div>
  );
}

export default Singup;
