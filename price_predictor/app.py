from flask import Flask, request, jsonify
import hashlib

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_price():
    data = request.json or {}
    crop = data.get('crop', '')
    # simple deterministic mock prediction based on crop string
    if not crop:
        return jsonify({'error': 'crop required'}), 400
    h = int(hashlib.sha256(crop.encode()).hexdigest(), 16)
    prediction = 1000 + (h % 1000) / 1.0
    return jsonify({'predicted_price': round(prediction, 2)})

if __name__ == '__main__':
    # bind explicitly to localhost
    app.run(host='127.0.0.1', port=5001, debug=False)
