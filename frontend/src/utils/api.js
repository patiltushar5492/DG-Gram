// ============================================================
// API Utility — Centralized request helper for DG Gram Portal
// ============================================================

// Auto-detect environment: local dev uses Vite proxy (/api → localhost:5000)
// Production (Vercel + Render) uses VITE_API_URL env variable
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

/**
 * Universal API request helper.
 * - Attaches JWT token from localStorage automatically.
 * - Handles both JSON and FormData (multipart file uploads).
 * - Returns the parsed JSON response or an error object.
 */
export async function apiRequest(endpoint, options = {}) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${path}`;

  // Always read the single authoritative token key
  const token = localStorage.getItem('dg_gram_token');

  const isFormData = options.body instanceof FormData;

  const headers = {
    // Don't set Content-Type for FormData — browser sets it with boundary automatically
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return { success: false, message: 'सर्व्हरशी संपर्क साधण्यात त्रुटी आली. (Network error)' };
  }
}

/**
 * Resolve an uploaded file URL to an absolute URL.
 * Works in both local dev and production environments.
 */
export function getFileUrl(fileUrl) {
  if (!fileUrl) return '#';
  if (fileUrl.startsWith('http') || fileUrl.startsWith('blob')) return fileUrl;
  const cleanPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}${cleanPath}`;
  }
  // Local dev: Vite proxies /uploads → localhost:5000
  return cleanPath;
}
