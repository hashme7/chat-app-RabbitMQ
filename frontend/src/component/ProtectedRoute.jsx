import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import {useDispatch} from 'react-redux'
import { setUser } from "../store/slices/authSlice";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  useEffect(()=>{
    if(token){
      dispatch(setUser());
    }
  })
  console.log(token, "protectedRoute");
  return token ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
