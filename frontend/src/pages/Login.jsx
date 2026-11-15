import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import { Lock, Mail, RefreshCw, ShieldCheck, AlertCircle, KeyRound, CheckCircle } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaData, setCaptchaData] = useState({ captchaId: '', captchaSvg: '' });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch captcha on component load
  const loadCaptcha = async () => {
    const res = await apiRequest('/auth/captcha');
    if (res.success) {
      setCaptchaData({
        captchaId: res.captchaId,
        captchaSvg: res.captchaSvg
      });
      setCaptchaInput('');
    }
  };

  useEffect(() => {
    loadCaptcha();
    // Redirect if already logged in
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('कृपया ईमेल व पासवर्ड टाका.');
      return;
    }

    if (!captchaInput) {
      setErrorMsg('कृपया सुरक्षा कॅप्चा कोड टाका.');
      return;
    }

    setLoading(true);
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password,
        captchaId: captchaData.captchaId,
        captchaCode: captchaInput.trim()
      })
    });

    setLoading(false);

    if (res.success && res.token && res.user) {
      // 📌 हे टोकन आणि युजर ब्राउझरमध्ये सेव्ह करणे अत्यंत आवश्यक आहे!
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      login(res.user, res.token);

      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMsg(res.message || 'लॉगिन अयशस्वी. कृपया तपशील तपासा.');
      loadCaptcha();
    }
  };

  // // Quick fill default admin credentials helper for easy testing
  // const fillAdmin = () => {
  //   setEmail('admin@grampanchayat.gov.in');
  //   setPassword('Admin@123');
  // };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            पोर्टल लॉगिन (Portal Login)
          </h2>
          <p className="text-xs text-slate-500">
            ग्रामपंचायत गाळण बुद्रुक ई-गव्हर्नन्स प्रणाली
          </p>
        </div>

        {/* Default Admin Pill for Quick Verification */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs flex justify-between items-center text-amber-900">
          <div>
            <span className="font-bold block">प्रशासक लॉगिन (Default Admin):</span>
            <span className="font-mono text-[11px] text-slate-600">admin@grampanchayat.gov.in / Admin@123</span>
          </div>
          <button
            type="button"
            onClick={fillAdmin}
            className="text-[11px] bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1.5 rounded-lg shrink-0 cursor-pointer"
          >
            भरा (Fill)
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ईमेल आयडी (Email ID) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="उदा. admin@grampanchayat.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              पासवर्ड (Password) *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Dynamic Captcha Verification Box */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              सुरक्षा कॅप्चा पडताळणी (Security Captcha) *
            </label>

            <div className="flex items-center gap-3">
              {/* Captcha Image */}
              <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
                {captchaData.captchaSvg ? (
                  <img src={captchaData.captchaSvg} alt="Captcha" className="h-10 w-36 object-contain" />
                ) : (
                  <div className="h-10 w-36 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    लोड होत आहे...
                  </div>
                )}
              </div>

              {/* Refresh Captcha Button */}
              <button
                type="button"
                onClick={loadCaptcha}
                title="नवीन कॅप्चा मिळवा"
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="वरील कोड येथे टाका (Enter Captcha)"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 font-mono font-bold tracking-wider uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-sm"
          >
            {loading ? 'पडताळणी होत आहे...' : 'सुरक्षित लॉगिन करा (Login)'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          अद्याप खाते नाही का?{' '}
          <Link to="/register" className="text-orange-600 font-bold hover:underline">
            येथे नवीन नागरिक नोंदणी करा (Register with OTP)
          </Link>
        </div>

      </div>
    </div>
  );
}
