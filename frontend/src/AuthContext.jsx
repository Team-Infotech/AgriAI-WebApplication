import React, { createContext, useState, useEffect } from 'react';
import { setToken as apiSetToken, setOnUnauthorized } from './api';

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch(e){ return null }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(()=>{
    // keep storage in sync
    if(user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);
  useEffect(()=>{
    if(token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    // update shared api instance immediately when token changes
    try { apiSetToken(token); } catch(e){}
  }, [token]);

  // register handler to auto-logout on 401 responses
  useEffect(()=>{
    const handler = () => { setUser(null); setToken(null); };
    try { setOnUnauthorized(handler); } catch(e){}
    return () => { try { setOnUnauthorized(null); } catch(e){} };
  }, []);

  const login = (userObj, tokenStr) => { setUser(userObj); setToken(tokenStr); };
  const logout = () => { setUser(null); setToken(null); };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
