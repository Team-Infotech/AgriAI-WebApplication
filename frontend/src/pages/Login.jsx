import React, { useState } from 'react';
import api from '../api';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const { login } = useContext(AuthContext);
  const handle = async ()=>{
    try{
  const resp = await api.post('/api/auth/login',{email,password});
      alert('Logged in: '+resp.data.user.name);
      login(resp.data.user, resp.data.token);
    }catch(e){ alert(e?.response?.data?.message || e.message); }
  }
  return (
    <div className="card">
      <h2 className="text-lg font-semibold">Login</h2>
      <input className="border p-2 mt-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 mt-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="mt-3 px-3 py-2 bg-blue-600 text-white rounded" onClick={handle}>Login</button>
    </div>
  )
}
