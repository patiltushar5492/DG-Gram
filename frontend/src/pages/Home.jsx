import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import TickerNotice from '../components/TickerNotice';
import { apiRequest } from '../utils/api';
import { 
  FileText, 
  Landmark, 
  Users, 
  CheckCircle, 
  FileCheck, 
  AlertCircle, 
  ArrowRight, 
  Building, 
  MapPin, 
  Phone, 
  Download, 
  Award, 
  Droplet, 
  Lightbulb, 
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [notices, setNotices] = useState([]);
  const [grs, setGrs] = useState([]);
  const [works, setWorks] = useState([]);

  useEffect(() => {
    apiRequest('/village-profile').then(res => {
      if (res && res.success) setProfile(res.profile);
    });
    apiRequest('/notices').then(res => {
      if (res && res.success) setNotices(res.notices || []);
    });
    apiRequest('/government-grs').then(res => {
      if (res && res.success && res.grs) {
        setGrs(res.grs.slice(0, 3));
      }
    });
    apiRequest('/development-works').then(res => {
      if (res && res.success && res.works) {
        setWorks(res.works.slice(0, 3));
      }
    });
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Scrolling Emergency / Urgent Notice Ticker */}
      <TickerNotice />

      {/* 2. Hero Slider (Fully dynamic via Admin Panel) */}
      <HeroSlider />

      {/* 3. Quick Action Cards ( नागरिक सेवा थेट प्रवेश ) */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            to="/services"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-xl transition-all group transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-orange-600 text-base">
              दाखले व प्रमाणपत्रे
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              रहिवासी, जन्म, मृत्यू व मालमत्ता दाखल्यांसाठी थेट अर्ज करा.
            </p>
            <div className="mt-3 text-xs font-semibold text-orange-600 flex items-center gap-1">
              <span>अर्ज करा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/track-application"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-xl transition-all group transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 text-base">
              अर्जाची सद्यस्थिती
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ट्रॅकिंग आयडी वापरून दाखल्याची मंजुरी तपासा व डाउनलोड करा.
            </p>
            <div className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span>स्थिती तपासा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/government-grs"
            className="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-md hover:shadow-xl transition-all group transform hover:-translate-y-1 bg-gradient-to-br from-amber-50/50 to-white"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-amber-700 text-base flex items-center gap-1.5">
              <span>शासन निर्णय व जीआर</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-black">नवीन</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              महाराष्ट्र शासन व जि. प. चे अधिकृत परिपत्रके व विकास आदेश.
            </p>
            <div className="mt-3 text-xs font-semibold text-amber-700 flex items-center gap-1">
              <span>जीआर पहा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/grievances"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-xl transition-all group transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-red-600 text-base">
              तक्रार निवारण मंच
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              पाणीपुरवठा, पथदिवे, रस्ते वा कचरा समस्यांची थेट ऑनलाइन नोंदणी.
            </p>
            <div className="mt-3 text-xs font-semibold text-red-600 flex items-center gap-1">
              <span>तक्रार नोंदवा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </section>

      {/* 4. Village Leadership / Office Bearers (स्थानिक प्रशासन) */}
      {profile && (
        <section className="max-w-7xl mx-auto px-4 pt-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              ग्राम नेतृत्व व पदाधिकारी
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              ग्रामपंचायत गाळण बुद्रुक कारभारी
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              नागरिकांच्या सेवेसाठी सदैव तत्पर ग्रामपंचायत प्रतिनिधी व अधिकारी
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sarpanch */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <img
                src={profile?.sarpanch?.photo || ''}
                alt={profile?.sarpanch?.name || 'सरपंच'}
                className="w-24 h-24 rounded-full object-cover border-4 border-orange-500/30 shadow-md mb-4"
              />
              <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full mb-1">
                {profile?.sarpanch?.designation || 'सरपंच'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {profile?.sarpanch?.name || ''}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-orange-600" />
                {profile?.sarpanch?.phone || ''}
              </p>
            </div>

            {/* Upsarpanch */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <img
                src={profile?.upsarpanch?.photo || ''}
                alt={profile?.upsarpanch?.name || 'उपसरपंच'}
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-500/30 shadow-md mb-4"
              />
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-0.5 rounded-full mb-1">
                {profile?.upsarpanch?.designation || 'उपसरपंच'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {profile?.upsarpanch?.name || ''}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                {profile?.upsarpanch?.phone || ''}
              </p>
            </div>

            {/* Gramsevak */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
              <img
                src={profile?.gramsevak?.photo || ''}
                alt={profile?.gramsevak?.name || 'ग्रामसेवक'}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30 shadow-md mb-4"
              />
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full mb-1">
                {profile?.gramsevak?.designation || 'ग्रामविकास अधिकारी'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {profile?.gramsevak?.name || ''}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                {profile?.gramsevak?.phone || ''}
              </p>
            </div>

          </div>
        </section>
      )}

      {/* 5. Village Statistics Bar */}
      {profile && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              <div className="p-2">
                <div className="text-3xl sm:text-4xl font-black text-amber-400">
                  {profile?.statistics?.population || '०'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">गावाची एकूण लोकसंख्या</div>
              </div>
              <div className="p-2">
                <div className="text-3xl sm:text-4xl font-black text-amber-400">
                  {profile?.statistics?.totalHouseholds || '०'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">एकूण कुटुंबे (Households)</div>
              </div>
              <div className="p-2">
                <div className="text-3xl sm:text-4xl font-black text-amber-400">
                  {profile?.statistics?.literacyRate || '०%'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">साक्षरता प्रमाण (Literacy)</div>
              </div>
              <div className="p-2">
                <div className="text-3xl sm:text-4xl font-black text-amber-400">
                  {profile?.statistics?.wardCount || '०'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">प्रभाग / वॉर्ड संख्या</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Section Split: Local Village Notices & Latest Government GRs */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Left: Local Village Notices */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-orange-600" />
                <span>स्थानिक ग्रामपंचायत सूचना फलक</span>
              </h3>
              <p className="text-xs text-slate-500">गावातील अंतर्गत कार्यक्रम व ग्रामसभा अपडेट्स</p>
            </div>
          </div>

          <div className="space-y-4">
            {notices.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">सध्या कोणतीही सूचना उपलब्ध नाही.</div>
            ) : (
              notices.map((n) => (
                <div key={n?.id || Math.random()} className="p-4 rounded-xl border border-slate-100 hover:border-orange-200 bg-slate-50/50 hover:bg-orange-50/20 transition-all">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-sm">
                      {n?.category || 'सूचना'}
                    </span>
                    <span className="text-slate-400 font-mono">{n?.date || ''}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{n?.title || ''}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n?.content || ''}</p>
                  <div className="mt-2 text-[10px] text-slate-500 font-semibold">
                    जारीकर्ता: {n?.issuedBy || 'ग्रामपंचायत'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Government GRs & State Circulars Preview */}
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-xs bg-gradient-to-br from-amber-50/20 to-white">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-amber-100">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>शासन निर्णय व जीआर (State GRs)</span>
              </h3>
              <p className="text-xs text-slate-500">महाराष्ट्र शासन व जिल्हा परिषद परिपत्रके</p>
            </div>
            <Link
              to="/government-grs"
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>सर्व पहा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {grs.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">सध्या कोणतेही शासन निर्णय उपलब्ध नाहीत.</div>
            ) : (
              grs.map((gr) => (
                <div key={gr?.id || Math.random()} className="p-4 rounded-xl border border-amber-100 bg-white hover:border-amber-400 transition-all shadow-xs">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm">
                      {gr?.grNumber || 'N/A'}
                    </span>
                    <span className="text-slate-500 font-medium">{gr?.date || ''}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{gr?.title || ''}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{gr?.summary || ''}</p>
                  <div className="mt-3 flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">{gr?.department || ''}</span>
                    <Link
                      to="/government-grs"
                      className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      डाउनलोड (PDF)
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

      {/* 7. Village Development Works Progress Preview */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                पारदर्शक ग्रामविकास
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                गावातील चालू विकासकामे
              </h3>
            </div>
            <Link
              to="/development"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
            >
              <span>सर्व कामे पहा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {works.length === 0 ? (
              <div className="col-span-3 text-xs text-slate-400 py-6 text-center">सध्या कोणतीही विकासकामे नोंदवलेली नाहीत.</div>
            ) : (
              works.map((w) => (
                <div key={w?.id || Math.random()} className="border border-slate-200 rounded-xl p-5 hover:border-emerald-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        {w?.fundingSource || 'विकास निधी'}
                      </span>
                      <span className="text-slate-500 font-medium">{w?.status || 'चालू काम'}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{w?.title || ''}</h4>
                    <div className="mt-2 text-xs text-slate-500">
                      स्थान: <span className="text-slate-800 font-medium">{w?.location || ''}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      मंजूर निधी: <span className="text-slate-900 font-bold">{w?.budget || ''}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>प्रगती</span>
                      <span>{w?.progress ?? 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${w?.progress ?? 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
}