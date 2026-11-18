// ============================================================
// API Utility — Centralized request helper for DG Gram Portal
// ============================================================

// Auto-detect environment:
// - Local dev:    Vite proxy forwards /api → localhost:5000 (no VITE_API_URL set)
// - Production:   VITE_API_URL is set to the Render backend URL (e.g. https://dg-gram.onrender.com)
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

/**
 * Universal API request helper.
 * - Attaches JWT token from localStorage automatically (key: 'dg_gram_token').
 * - Handles both JSON bodies and FormData (multipart file uploads).
 * - On 401/403: clears stale token so the user gets a clean login prompt
 *   instead of an infinite redirect loop.
 * - Returns the parsed JSON response, or a safe error object on network failure.
 */
export async function apiRequest(endpoint, options = {}) {
  const urlPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${urlPath}`;

  // Single authoritative token key — must match AuthContext.login() write key
  const token = localStorage.getItem('dg_gram_token');

  const isFormData = options.body instanceof FormData;

  const headers = {
    // Do NOT set Content-Type for FormData; browser sets it with boundary automatically
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    // Attach Bearer token when available
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Allow caller to override specific headers
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // ── Handle expired / invalid token gracefully ──────────────────────────
    // 401 = missing token, 403 = token invalid or expired
    // Clear stale localStorage so the app doesn't silently retry with a bad token.
    if (response.status === 401 || response.status === 403) {
      const data = await response.json().catch(() => ({}));
      // Only clear token if the backend explicitly says the token is bad.
      // Don't clear on other 401s (e.g. admin-only routes for a citizen).
      if (data?.message && (
        data.message.includes('सत्र संपले') ||   // "session expired"
        data.message.includes('Invalid token') ||
        data.message.includes('Access token missing')
      )) {
        localStorage.removeItem('dg_gram_token');
        localStorage.removeItem('dg_gram_user');
        // Reload so React / AuthContext picks up the cleared state
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
      return data;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Network / parse error — do NOT clear token or redirect; it may be a backend restart
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      message: 'सर्व्हरशी संपर्क साधण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा. (Network error)'
    };
  }
}

/**
 * Resolve an uploaded file URL to an absolute URL.
 * Works in both local dev (Vite proxy) and production (Render).
 *
 * @param {string} fileUrl  - Relative path like /uploads/DOC-123.pdf, or already absolute
 * @returns {string}         - Fully qualified URL safe to pass to <a href> or window.open()
 */
export function getFileUrl(fileUrl) {
  if (!fileUrl) return '#';
  if (fileUrl.startsWith('http') || fileUrl.startsWith('blob')) return fileUrl;

  const cleanPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;

  if (import.meta.env.VITE_API_URL) {
    // Production: prepend Render backend origin
    return `${import.meta.env.VITE_API_URL}${cleanPath}`;
  }
  // Local dev: Vite proxies /uploads → localhost:5000; return as-is
  return cleanPath;
}

/**
 * Resolve a GR download URL to a fully-qualified absolute URL.
 * This is specifically for window.open() calls that open a NEW tab —
 * new tabs have NO Vite proxy, so relative /api paths will NOT work.
 *
 * @param {string} grId  - The GR document ID
 * @returns {string}      - Absolute URL to backend download endpoint
 */
export function getGRDownloadUrl(grId) {
  if (!grId) return '#';
  const backendOrigin = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${backendOrigin}/api/government-grs/${grId}/download`;
}
