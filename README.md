🧩 Project Overview

You are building a full-stack web application called AgriAI, where:

👨‍🌾 Farmers can register, log in, and post their crops for sale (with quantity, price, image, and description).

🛒 Buyers can register, browse crops, and purchase.

📈 A Price Prediction AI microservice (Python + Flask) predicts future crop prices.

🧮 The app displays graphs of farmer/buyer history and expected prices using charts.

💾 Database: MongoDB

🧱 Backend: Node.js + Express + JWT Auth + Mongoose (you already have this base).

🖥 Frontend: React + Tailwind + Axios + Recharts.

🏗 Copilot Instructions

Copilot, continue building the full project with these specifications:
🔹 Backend (Node.js + Express + MongoDB)

Use the existing backend folder C:\Infosys-milestone3\backend.

Keep the existing server.js and auth.js route.

Add these models in models/:

Product.js (crop details)

Order.js (buyer purchase data)

PriceHistory.js (stores price predictions)

Add routes in routes/:

productRoutes.js — CRUD endpoints for farmers

orderRoutes.js — buyer purchases

priceRoutes.js — fetches predictions from Flask microservice

Use JWT middleware to protect routes (farmers can only post/edit their own crops, buyers can only buy).

Add .env variables:
MONGO_URI=mongodb://127.0.0.1:27017/agri_ai
PORT=5000
JWT_SECRET=your_secret_key
FLASK_API_URL=http://127.0.0.1:5001/predict

Folder structure:
backend/
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── PriceHistory.js
├── routes/
│   ├── auth.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── priceRoutes.js
├── middleware/
│   └── authMiddleware.js
├── server.js
├── package.json
└── .env
Price Prediction Microservice (Python + Flask)

Create folder: C:\Infosys-milestone3\price_predictor

Use Flask to expose /predict endpoint.

Use scikit-learn or Prophet for regression-based prediction on sample dataset (data/prices.csv).

API should:

Accept JSON { "crop": "wheat" }

Return predicted price like { "predicted_price": 1620.5 }

Install dependencies:

pip install flask pandas scikit-learn joblib

Example app.py:

from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict_price():
    data = request.json
    crop = data.get("crop")
    # mock prediction
    prediction = 1500.0 + hash(crop) % 200
    return jsonify({"predicted_price": prediction})

if __name__ == "__main__":
    app.run(port=5001)

Frontend (React + Tailwind)

Create folder: C:\Infosys-milestone3\frontend

Initialize React app:

npx create-react-app frontend
cd frontend
npm install axios react-router-dom recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Configure Tailwind in tailwind.config.js:

content: ["./src/**/*.{js,jsx,ts,tsx}"]    

Add global styles in index.css:

@tailwind base;
@tailwind components;
@tailwind utilities;


Pages to build:

Login.jsx / Register.jsx

FarmerDashboard.jsx → add crops, view orders

BuyerDashboard.jsx → browse crops, buy

PriceChart.jsx → show predicted price trend using Recharts

API calls using Axios to http://localhost:5000/api/*.

Data Flow Summary

| Action         | Method | Endpoint            | User           |
| -------------- | ------ | ------------------- | -------------- |
| Register/Login | POST   | /api/auth/*         | Farmer / Buyer |
| Add Crop       | POST   | /api/products       | Farmer         |
| View Crops     | GET    | /api/products       | Buyer          |
| Buy Crop       | POST   | /api/orders         | Buyer          |
| Predict Price  | POST   | /api/prices/predict | Both           |
Bonus: Dashboard Analytics

Use Recharts (LineChart, BarChart) to show:

Farmer: sales history by date

Buyer: total crops purchased

Price prediction trend

🔹 Startup Commands (Windows)

Backend:

cd C:\Infosys-milestone3\backend
npm run dev


Flask Microservice:

cd C:\Infosys-milestone3\price_predictor
python app.py

Frontend:

cd C:\Infosys-milestone3\frontend
npm start


Then open http://localhost:3000 in your browser.

Running the project locally (quick guide)

- Start MongoDB locally or update `backend/.env.example` with your MongoDB URI.

- Start the Flask price microservice (requires Python 3):

```powershell
cd C:\Infosys-milestone3\price_predictor
py -3 -m pip install --user -r requirements.txt
py app.py
```

- Start the backend (PowerShell):

```powershell
cd C:\Infosys-milestone3\backend
copy .env.example .env
npm.cmd install
$env:MONGO_URI='mongodb://127.0.0.1:27017/agri_ai'; $env:JWT_SECRET='devsecret'; $env:FLASK_API_URL='http://127.0.0.1:5001/predict'; npm.cmd run dev
```

- Start the frontend (React dev server) — optional if you want the React single-page app:

```powershell
cd C:\Infosys-milestone3\frontend
npm install
npm start
```

Or use the quick static demo that is served by the backend at http://localhost:5000/ (no React build step required).

Notes and troubleshooting
- On Windows, use the `py` launcher if `python` is not available in PATH.
- If the backend cannot reach the Flask microservice, it will fallback to a deterministic mock prediction and save it to the database. Check the backend logs for `priceRoutes: error contacting flask` to diagnose connectivity/timeouts.
- If PowerShell blocks npm (execution policy), use `npm.cmd` instead of `npm` when running commands in scripts.

Docker (one-command) setup
--------------------------
You can run the full stack (MongoDB, Flask price microservice and Node backend that serves the built React app) using Docker and docker-compose.

Build and run the services:

```powershell
cd C:\Infosys-milestone3
docker compose build
docker compose up
```

Services exposed:
- Backend + frontend SPA: http://localhost:5000
- Flask price predictor: http://localhost:5001
- MongoDB: 27017

Notes:
- The `backend/Dockerfile` performs a frontend build as part of the image build (multi-stage). For faster iterative frontend development, run the React dev server locally and point it at the backend instead.
- Update `JWT_SECRET` and other env values in `docker-compose.yml` before using in production.
- If you already have a local Mongo instance and prefer to use that, edit `docker-compose.yml` or set `MONGO_URI` accordingly.


✅ Expected Result

Farmers can register/login and post crops with images.

Buyers can browse, purchase, and view order history.

Price predictions appear dynamically via Flask microservice.

Dashboard graphs show trends using Recharts.

MongoDB stores all data efficiently.