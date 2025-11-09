import React, { useEffect, useState } from 'react';
import api from '../api';

export default function BuyerDashboard(){
  const [products,setProducts]=useState([]);
  const fetch = async ()=>{ const resp = await api.get('/api/products'); setProducts(resp.data || []); }
  useEffect(()=>{ fetch() },[]);
  const buy = async (id)=>{
  await api.post('/api/orders',{ productId: id, quantity: 1 });
    alert('Order placed');
    fetch();
  }
  return (
    <div>
      <h2 className="font-semibold">Browse Products</h2>
      {products.map(p=> (
        <div key={p._id} className="card mt-2">
          <div className="flex justify-between"><div><strong>{p.title}</strong><div>Price: {p.price}</div></div><div><button className="px-2 py-1 bg-green-600 text-white rounded" onClick={()=>buy(p._id)}>Buy 1</button></div></div>
        </div>
      ))}
    </div>
  )
}
