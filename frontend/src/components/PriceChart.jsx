import React, { useEffect, useState } from 'react';
import api from '../api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceChart(){
  const [data,setData]=useState([]);
  const [crop,setCrop]=useState('wheat');
  const fetchHistory = async ()=>{
    try{
  const resp = await api.get('/api/prices/history');
      setData((resp.data||[]).map(item=>({ x: new Date(item.createdAt).toLocaleString(), y: item.predicted_price })));
    }catch(e){ console.error(e); }
  }
  useEffect(()=>{ fetchHistory() },[]);

  const predictNow = async ()=>{
  const resp = await api.post('/api/prices/predict',{ crop });
    await fetchHistory();
    alert('Predicted: '+resp.data.predicted_price);
  }

  return (
    <div>
      <div className="card mb-4">
        <h3 className="font-semibold">Price Prediction</h3>
        <div className="flex gap-2 mt-2">
          <input value={crop} onChange={e=>setCrop(e.target.value)} className="border p-2" />
          <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={predictNow}>Predict</button>
          <button className="px-3 py-2 bg-gray-200 rounded" onClick={fetchHistory}>Refresh</button>
        </div>
      </div>
      <div className="card" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.map(d=>({ name: d.x, value: d.y }))}>
            <XAxis dataKey="name" tickFormatter={(t)=>t.split(',')[0]} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
