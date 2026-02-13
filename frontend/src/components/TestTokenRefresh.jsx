import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import api from './ApiRefresh';
import API_BASE_URL from '../config';

const TestTokenRefresh = () => {
  const [logs, setLogs]               = useState([]);
  const [tokenInfo, setTokenInfo]     = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [countdown, setCountdown]     = useState(null);

  // ── Logging helper ─────────────────────────────────────────────────────────
  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
  }, []);

  // ── Read & decode both tokens from localStorage ────────────────────────────
  const getTokenInfo = useCallback(() => {
    const accessToken  = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken) {
      setTokenInfo(null);
      return null;
    }

    try {
      const decoded    = jwtDecode(accessToken);
      const expiresAt  = new Date(decoded.exp * 1000);
      const issuedAt   = new Date(decoded.iat * 1000);
      const now        = new Date();
      const timeLeft   = Math.round((expiresAt - now) / 1000);

      // Also decode refresh token expiry if present
      let refreshInfo = null;
      if (refreshToken) {
        try {
          const rDecoded   = jwtDecode(refreshToken);
          const rExpiresAt = new Date(rDecoded.exp * 1000);
          const rTimeLeft  = Math.round((rExpiresAt - now) / 1000);
          refreshInfo = {
            expiresAt : rExpiresAt.toLocaleTimeString(),
            timeLeftSeconds: rTimeLeft,
            isExpired : rTimeLeft <= 0,
          };
        } catch (_) {
          // refresh token may not be a JWT (opaque) — that's fine
        }
      }

      const info = {
        userId          : decoded.user_id,
        issuedAt        : issuedAt.toLocaleTimeString(),
        expiresAt       : expiresAt.toLocaleTimeString(),
        timeLeftSeconds : timeLeft,
        timeLeftMinutes : Math.round(timeLeft / 60),
        isExpired       : timeLeft <= 0,
        hasRefreshToken : !!refreshToken,
        refreshInfo,
        // show last 10 chars so you can confirm the token actually changed
        accessTokenTail : accessToken.slice(-10),
        refreshTokenTail: refreshToken ? refreshToken.slice(-10) : null,
      };

      setTokenInfo(info);
      return info;
    } catch (error) {
      addLog(`❌ Error decoding token: ${error.message}`, 'error');
      return null;
    }
  }, [addLog]);

  // ── Live countdown while monitoring ───────────────────────────────────────
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const info = getTokenInfo();
      if (info) setCountdown(info.timeLeftSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, getTokenInfo]);

  // ── Manual Refresh ─────────────────────────────────────────────────────────
  // BUG FIX 1: was using require() instead of imported axios + API_BASE_URL
  // BUG FIX 2: was never saving the rotated refresh token
  // BUG FIX 3: was not calling getTokenInfo() after saving, so UI didn't update
  const testManualRefresh = async () => {
    addLog('=== MANUAL TOKEN REFRESH ===', 'info');

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      addLog('❌ No refresh token in localStorage!', 'error');
      return;
    }

    const oldAccess  = localStorage.getItem('accessToken');
    const oldDecoded = jwtDecode(oldAccess);
    addLog(`Old access token expires : ${new Date(oldDecoded.exp * 1000).toLocaleTimeString()}`, 'info');
    addLog(`Old access token tail    : ...${oldAccess.slice(-10)}`, 'info');
    addLog(`Old refresh token tail   : ...${refreshToken.slice(-10)}`, 'info');
    addLog(`Calling: ${API_BASE_URL}api/auth/token/refresh/`, 'info');

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/auth/token/refresh/`,
        { refresh: refreshToken }
      );

      const newAccessToken  = response.data.access;
      // ✅ FIX 2: SimpleJWT rotates refresh tokens — the old one is blacklisted.
      // The new refresh token comes back in response.data.refresh.
      // If we don't save it, the NEXT refresh call will 401.
      const newRefreshToken = response.data.refresh;

      if (!newAccessToken) {
        addLog('❌ Response had no access token!', 'error');
        addLog(`Response keys: ${Object.keys(response.data).join(', ')}`, 'error');
        return;
      }

      // ── Save tokens ──────────────────────────────────────────────────────
      localStorage.setItem('accessToken', newAccessToken);
      addLog('✅ New access token saved to localStorage', 'success');

      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
        addLog('✅ New (rotated) refresh token saved to localStorage', 'success');
      } else {
        addLog('⚠️ No new refresh token in response (rotation may be disabled)', 'warning');
        addLog('   Check ROTATE_REFRESH_TOKENS in Django settings.py', 'warning');
      }

      // ── Log what changed ─────────────────────────────────────────────────
      const newDecoded = jwtDecode(newAccessToken);
      addLog(`New access token expires : ${new Date(newDecoded.exp * 1000).toLocaleTimeString()}`, 'success');
      addLog(`New access token tail    : ...${newAccessToken.slice(-10)}`, 'success');
      if (newRefreshToken) {
        addLog(`New refresh token tail   : ...${newRefreshToken.slice(-10)}`, 'success');
      }
      addLog(
        `Token extended by: ${Math.round((newDecoded.exp - oldDecoded.exp) / 60)} minutes`,
        'success'
      );

      // ✅ FIX 3: Re-read tokens and update UI
      getTokenInfo();

    } catch (error) {
      addLog(`❌ Refresh failed: ${error.message}`, 'error');
      if (error.response) {
        addLog(`   Status : ${error.response.status}`, 'error');
        addLog(`   Body   : ${JSON.stringify(error.response.data)}`, 'error');

        if (error.response.status === 401) {
          addLog('⚠️ 401 = refresh token is expired or already used (blacklisted)', 'warning');
          addLog('   Solution: log out and log back in to get fresh tokens', 'warning');
        }
      }
    }
  };

  // ── Test Interceptor (force 401 → auto-refresh → retry) ───────────────────
  const testAutoRefresh = async () => {
    addLog('=== TEST INTERCEPTOR (AUTO-REFRESH) ===', 'info');

    const token = localStorage.getItem('accessToken');
    if (!token) {
      addLog('❌ No access token found!', 'error');
      return;
    }

    const decoded = jwtDecode(token);
    const userId  = decoded.user_id;
    addLog(`User ID from token: ${userId}`, 'info');

    // Save originals before corrupting
    const originalAccess  = token;
    const originalRefresh = localStorage.getItem('refreshToken');

    addLog('Corrupting access token to force a 401...', 'warning');
    const fakeToken = 'invalid_token_' + Date.now();
    localStorage.setItem('accessToken', fakeToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${fakeToken}`;

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      addLog(`Calling: api/auth/user/get_user_data/${userId}/`, 'info');
      addLog('Expecting: 401 → interceptor refreshes → retries → success', 'info');

      const response = await api.get(`api/auth/user/get_user_data/${userId}/`);

      addLog('✅ INTERCEPTOR WORKED! Token was auto-refreshed and request retried.', 'success');
      addLog(`   User: ${response.data.first_name || ''} ${response.data.last_name || ''}`.trim() || 'N/A', 'success');

      // ✅ Update UI with the new tokens the interceptor saved
      getTokenInfo();

    } catch (err) {
      addLog('❌ Interceptor test failed — restoring original tokens', 'error');
      localStorage.setItem('accessToken',  originalAccess);
      localStorage.setItem('refreshToken', originalRefresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${originalAccess}`;
      addLog(`Error: ${err.message}`, 'error');
      if (err.response) {
        addLog(`Status: ${err.response.status}`, 'error');
      }
    }
  };

  // ── Real API call with current token ──────────────────────────────────────
  const testRealAPICall = async () => {
    addLog('=== REAL API CALL ===', 'info');

    const token = localStorage.getItem('accessToken');
    if (!token) {
      addLog('❌ No access token!', 'error');
      return;
    }

    const decoded = jwtDecode(token);
    const userId  = decoded.user_id;
    addLog(`Calling get_user_data for user ${userId}...`, 'info');

    try {
      const response = await api.get(`api/auth/user/get_user_data/${userId}/`);
      addLog('✅ API call successful!', 'success');
      addLog(`User  : ${response.data.first_name || 'N/A'} ${response.data.last_name || 'N/A'}`, 'success');
      addLog(`Email : ${response.data.email     || 'N/A'}`, 'info');
      addLog(`Role  : ${response.data.role_category || 'N/A'}`, 'info');
    } catch (error) {
      addLog(`❌ API call failed: ${error.message}`, 'error');
      if (error.response) {
        addLog(`Status : ${error.response.status}`, 'error');
        addLog(`URL    : ${error.config?.url}`, 'error');
      }
    }
  };

  // ── Diagnose token state ───────────────────────────────────────────────────
  const diagnoseTokens = () => {
    addLog('=== TOKEN DIAGNOSIS ===', 'info');

    const accessToken  = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken)  addLog('❌ No access token in localStorage',  'error');
    if (!refreshToken) addLog('❌ No refresh token in localStorage', 'error');
    if (!accessToken || !refreshToken) return;

    try {
      const aDecoded  = jwtDecode(accessToken);
      const now       = Date.now();
      const aTimeLeft = Math.round((aDecoded.exp * 1000 - now) / 1000);

      addLog(`Access token tail    : ...${accessToken.slice(-10)}`,  'info');
      addLog(`Access token issued  : ${new Date(aDecoded.iat * 1000).toLocaleTimeString()}`, 'info');
      addLog(`Access token expires : ${new Date(aDecoded.exp * 1000).toLocaleTimeString()}`, 'info');
      addLog(`Access time left     : ${aTimeLeft}s`, aTimeLeft <= 0 ? 'error' : 'info');

      addLog(`Refresh token tail   : ...${refreshToken.slice(-10)}`, 'info');
      try {
        const rDecoded  = jwtDecode(refreshToken);
        const rTimeLeft = Math.round((rDecoded.exp * 1000 - now) / 1000);
        addLog(`Refresh token expires: ${new Date(rDecoded.exp * 1000).toLocaleTimeString()}`, 'info');
        addLog(`Refresh time left    : ${Math.round(rTimeLeft / 3600)}h ${Math.round((rTimeLeft % 3600) / 60)}m`, rTimeLeft <= 0 ? 'error' : 'info');
      } catch (_) {
        addLog('Refresh token is opaque (not a JWT) — cannot decode', 'warning');
      }

      if (aTimeLeft <= 0) {
        addLog('⚠️ Access token is EXPIRED — manual refresh should renew it', 'warning');
      } else if (aTimeLeft < 300) {
        addLog('⚠️ Access token expires in < 5 min — proactive hook should refresh soon', 'warning');
      } else {
        addLog('✅ Access token is healthy', 'success');
      }
    } catch (err) {
      addLog(`❌ Failed to decode token: ${err.message}`, 'error');
    }
  };

  const clearAndLogout = () => {
    if (window.confirm('Clear all tokens and logout?')) {
      localStorage.clear();
      addLog('🗑️ All tokens cleared', 'info');
      setTimeout(() => { window.location.href = '/login'; }, 1000);
    }
  };

  // Boot
  useEffect(() => { getTokenInfo(); }, [getTokenInfo]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px',
      margin: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'monospace'
    }}>
      <h2 style={{ color: '#E8092E', marginTop: 0, borderBottom: '3px solid #E8092E', paddingBottom: '10px' }}>
        🔐 Token Refresh Testing Dashboard
      </h2>

      {/* ── Token Status Card ── */}
      <div style={{
        backgroundColor : tokenInfo?.isExpired ? '#ffebee' : '#e8f5e9',
        border          : `2px solid ${tokenInfo?.isExpired ? '#f44336' : '#4caf50'}`,
        borderRadius: '8px', padding: '15px', marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>📊 Current Token Status</h3>
        {tokenInfo ? (
          <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
            <div><strong>User ID       :</strong> {tokenInfo.userId}</div>
            <div><strong>Issued At     :</strong> {tokenInfo.issuedAt}</div>
            <div><strong>Expires At    :</strong> {tokenInfo.expiresAt}</div>

            {/* Access token tail — changes visually when refresh succeeds */}
            <div>
              <strong>Access tail   :</strong>{' '}
              <span style={{ fontFamily: 'monospace', background: '#fff', padding: '1px 4px', borderRadius: 3 }}>
                ...{tokenInfo.accessTokenTail}
              </span>
            </div>

            {tokenInfo.refreshTokenTail && (
              <div>
                <strong>Refresh tail  :</strong>{' '}
                <span style={{ fontFamily: 'monospace', background: '#fff', padding: '1px 4px', borderRadius: 3 }}>
                  ...{tokenInfo.refreshTokenTail}
                </span>
              </div>
            )}

            <div style={{
              fontSize: '18px', fontWeight: 'bold', marginTop: '6px',
              color: tokenInfo.isExpired ? '#f44336' : tokenInfo.timeLeftSeconds < 60 ? '#ff9800' : '#4caf50'
            }}>
              {tokenInfo.isExpired
                ? '❌ EXPIRED'
                : `⏱️ ${tokenInfo.timeLeftSeconds}s (${tokenInfo.timeLeftMinutes}m) remaining`}
            </div>

            <div><strong>Has Refresh Token:</strong> {tokenInfo.hasRefreshToken ? '✅ Yes' : '❌ No'}</div>

            {tokenInfo.refreshInfo && (
              <div style={{ color: tokenInfo.refreshInfo.isExpired ? '#f44336' : '#555' }}>
                <strong>Refresh expires:</strong> {tokenInfo.refreshInfo.expiresAt}
                {' '}({Math.round(tokenInfo.refreshInfo.timeLeftSeconds / 3600)}h left)
              </div>
            )}

            {isMonitoring && countdown !== null && (
              <div style={{
                marginTop: '10px', padding: '10px',
                backgroundColor : countdown < 30 ? '#fff3cd' : '#d1ecf1',
                borderRadius: '6px', fontSize: '14px', fontWeight: 'bold',
                color: countdown < 30 ? '#856404' : '#0c5460'
              }}>
                {countdown < 30 ? '⚠️ EXPIRING SOON: ' : '⏳ Live Countdown: '}{countdown}s
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: '#666' }}>No access token found — please log in</div>
        )}
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => { getTokenInfo(); addLog('Token info refreshed', 'info'); }} style={btn('#4CAF50')}>
          🔄 Refresh Info
        </button>
        <button onClick={() => setIsMonitoring(v => !v)} style={btn(isMonitoring ? '#f44336' : '#2196F3')}>
          {isMonitoring ? '⏸️ Stop Monitor' : '▶️ Start Monitor'}
        </button>
        <button onClick={testManualRefresh}  style={btn('#FF9800')}>🔄 Manual Refresh</button>
        <button onClick={testAutoRefresh}    style={btn('#9C27B0')}>🛡️ Test Interceptor</button>
        <button onClick={testRealAPICall}    style={btn('#00BCD4')}>📡 Test API Call</button>
        <button onClick={diagnoseTokens}     style={btn('#607D8B')}>🔍 Diagnose</button>
        <button onClick={clearAndLogout}     style={btn('#E8092E')}>🗑️ Clear & Logout</button>
        <button onClick={() => setLogs([])}  style={btn('#78909C')}>🧹 Clear Logs</button>
      </div>

      {/* ── Log console ── */}
      <div style={{
        backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px',
        borderRadius: '8px', maxHeight: '400px', overflowY: 'auto',
        fontSize: '11px', fontFamily: 'Consolas, Monaco, monospace'
      }}>
        <div style={{
          marginBottom: '10px', color: '#4CAF50', fontWeight: 'bold',
          position: 'sticky', top: 0, backgroundColor: '#1e1e1e', paddingBottom: '5px'
        }}>
          📋 LOGS ({logs.length}):
        </div>
        {logs.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No logs yet. Click a button to start testing...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{
              padding: '4px 0', borderBottom: '1px solid #2a2a2a',
              color: log.type === 'error'   ? '#ff5252'
                   : log.type === 'success' ? '#69f0ae'
                   : log.type === 'warning' ? '#ffd740'
                   : '#e0e0e0'
            }}>
              <span style={{ color: '#757575' }}>[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>

      {/* ── Instructions ── */}
      <div style={{
        backgroundColor: '#e3f2fd', border: '1px solid #2196f3',
        borderRadius: '6px', padding: '15px', marginTop: '20px', fontSize: '12px'
      }}>
        <h4 style={{ marginTop: 0, color: '#1976d2' }}>📖 What each button does:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Refresh Info</strong>     — re-read tokens from localStorage and update the card</li>
          <li><strong>Start Monitor</strong>    — live countdown every second</li>
          <li><strong>Manual Refresh</strong>   — calls <code>/api/auth/token/refresh/</code> directly and saves both new tokens</li>
          <li><strong>Test Interceptor</strong> — corrupts the access token, forces 401, watches ApiRefresh.js auto-recover</li>
          <li><strong>Test API Call</strong>    — real authenticated request with current token</li>
          <li><strong>Diagnose</strong>         — prints full token details including tails so you can see if they changed</li>
          <li><strong>Clear &amp; Logout</strong>   — wipes localStorage and redirects</li>
        </ol>
        <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#fff3cd', borderRadius: '4px', color: '#856404' }}>
          💡 <strong>Tip:</strong> Watch the <em>Access tail</em> and <em>Refresh tail</em> values in the card — they change after a successful refresh, confirming both tokens were updated.
        </div>
      </div>
    </div>
  );
};

const btn = (bg) => ({
  padding: '12px 16px', backgroundColor: bg, color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer',
  fontWeight: 'bold', fontSize: '12px', fontFamily: 'monospace',
  transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
});

export default TestTokenRefresh;