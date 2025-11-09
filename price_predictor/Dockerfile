FROM python:3.10-slim
WORKDIR /app
COPY price_predictor/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY price_predictor/ ./
EXPOSE 5001
CMD ["python", "app.py"]
