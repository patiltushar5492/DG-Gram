import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import { LogIn, Phone, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Login() {
  // AuthContext मधून login फंक्शन सुरक्षितपणे घेणे
  const { login } = useAuth() || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.identifier || !formData.password) {
      setErrorMsg('कृपया मोबाईल क्रमांक / ईमेल आणि पासवर्ड प्रविष्ट करा.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password
        })
      });

      setLoading(false);

      if (res && res.success && res.token && res.user) {
        // १. सर्वात महत्त्वाचे: AuthContext मधील login फंक्शन कॉल करणे
        if (login) {
          login(res.user, res.token);
        }

        // २. सर्व बॅकअप की मध्ये टोकन आणि युजर डेटा सेव्ह करणे जेणेकरून कधीही एरर येणार नाही
        localStorage.setItem('dg_gram_token', res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('dg_gram_user', JSON.stringify(res.user));

        // ३. यशस्वी लॉगिन झाल्यावर डॅशबोर्डवर रीडायरेक्ट करणे
        navigate('/dashboard');
      } else {
        setErrorMsg(res?.message || 'लॉगिन अयशस्वी. कृपया मोबाईल क्रमांक किंवा पासवर्ड तपासा.');
      }
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      setErrorMsg('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <LogIn className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            नागरिक / प्रशासक लॉगिन
          </h2>
          <p className="text-xs text-slate-500">
            ग्रामपंचायत गाळण बुद्रुक डिजिटल पोर्टल
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              मोबाईल क्रमांक किंवा ईमेल (Mobile / Email) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="identifier"
                placeholder="उदा. ९८२३०००००० किंवा email@gmail.com"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">
                पासवर्ड (Password) *
              </label>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-sm flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा (Sign In)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-100 space-y-2">
          <div>
            खाते नाहीये का?{' '}
            <Link to="/register" className="text-orange-600 font-bold hover:underline">
              येथे नवीन नोंदणी करा (Register)
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}