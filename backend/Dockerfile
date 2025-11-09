### Build frontend and copy into backend image (multi-stage)
FROM node:18 AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./frontend/
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

FROM node:18-alpine
WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --production
COPY backend/ ./
# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./frontend/build

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server.js"]
