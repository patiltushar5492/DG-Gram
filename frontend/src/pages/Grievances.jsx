import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import { AlertCircle, CheckCircle2, Clock, Send, ShieldAlert, MessageSquarePlus, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Grievances() {
  const { user } = useAuth();
  const [categories] = useState([
    'पिण्याचे पाणी पुरवठा',
    'पथदिवे व विद्युत समस्या (Street Lights)',
    'सांडपाणी व गटार स्वच्छता',
    'कचरा व घनकचरा व्यवस्थापन',
    'रस्ते दुरुस्ती व अडथळे',
    'आरोग्य व स्वच्छता',
    'इतर तक्रार'
  ]);

  const [formData, setFormData] = useState({
    category: categories[0],
    title: '',
    description: '',
    location: ''
  });

  const [myGrievances, setMyGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMyGrievances = async () => {
    if (!user) return;
    const res = await apiRequest('/grievances/my');
    if (res.success && res.grievances) {
      setMyGrievances(res.grievances);
    }
  };

  useEffect(() => {
    fetchMyGrievances();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('कृपया तक्रार नोंदवण्यासाठी प्रथम लॉगिन करा.');
      return;
    }

    if (!formData.title || !formData.description) {
      setErrorMsg('कृपया तक्रारीचा विषय व सविस्तर वर्णन भरा.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await apiRequest('/grievances/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    setLoading(false);

    if (res.success && res.grievance) {
      setSuccessMsg(`आपली तक्रार यशस्वीरित्या नोंदवली गेली आहे! ट्रॅकिंग क्रमांक: ${res.grievance.trackingId}`);
      setFormData({
        category: categories[0],
        title: '',
        description: '',
        location: ''
      });
      fetchMyGrievances();
    } else {
      setErrorMsg(res.message || 'त्रुटी उद्भवली.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-700 to-rose-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-2xl space-y-2">
          <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            नागरिक हक्क व उत्तरदायित्व
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            ऑनलाइन तक्रार निवारण मंच
          </h1>
          <p className="text-sm text-red-100 leading-relaxed">
            गावातील नागरी समस्यांची (पाणी, पथदिवे, रस्ते, स्वच्छता) थेट सरपंच व ग्रामसेवकांकडे नोंदणी करा आणि जलद निवारण मिळवा.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Complaint Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-red-600" />
              <span>नवीन तक्रार नोंदवा</span>
            </h3>
            <p className="text-xs text-slate-500">तक्रार नोंदवल्यानंतर २४ ते ४८ तासांत प्रत्यक्ष दखल घेतली जाईल.</p>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!user && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-xl text-xs flex justify-between items-center">
              <span>तक्रार नोंदवण्यासाठी लॉगिन आवश्यक आहे.</span>
              <Link to="/login" className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg">
                लॉगिन
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                तक्रारीची वर्गवारी (Category) *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                तक्रारीचा विषय (Subject / Title) *
              </label>
              <input
                type="text"
                placeholder="उदा. मारुती गल्लीतील पाईपलाईन लिकेज दुरुस्तीबाबत"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                समस्येचे अचूक ठिकाण (Exact Location) *
              </label>
              <input
                type="text"
                placeholder="उदा. मारुती मंदिर परिसर, वार्ड क्र. २"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                तक्रारीचे सविस्तर वर्णन (Detailed Description) *
              </label>
              <textarea
                rows={4}
                placeholder="समस्येचे नेमके स्वरूप व अडचणी सविस्तर लिहा..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !user}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'नोंद होत आहे...' : 'तक्रार सबमिट करा'}</span>
            </button>
          </form>
        </div>

        {/* Right: Citizen's Registered Complaints History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              माझ्या नोंदवलेल्या तक्रारी (My Grievances)
            </h3>
            <p className="text-xs text-slate-500">आपल्या खात्यातून नोंदवलेल्या तक्रारींचा पाठपुरावा</p>
          </div>

          {!user ? (
            <div className="py-12 text-center text-xs text-slate-400">
              आपल्या तक्रारी पाहण्यासाठी कृपया लॉगिन करा.
            </div>
          ) : myGrievances.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              अद्याप कोणतीही तक्रार नोंदवलेली नाही.
            </div>
          ) : (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {myGrievances.map((g) => (
                <div key={g.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-600">{g.trackingId}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      g.status === 'resolved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : g.status === 'in_progress' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {g.status === 'resolved' ? 'निवारण झाले' : g.status === 'in_progress' ? 'काम चालू' : 'प्रलंबित'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{g.title}</h4>
                  <p className="text-xs text-slate-600">{g.description}</p>
                  
                  <div className="text-[11px] text-slate-500">
                    स्थान: <span className="font-medium text-slate-700">{g.location}</span>
                  </div>

                  {g.resolution && (
                    <div className="mt-2 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs text-emerald-900">
                      <strong>प्रशासकीय निवारण:</strong> {g.resolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
