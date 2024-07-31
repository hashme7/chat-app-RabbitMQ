import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/slices/authSlice";

import { useNavigate } from "react-router-dom";

function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      let res =await dispatch(loginUser({ email, password }));
      console.log(res.type,"dfkasj;dfkaksdfkajskdf;ajsdfj;a")
      if (res.type == "auth/login/fulfilled") {
        console.log('fullfilled theree.....')
        console.log(JSON.stringify(localStorage.getItem('user')))
        navigate("/chat");
      }else if (res.type == '/auth/login/rejected'){
        console.log("password fail")
      }else{
        console.log("no user in that name")
      }
    } catch (error) {
      console.log(`error on handle login function:${error}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
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
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default login;
