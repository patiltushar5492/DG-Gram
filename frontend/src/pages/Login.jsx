import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import {
  Lock, Mail, RefreshCw, ShieldCheck, AlertCircle,
  KeyRound, ArrowRight, Eye, EyeOff, ShieldAlert
} from 'lucide-react';

export default function Login() {
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Captcha state
  const [captchaData, setCaptchaData] = useState({ captchaId: '', captchaSvg: '' });
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  // Load captcha on mount
  useEffect(() => {
    loadCaptcha();
  }, []);

  // ── Fetch a fresh captcha from backend ──────────────────────────────────────
  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    setCaptchaInput('');
    try {
      const res = await apiRequest('/auth/captcha');
      if (res && res.captchaId && res.captchaSvg) {
        setCaptchaData({ captchaId: res.captchaId, captchaSvg: res.captchaSvg });
      }
    } catch (err) {
      console.error('Captcha load error:', err);
    } finally {
      setCaptchaLoading(false);
    }
  };

  // ── Quick-fill for demo/testing ─────────────────────────────────────────────
  const fillAdmin = () => {
    setEmail('admin@grampanchayat.gov.in');
    setPassword('Admin@123');
  };
  const fillCitizen = () => {
    setEmail('citizen@example.com');
    setPassword('Citizen@123');
  };

  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('कृपया ईमेल किंवा मोबाईल क्रमांक आणि पासवर्ड प्रविष्ट करा.');
      return;
    }
    if (!captchaInput.trim()) {
      setErrorMsg('कृपया सुरक्षा कोड (कॅप्चा) प्रविष्ट करा.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          identifier: email.trim(),
          password,
          captchaId: captchaData.captchaId,
          captchaCode: captchaInput.trim()
        })
      });

      setLoading(false);

      if (res && res.success && res.token && res.user) {
        login(res.user, res.token);
        const destination = (res.user.role === 'admin' || res.user.isAdmin === true) ? '/admin' : '/dashboard';
        navigate(destination, { replace: true });
      } else {
        setErrorMsg(res?.message || 'लॉगिन अयशस्वी. कृपया माहिती तपासा.');
        loadCaptcha(); // Refresh captcha on failure
      }
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      setErrorMsg('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.');
      loadCaptcha();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">

        {/* ── Header Card ── */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 shadow-lg shadow-orange-200 mx-auto">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              सुरक्षित लॉगिन
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ग्रामपंचायत गाळण बुद्रुक · डिजिटल प्रशासन पोर्टल
            </p>
          </div>
        </div>

        {/* ── Main Login Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-7 space-y-5">

          {/* Quick-fill pills (demo helpers) */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-1.5">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> डेमो क्रेडेन्शियल्स (Demo Quick Fill)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillAdmin}
                className="flex-1 text-[11px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-800 py-1.5 rounded-xl border border-orange-200 transition-colors cursor-pointer"
              >
                🔑 प्रशासक (Admin) भरा
              </button>
              <button
                type="button"
                onClick={fillCitizen}
                className="flex-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                👤 नागरिक (Citizen) भरा
              </button>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email / Mobile field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> ईमेल पत्ता किंवा मोबाईल क्रमांक *
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="उदा. nagrik@gmail.com किंवा ९४२२००००००"
                required
                autoComplete="username"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> पासवर्ड *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Captcha section */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" /> सुरक्षा कोड (Captcha) *
              </label>
              <div className="flex gap-2 items-center mb-2">
                {/* SVG Captcha Display */}
                <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center min-h-[52px]">
                  {captchaLoading ? (
                    <span className="text-xs text-slate-400 animate-pulse">लोड होत आहे...</span>
                  ) : captchaData.captchaSvg ? (
                    /*
                     * IMPORTANT: The backend returns captchaSvg as a data URI
                     * (data:image/svg+xml;utf8,...). We must render it as an <img>
                     * with src=... NOT via dangerouslySetInnerHTML — doing so would
                     * inject the data URI as literal text, causing overlap/mess.
                     */
                    <img
                      src={captchaData.captchaSvg}
                      alt="captcha"
                      className="w-full h-auto block select-none pointer-events-none"
                      draggable={false}
                      style={{ minHeight: 50, maxHeight: 60 }}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">कॅप्चा उपलब्ध नाही</span>
                  )}
                </div>
                {/* Refresh button */}
                <button
                  type="button"
                  onClick={loadCaptcha}
                  disabled={captchaLoading}
                  title="नवीन कॅप्चा मिळवा"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${captchaLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="वरील कोड येथे टाइप करा..."
                required
                autoComplete="off"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white outline-none transition-all tracking-widest font-mono"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold py-3 rounded-xl shadow-md shadow-orange-200 transition-all cursor-pointer disabled:opacity-60 text-sm flex items-center justify-center gap-2 mt-1"
            >
              <span>{loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा (Sign In)'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Register link */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            खाते नाहीये का?{' '}
            <Link to="/register" className="text-orange-600 font-bold hover:underline">
              येथे नवीन नोंदणी करा →
            </Link>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-[10px] text-slate-400">
          🔒 हे पोर्टल SSL एन्क्रिप्शनने सुरक्षित आहे · महाराष्ट्र शासन मान्यताप्राप्त
        </p>
      </div>
    </div>
  );
}
