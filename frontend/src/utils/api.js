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
 * - Automatically injects JWT token from localStorage into Authorization header.
 * - Checks both 'dg_gram_token' and 'token' keys.
 * - Handles both JSON bodies and FormData (multipart file uploads).
 * - Safe and robust: never triggers unexpected page reloads or loops.
 */
export async function apiRequest(endpoint, options = {}) {
  const urlPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${urlPath}`;

  // Read from dg_gram_token with fallback to token
  const token = localStorage.getItem('dg_gram_token') || localStorage.getItem('token');

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
    const data = await response.json().catch(() => ({}));

    // If status is not OK, attach HTTP status for caller inspection without forcing reload
    if (!response.ok && typeof data === 'object') {
      data.httpStatus = response.status;
    }

    return data;
  } catch (error) {
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
 */
export function getFileUrl(fileUrl) {
  if (!fileUrl) return '#';
  if (fileUrl.startsWith('http') || fileUrl.startsWith('blob')) return fileUrl;

  const cleanPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;

  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}${cleanPath}`;
  }
  return cleanPath;
}

/**
 * Resolve a GR download URL to a fully-qualified absolute URL.
 */
export function getGRDownloadUrl(grId) {
  if (!grId) return '#';
  const backendOrigin = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${backendOrigin}/api/government-grs/${grId}/download`;
}
