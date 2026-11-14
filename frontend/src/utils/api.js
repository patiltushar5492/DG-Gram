export async function apiRequest(endpoint, options = {}) {
  // इथे थेट Render ची लाईव्ह लिंक फॉलबॅक म्हणून दिली आहे, त्यामुळे लोकलहोस्टचा विषयच संपला!
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dg-gram.onrender.com';
  
  const url = `${API_BASE_URL}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const token = localStorage.getItem('token');
  
  // जर फॉर्ममध्ये फाईल (FormData) असेल तर Content-Type ऑटोमॅटिक हँडल होईल
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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