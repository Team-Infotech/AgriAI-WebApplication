import React, { useEffect, useState } from 'react';
import api from '../api';

export default function FarmerDashboard(){
  const [title,setTitle]=useState('');
  const [price,setPrice]=useState('');
  const [quantity,setQuantity]=useState('');
  const [products,setProducts]=useState([]);

  const fetchProducts = async ()=>{
    const resp = await api.get('/api/products');
    setProducts(resp.data || []);
  }
  useEffect(()=>{ fetchProducts() },[]);

  const add = async ()=>{
  await api.post('/api/products',{ title, price: Number(price), quantity: Number(quantity) });
    setTitle(''); setPrice(''); setQuantity(''); fetchProducts();
  }

  return (
    <div>
      <div className="card mb-4">
        <h2 className="font-semibold">Add Product</h2>
        <input className="border p-2 mt-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 mt-2" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <input className="border p-2 mt-2" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(e.target.value)} />
        <button className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded" onClick={add}>Add</button>
      </div>
      <div>
        <h3 className="font-semibold">My Products</h3>
        {products.map(p=> (
          <div key={p._id} className="card mt-2">
            <div className="font-bold">{p.title}</div>
            <div>Price: {p.price} Qty: {p.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
