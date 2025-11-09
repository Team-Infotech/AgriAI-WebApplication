const apiBase = '/api';
let token = null;

function setUserInfo(user){
  const el = document.getElementById('userInfo');
  if(!user) el.innerText = 'Not logged in';
  else el.innerText = `Logged in: ${user.name} (${user.role})`;
}

document.getElementById('register').onclick = async ()=>{
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const resp = await fetch(apiBase + '/auth/register', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password,role})});
  const data = await resp.json();
  if(data.token){ token = data.token; localStorage.setItem('token', token); setUserInfo(data.user); toggleFarmerForm(); fetchProducts(); }
  else alert(data.message||JSON.stringify(data));
}

document.getElementById('login').onclick = async ()=>{
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const resp = await fetch(apiBase + '/auth/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const data = await resp.json();
  if(data.token){ token = data.token; localStorage.setItem('token', token); setUserInfo(data.user); toggleFarmerForm(); fetchProducts(); }
  else alert(data.message||JSON.stringify(data));
}

function toggleFarmerForm(){
  const userStr = localStorage.getItem('user');
  // We don't persist user details in this simple demo; instead, peek token payload not implemented.
  // Show product form if token exists (assume farmer can create after login/register UI selection)
  const pf = document.getElementById('productForm');
  pf.style.display = token ? 'block' : 'none';
}

document.getElementById('addProduct').onclick = async ()=>{
  const title = document.getElementById('title').value;
  const price = Number(document.getElementById('price').value);
  const quantity = Number(document.getElementById('quantity').value);
  const resp = await fetch(apiBase + '/products', {method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({title,price,quantity})});
  const data = await resp.json();
  if(data._id) { alert('Product added'); fetchProducts(); } else alert(data.message || JSON.stringify(data));
}

async function fetchProducts(){
  const resp = await fetch(apiBase + '/products');
  const list = await resp.json();
  const el = document.getElementById('productList');
  el.innerHTML = '';
  list.forEach(p=>{
    const d = document.createElement('div'); d.className='card';
    d.innerHTML = `<strong>${p.title}</strong><div>Price: ${p.price}</div><div>Qty: ${p.quantity}</div><div>Farmer: ${p.farmer?.name||''}</div><button data-id="${p._id}">Buy 1</button>`;
    d.querySelector('button').onclick = ()=>buyProduct(p._id);
    el.appendChild(d);
  })
}

async function buyProduct(productId){
  if(!token){ alert('Please login as buyer'); return; }
  const resp = await fetch(apiBase + '/orders', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token}, body:JSON.stringify({productId,quantity:1})});
  const data = await resp.json();
  if(data._id) { alert('Order placed'); fetchProducts(); } else alert(data.message||JSON.stringify(data));
}

document.getElementById('predictBtn').onclick = async ()=>{
  const crop = document.getElementById('crop').value;
  const resp = await fetch(apiBase + '/prices/predict', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({crop})});
  const data = await resp.json();
  document.getElementById('prediction').innerText = JSON.stringify(data);
}

// Init
token = localStorage.getItem('token');
setUserInfo(null);
toggleFarmerForm();
fetchProducts();
