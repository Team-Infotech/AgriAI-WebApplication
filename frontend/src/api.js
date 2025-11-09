import axios from 'axios';

const api = axios.create({ baseURL: '/' });

// internal token holder
let _token = null;

// expose a helper to set the token from AuthContext
function setToken(token) {
  _token = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// Attach token (from _token) on each request if present — fallback to no header
api.interceptors.request.use((config) => {
  try {
    if (_token) config.headers.Authorization = `Bearer ${_token}`;
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;
export { setToken };

// allow registering an onUnauthorized callback (e.g., to auto-logout)
let _onUnauthorized = null;
function setOnUnauthorized(cb) { _onUnauthorized = cb; }

// Response interceptor to catch 401 and notify app
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    try {
      const status = error?.response?.status;
      if (status === 401) {
        if (typeof _onUnauthorized === 'function') {
          try { _onUnauthorized(); } catch (e) { console.error('onUnauthorized handler failed', e); }
        }
      }
    } catch (e) { /* ignore */ }
    return Promise.reject(error);
  }
);

export { setOnUnauthorized };
