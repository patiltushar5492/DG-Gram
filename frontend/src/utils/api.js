export async function apiRequest(endpoint, options = {}) {
  // ही ओळ Vercel वरून Render च्या बॅकएंडची लिंक ऑटोमॅटिक शोधेल
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const url = `${API_BASE_URL}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'सर्व्हरशी संपर्क साधण्यात त्रुटी आली.' };
  }
}