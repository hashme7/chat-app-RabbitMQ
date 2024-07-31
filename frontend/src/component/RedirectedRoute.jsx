import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { setUser } from '../store/slices/authSlice';

const RedirectRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setUser());
  })
  console.log(token, "redirected route");
  return token ? <Navigate to="/chat" /> : element;
};

export default RedirectRoute;
