import axios from 'axios';
import API_BASE_URL from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  console.log(`[API_INTERCEPTOR] Processing ${failedQueue.length} queued requests`);
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  );
  failedQueue = [];
};

// ── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    console.log('[API_INTERCEPTOR] ═══════════════════════════════════════════');
    console.log('[API_INTERCEPTOR] ⚠️ 401 Unauthorized received');
    console.log('[API_INTERCEPTOR] URL:', originalRequest?.url);
    console.log('[API_INTERCEPTOR] Method:', originalRequest?.method?.toUpperCase());
    
    // Don't retry if this is already a retry
    if (originalRequest._retry) {
      console.log('[API_INTERCEPTOR] ❌ Already retried once, giving up');
      console.log('[API_INTERCEPTOR] ═══════════════════════════════════════════');
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Queue concurrent requests while a refresh is already in flight
    if (isRefreshing) {
      console.log('[API_INTERCEPTOR] 🔄 Refresh already in progress, queueing request');
      console.log('[API_INTERCEPTOR] Queue size:', failedQueue.length + 1);
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          console.log('[API_INTERCEPTOR] ✅ Retrying queued request with new token');
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          console.error('[API_INTERCEPTOR] ❌ Queued request failed:', err.message);
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    console.log('[API_INTERCEPTOR] 🔄 Starting token refresh...');

    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.error('[API_INTERCEPTOR] ❌ No refresh token found');
        processQueue(error, null);
        isRefreshing = false;
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      console.log('[API_INTERCEPTOR] Refresh token (first 30 chars):', refreshToken.substring(0, 30) + '...');
      console.log('[API_INTERCEPTOR] Calling /api/auth/token/refresh/');

      const refreshResponse = await axios.post(
        `${API_BASE_URL}api/auth/token/refresh/`,
        { refresh: refreshToken },
        { timeout: 15000 }
      );

      const newAccessToken  = refreshResponse.data.access;
      const newRefreshToken = refreshResponse.data.refresh; // Will be undefined if rotation is disabled

      if (!newAccessToken) {
        console.error('[API_INTERCEPTOR] ❌ No access token in response');
        console.error('[API_INTERCEPTOR] Response:', refreshResponse.data);
        throw new Error('No access token in refresh response');
      }

      // Save new access token
      const oldAccessToken = localStorage.getItem('accessToken');
      localStorage.setItem('accessToken', newAccessToken);
      
      // ✅ UPDATED: Only save new refresh token if rotation is enabled
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
        console.log('[API_INTERCEPTOR] ✅ Rotated refresh token saved (rotation enabled)');
        console.log('[API_INTERCEPTOR] New refresh token (first 30 chars):', newRefreshToken.substring(0, 30) + '...');
      } else {
        console.log('[API_INTERCEPTOR] ℹ️ No new refresh token (rotation disabled - keeping existing token)');
      }

      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization     = `Bearer ${newAccessToken}`;

      console.log('[API_INTERCEPTOR] ✅ ═══════════════════════════════════════');
      console.log('[API_INTERCEPTOR] ✅ TOKEN REFRESH SUCCESSFUL');
      console.log('[API_INTERCEPTOR] ✅ Old access token:', oldAccessToken?.substring(0, 30) + '...');
      console.log('[API_INTERCEPTOR] ✅ New access token:', newAccessToken.substring(0, 30) + '...');
      console.log('[API_INTERCEPTOR] ✅ Refresh token:   ', newRefreshToken ? 'ROTATED' : 'KEPT SAME');
      console.log('[API_INTERCEPTOR] ✅ ═══════════════════════════════════════');

      // 🔥 Notify the proactive refresh hook about the new token
      window.dispatchEvent(new CustomEvent('tokenRefreshed', {
        detail: { accessToken: newAccessToken }
      }));
      console.log('[API_INTERCEPTOR] 📡 Event dispatched to refresh hook');

      processQueue(null, newAccessToken);
      isRefreshing = false;

      console.log('[API_INTERCEPTOR] 🔁 Retrying original request');
      return api(originalRequest);

    } catch (refreshError) {
      console.error('[API_INTERCEPTOR] ❌ ═══════════════════════════════════════');
      console.error('[API_INTERCEPTOR] ❌ REFRESH FAILED');
      console.error('[API_INTERCEPTOR] ❌ Error:', refreshError.message);
      console.error('[API_INTERCEPTOR] ❌ Status:', refreshError.response?.status);
      console.error('[API_INTERCEPTOR] ❌ Data:', refreshError.response?.data);
      console.error('[API_INTERCEPTOR] ❌ ═══════════════════════════════════════');
      
      processQueue(refreshError, null);
      isRefreshing = false;
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default api;
export { api };