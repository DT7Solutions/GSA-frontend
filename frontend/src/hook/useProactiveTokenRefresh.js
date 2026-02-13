import { useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import API_BASE_URL from '../config';

// ─── Constants for SHORT tokens (2-5 minutes) ─────────────────────────────────
// IMPORTANT: Adjust these based on your actual token lifetime!
const ACTIVITY_EVENTS          = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'wheel'];
const MIN_REFRESH_INTERVAL_MS  = 30 * 1000;        // Don't refresh more often than every 30s
const ACTIVITY_WINDOW_MS       = 60 * 1000;         // "active" = event within last 60s
const CHECK_INTERVAL_MS        = 5 * 1000;          // Check token status every 5s
const GRACE_PERIOD_MS          = 15 * 1000;         // Allow 15s grace after expiry

// ─── How it works ─────────────────────────────────────────────────────────────
//
// For a 3-minute token:
//
//  00:00 - Token issued
//        ↓ [User scrolling, clicking - activity recorded continuously]
//        ↓ [Every 5s: Check if token will expire in next 60s]
//  02:00 - 60s left, user is active → Refresh immediately
//        ↓ [New 3-min token issued]
//  05:00 - 60s left, user is active → Refresh immediately
//        ↓ [Process continues as long as user is active]
//
// If user goes idle:
//  00:00 - Token issued
//  01:30 - User stops activity (last mouse move)
//  02:30 - Token expires (no activity in last 60s, so no refresh)
//        → User gets logged out on next API call or tab focus
//
// ─────────────────────────────────────────────────────────────────────────────

const useProactiveTokenRefresh = () => {
  const checkTimerRef       = useRef(null);
  const isRefreshingRef     = useRef(false);
  const lastActivityRef     = useRef(null);
  const lastRefreshRef      = useRef(null);
  const mountedRef          = useRef(true);

  // ── Activity tracking ──────────────────────────────────────────────────────
  const recordActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    
    // Reduced logging for activity (too noisy)
    // Only log once per minute
    if (!window._lastActivityLog || now - window._lastActivityLog > 60000) {
      console.log('[ACTIVITY] 📍 User activity detected');
      window._lastActivityLog = now;
    }
  }, []);

  const wasActiveRecently = useCallback(() => {
    if (lastActivityRef.current === null) {
      return false;
    }
    const timeSinceActivity = Date.now() - lastActivityRef.current;
    const isActive = timeSinceActivity < ACTIVITY_WINDOW_MS;
    return isActive;
  }, []);

  // ── Check if we can refresh (not too soon after last refresh) ─────────────
  const canRefresh = useCallback(() => {
    if (!lastRefreshRef.current) return true;
    const timeSinceRefresh = Date.now() - lastRefreshRef.current;
    return timeSinceRefresh > MIN_REFRESH_INTERVAL_MS;
  }, []);

  // ── Get token status ───────────────────────────────────────────────────────
  const getTokenStatus = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return { status: 'missing', timeLeft: 0, shouldRefresh: false };
    }

    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;
      const timeLeft = expiresAt - Date.now();

      // Token expired beyond grace period
      if (timeLeft < -GRACE_PERIOD_MS) {
        return { status: 'expired_hard', timeLeft, shouldRefresh: false };
      }

      // Token expired but within grace period
      if (timeLeft < 0) {
        return { status: 'expired_grace', timeLeft, shouldRefresh: true };
      }

      // Token expiring soon and user is active
      if (timeLeft < ACTIVITY_WINDOW_MS && wasActiveRecently()) {
        return { status: 'expiring_soon', timeLeft, shouldRefresh: true };
      }

      // Token is fine
      return { status: 'valid', timeLeft, shouldRefresh: false };
      
    } catch (err) {
      console.error('[TOKEN_STATUS] Error decoding token:', err);
      return { status: 'invalid', timeLeft: 0, shouldRefresh: false };
    }
  }, [wasActiveRecently]);

  // ── Core refresh call ──────────────────────────────────────────────────────
  const refreshAccessToken = useCallback(async (reason = 'scheduled') => {
    if (!mountedRef.current) {
      return false;
    }

    if (isRefreshingRef.current) {
      console.log('[TOKEN_REFRESH] ⏭️ Already in progress — skipping');
      return false;
    }

    if (!canRefresh()) {
      console.log('[TOKEN_REFRESH] ⏭️ Too soon since last refresh — skipping');
      return false;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.warn('[TOKEN_REFRESH] ❌ No refresh token — logging out');
      localStorage.clear();
      window.location.href = '/';
      return false;
    }

    try {
      isRefreshingRef.current = true;
      
      console.log('[TOKEN_REFRESH] ═══════════════════════════════════════════');
      console.log(`[TOKEN_REFRESH] 🔄 Refreshing token (reason: ${reason})`);
      
      const response = await axios.post(
        `${API_BASE_URL}api/auth/token/refresh/`,
        { refresh: refreshToken },
        { timeout: 15000 }
      );

      const newAccess  = response.data.access;
      const newRefresh = response.data.refresh;

      if (!newAccess) {
        console.error('[TOKEN_REFRESH] ❌ No access token in response');
        return false;
      }

      // Save tokens
      localStorage.setItem('accessToken', newAccess);
      if (newRefresh) {
        localStorage.setItem('refreshToken', newRefresh);
      }

      // Record refresh time
      lastRefreshRef.current = Date.now();

      const decoded = jwtDecode(newAccess);
      const expiresAt = new Date(decoded.exp * 1000);
      const lifetime = Math.round((decoded.exp - decoded.iat) / 60);
      
      console.log('[TOKEN_REFRESH] ✅ SUCCESS!');
      console.log(`[TOKEN_REFRESH] ✅ Expires at: ${expiresAt.toLocaleTimeString()}`);
      console.log(`[TOKEN_REFRESH] ✅ Lifetime: ${lifetime} minutes`);
      console.log('[TOKEN_REFRESH] ═══════════════════════════════════════════');

      // Dispatch event
      window.dispatchEvent(new CustomEvent('tokenRefreshed', {
        detail: { accessToken: newAccess }
      }));

      return true;

    } catch (err) {
      console.error('[TOKEN_REFRESH] ❌ FAILED:', err.message);
      
      if (err.response?.status === 401) {
        console.warn('[TOKEN_REFRESH] ❌ 401 - logging out');
        localStorage.clear();
        window.location.href = '/';
      }
      
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [canRefresh]);

  // ── Continuous token checker ───────────────────────────────────────────────
  const startTokenChecker = useCallback(() => {
    console.log('[TOKEN_CHECKER] 🚀 Starting continuous checker (every 5s)');
    
    if (checkTimerRef.current) {
      clearInterval(checkTimerRef.current);
    }

    const checkToken = () => {
      if (!mountedRef.current) return;

      const tokenStatus = getTokenStatus();
      const timeSinceActivity = lastActivityRef.current 
        ? Math.round((Date.now() - lastActivityRef.current) / 1000)
        : 999;

      // Log current status every 30 seconds
      if (!window._lastStatusLog || Date.now() - window._lastStatusLog > 30000) {
        console.log('[TOKEN_CHECKER] ┌──────────────────────────────────┐');
        console.log(`[TOKEN_CHECKER] │ Status: ${tokenStatus.status.padEnd(15)} │`);
        console.log(`[TOKEN_CHECKER] │ Time left: ${Math.round(tokenStatus.timeLeft/1000)}s`.padEnd(35) + '│');
        console.log(`[TOKEN_CHECKER] │ Last activity: ${timeSinceActivity}s ago`.padEnd(35) + '│');
        console.log(`[TOKEN_CHECKER] │ User: ${wasActiveRecently() ? 'ACTIVE' : 'IDLE'}`.padEnd(35) + '│');
        console.log('[TOKEN_CHECKER] └──────────────────────────────────┘');
        window._lastStatusLog = Date.now();
      }

      // Handle different statuses
      if (tokenStatus.status === 'expired_hard') {
        console.warn('[TOKEN_CHECKER] ❌ Token expired beyond grace — logging out');
        localStorage.clear();
        window.location.href = '/';
        return;
      }

      if (tokenStatus.status === 'missing' || tokenStatus.status === 'invalid') {
        console.warn('[TOKEN_CHECKER] ❌ No valid token — logging out');
        localStorage.clear();
        window.location.href = '/';
        return;
      }

      // Refresh if needed
      if (tokenStatus.shouldRefresh && wasActiveRecently()) {
        console.log('[TOKEN_CHECKER] ⚡ Conditions met - refreshing token');
        console.log(`[TOKEN_CHECKER] → Time left: ${Math.round(tokenStatus.timeLeft/1000)}s`);
        console.log(`[TOKEN_CHECKER] → User active: YES`);
        refreshAccessToken('active_user');
      }
    };

    // Check immediately
    checkToken();
    
    // Then check every 5 seconds
    checkTimerRef.current = setInterval(checkToken, CHECK_INTERVAL_MS);
    
  }, [getTokenStatus, wasActiveRecently, refreshAccessToken]);

  // ── Handle visibility change ───────────────────────────────────────────────
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== 'visible') {
      console.log('[VISIBILITY] 👋 Tab hidden');
      return;
    }

    console.log('[VISIBILITY] ═══════════════════════════════════════════');
    console.log('[VISIBILITY] 👀 Tab visible - checking token...');
    
    // Record activity when tab becomes visible
    recordActivity();

    const tokenStatus = getTokenStatus();
    
    console.log('[VISIBILITY] ┌──────────────────────────────────┐');
    console.log(`[VISIBILITY] │ Status: ${tokenStatus.status}`);
    console.log(`[VISIBILITY] │ Time left: ${Math.round(tokenStatus.timeLeft/1000)}s`);
    console.log('[VISIBILITY] └──────────────────────────────────┘');

    // Token expired beyond grace period
    if (tokenStatus.status === 'expired_hard' || 
        tokenStatus.status === 'missing' || 
        tokenStatus.status === 'invalid') {
      console.warn('[VISIBILITY] ❌ Token expired/invalid — logging out');
      console.log('[VISIBILITY] ═══════════════════════════════════════════');
      localStorage.clear();
      window.location.href = '/';
      return;
    }

    // Token expired but within grace OR expiring soon - refresh immediately
    if (tokenStatus.status === 'expired_grace' || tokenStatus.shouldRefresh) {
      console.log('[VISIBILITY] ⚡ Refreshing immediately (user returned)');
      console.log('[VISIBILITY] ═══════════════════════════════════════════');
      refreshAccessToken('tab_visible');
      return;
    }

    console.log('[VISIBILITY] ✅ Token still valid');
    console.log('[VISIBILITY] ═══════════════════════════════════════════');
    
  }, [getTokenStatus, refreshAccessToken, recordActivity]);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('[TOKEN_REFRESH] 🚫 No logged-in user — hook inactive');
      return;
    }

    console.log('[TOKEN_REFRESH] ═══════════════════════════════════════════');
    console.log('[TOKEN_REFRESH] 🚀 ACTIVITY-BASED TOKEN REFRESH INITIALIZED');
    console.log('[TOKEN_REFRESH] 📋 Configuration:');
    console.log(`[TOKEN_REFRESH]    • Check interval: ${CHECK_INTERVAL_MS/1000}s`);
    console.log(`[TOKEN_REFRESH]    • Activity window: ${ACTIVITY_WINDOW_MS/1000}s`);
    console.log(`[TOKEN_REFRESH]    • Min refresh interval: ${MIN_REFRESH_INTERVAL_MS/1000}s`);
    console.log(`[TOKEN_REFRESH]    • Grace period: ${GRACE_PERIOD_MS/1000}s`);
    console.log('[TOKEN_REFRESH] ═══════════════════════════════════════════');
    
    // Check initial token status
    const initialStatus = getTokenStatus();
    console.log(`[TOKEN_REFRESH] Initial status: ${initialStatus.status}`);
    console.log(`[TOKEN_REFRESH] Time left: ${Math.round(initialStatus.timeLeft/1000)}s`);
    
    if (initialStatus.status === 'expired_hard' || 
        initialStatus.status === 'missing' || 
        initialStatus.status === 'invalid') {
      console.warn('[TOKEN_REFRESH] ❌ Token expired/invalid — logging out');
      localStorage.clear();
      window.location.href = '/';
      return;
    }

    // Record initial activity
    recordActivity();

    // Set up activity listeners
    ACTIVITY_EVENTS.forEach(e => {
      window.addEventListener(e, recordActivity, { passive: true });
    });

    // Start the continuous checker
    startTokenChecker();

    // Listen for events from interceptor
    const handleTokenRefreshed = (event) => {
      if (event.detail?.accessToken) {
        console.log('[TOKEN_REFRESH] 📡 Received refresh event from interceptor');
        lastRefreshRef.current = Date.now();
      }
    };
    window.addEventListener('tokenRefreshed', handleTokenRefreshed);

    // Handle visibility and focus
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('online', handleVisibilityChange);

    return () => {
      console.log('[TOKEN_REFRESH] 🛑 CLEANUP');
      mountedRef.current = false;
      
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, recordActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('online', handleVisibilityChange);
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
      
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
        checkTimerRef.current = null;
      }
    };
  }, [recordActivity, startTokenChecker, handleVisibilityChange, getTokenStatus]);

  return { refreshAccessToken };
};

export default useProactiveTokenRefresh;