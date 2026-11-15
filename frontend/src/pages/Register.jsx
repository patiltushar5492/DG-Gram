import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import { UserPlus, Phone, Mail, KeyRound, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  // 👇 येथे '|| {}' सेफ्टी चेक लावला आहे
  const { login } = useAuth() || {};
  const navigate = useNavigate();

  // Step 1: Citizen Details & Request OTP
  // Step 2: Verify OTP and Complete Registration
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: 'गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव'
  });

  const [otpInput, setOtpInput] = useState('');
  const [demoOtpNotice, setDemoOtpNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP to Mobile
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setErrorMsg('कृपया सर्व आवश्यक माहिती भरा.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('दोन्ही पासवर्ड जुळत नाहीत (Passwords do not match).');
      return;
    }

    if (formData.mobile.length < 10) {
      setErrorMsg('कृपया १० अंकी वैध मोबाईल क्रमांक प्रविष्ट करा.');
      return;
    }

    setLoading(true);
    const res = await apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier: formData.mobile, type: 'mobile' })
    });

    setLoading(false);

    if (res && res.success) {
      setStep(2);
      setSuccessMsg(res.message || 'ओटीपी पाठवला आहे.');
      if (res.demoOtp) {
        setDemoOtpNotice(res.demoOtp);
      }
    } else {
      setErrorMsg(res?.message || 'ओटीपी पाठवण्यात त्रुटी उद्भवली.');
    }
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpInput || otpInput.trim().length !== 6) {
      setErrorMsg('कृपया ६ अंकी अचूक ओटीपी कोड टाका.');
      return;
    }

    setLoading(true);

    // Verify OTP first
    const otpRes = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier: formData.mobile, otp: otpInput.trim() })
    });

    if (!otpRes || !otpRes.success) {
      setLoading(false);
      setErrorMsg(otpRes?.message || 'अवैध ओटीपी कोड.');
      return;
    }

    // Now register user
    const regRes = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        address: formData.address,
        verifiedOtp: true
      })
    });

    setLoading(false);

    if (regRes && regRes.success && regRes.token && regRes.user) {
      if (login) login(regRes.user, regRes.token);
      navigate('/dashboard');
    } else {
      setErrorMsg(regRes?.message || 'नोंदणी अयशस्वी. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            नागरिक नवीन नोंदणी (Citizen Registration)
          </h2>
          <p className="text-xs text-slate-500">
            ओटीपी (OTP) सुरक्षा पडताळणीसह अधिकृत खाते उघडा
          </p>
        </div>

        {/* Progress Step Bar */}
        <div className="flex items-center justify-between text-xs font-semibold px-4">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>तपशील</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>ओटीपी पडताळणी</span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                संपूर्ण नाव (Full Name) *
              </label>
              <input
                type="text"
                name="name"
                placeholder="उदा. राजेंद्र सोपान पाटील"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                मोबाईल क्रमांक (Mobile Number - OTP येईल) *
              </label>
              <input
                type="tel"
                name="mobile"
                placeholder="उदा. ९८२३००००००"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ईमेल आयडी (Email ID) *
              </label>
              <input
                type="email"
                name="email"
                placeholder="उदा. citizen@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                गावातील पत्ता (Address in Gadan Budruk)
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पासवर्ड (Password) *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पुन्हा टाका (Confirm) *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              <span>{loading ? 'ओटीपी पाठवत आहे...' : 'ओटीपी मिळवा व पुढे जा (Get OTP)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-orange-900 block">
                {formData.mobile} या मोबाईल क्रमांकावर ६ अंकी ओटीपी पाठवला आहे.
              </span>
              {demoOtpNotice && (
                <div className="mt-2 p-2 bg-white rounded-lg border border-orange-300 text-orange-800 font-mono font-bold flex justify-between items-center">
                  <span>डेमो चाचणी ओटीपी (Code):</span>
                  <span className="text-base tracking-widest text-slate-900">{demoOtpNotice}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ६ अंकी पडताळणी कोड (Enter 6-digit OTP) *
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-xl font-mono font-bold tracking-widest focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{loading ? 'पडताळणी होत आहे...' : 'ओटीपी पडताळा व खाते तयार करा'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-slate-500 hover:underline cursor-pointer"
            >
              मागे जा व मोबाईल क्रमांक बदला
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          आधीच खाते आहे का?{' '}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            येथे लॉगिन करा (Login)
          </Link>
        </div>

      </div>
    </div>
  );
}