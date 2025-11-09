import React, { useState } from 'react';
import api from '../api';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('buyer');
  const { login } = useContext(AuthContext);
  const handle = async ()=>{
    try{
  const resp = await api.post('/api/auth/register',{name,email,password,role});
      alert('Registered: '+resp.data.user.name);
      login(resp.data.user, resp.data.token);
    }catch(e){ alert(e?.response?.data?.message || e.message); }
  }
  return (
    <div className="card">
      <h2 className="text-lg font-semibold">Register</h2>
      <input className="border p-2 mt-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border p-2 mt-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 mt-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <select className="border p-2 mt-2" value={role} onChange={e=>setRole(e.target.value)}>
        <option value="buyer">Buyer</option>
        <option value="farmer">Farmer</option>
      </select>
      <button className="mt-3 px-3 py-2 bg-green-600 text-white rounded" onClick={handle}>Register</button>
    </div>
  )
}
