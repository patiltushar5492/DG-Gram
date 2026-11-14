import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { Landmark, MapPin, Users, Award, ShieldCheck, Mail, Phone, Calendar, School, HeartPulse, Building, Clock } from 'lucide-react';

export default function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiRequest('/village-profile').then(res => {
      if (res.success) setProfile(res.profile);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-3">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            ऐतिहासिक व आदर्श गाव परिचय
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            ग्रामपंचायत गाळण बुद्रुक, ता. पाचोरा
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            जिल्हा जळगाव अंतर्गत शांत, निसर्गरम्य आणि कृषीप्रधान समृद्ध गाव. आधुनिक डिजिटल प्रणाली आणि लोकसहभागातून आदर्श ग्रामविकासाकडे वाटचाल.
          </p>
        </div>
      </div>

      {/* Dynamic Informational Sections (Editable via Admin CMS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">भौगोलिक स्थान व संपर्क</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {profile?.aboutSections?.locationText || "गाळण बुद्रुक हे पाचोरा तालुक्यापासून सुमारे १२ कि.मी. अंतरावर वसलेले आहे. गावाचा पिनकोड ४२४२०१ असून पाचोरा रेल्वे जंक्शन व मुख्य राज्य महामार्गाशी चांगला संपर्क आहे."}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <School className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">शैक्षणिक व सामाजिक सुविधा</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {profile?.aboutSections?.educationText || "गावात जिल्हा परिषद प्राथमिक शाळा, अंगणवाडी केंद्र, आणि डिजिटल ई-लर्निंग सुविधा उपलब्ध आहेत. माध्यमिक शिक्षणासाठी नियमित बस सुविधा आहे."}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">आरोग्य व पेयजल व्यवस्था</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {profile?.aboutSections?.healthWaterText || "प्राथमिक आरोग्य उपकेंद्र कार्यरत असून गावात जल जीवन मिशन अंतर्गत हर घर नल से जल योजनेद्वारे शुद्ध पाण्याचा पुरवठा नियमित केला जातो."}
          </p>
        </div>

      </div>

      {/* Dynamic Key Stats Table (Admin CMS Controlled) */}
      {profile && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">
              गावाची अधिकृत सांख्यिकी (Gram Statistics 2026)
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              प्रशासकीय नोंदणीकृत डेटा
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">एकूण लोकसंख्या:</span>
              <span className="font-black text-lg text-slate-900">{profile.statistics.population}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">स्त्री / पुरुष प्रमाण:</span>
              <span className="font-black text-lg text-slate-900">{profile.statistics.female} / {profile.statistics.male}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">साक्षरता दर:</span>
              <span className="font-black text-lg text-slate-900">{profile.statistics.literacyRate}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">ग्रामपंचायत प्रभाग / वॉर्ड:</span>
              <span className="font-black text-lg text-slate-900">{profile.statistics.wardCount} वॉर्ड</span>
            </div>
          </div>
        </div>
      )}

      {/* Leadership & Office Hours */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>कार्यालयीन वेळ व संपर्क</span>
            </h4>
            <p className="text-slate-600">वेळ: <strong className="text-slate-900">{profile.officeHours}</strong></p>
            <p className="text-slate-600">अधिकृत ई-मेल: <strong className="text-slate-900">{profile.email}</strong></p>
            <p className="text-slate-600">हेल्पलाइन: <strong className="text-slate-900">{profile.helpline}</strong></p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>स्थानिक स्वराज्य संस्था रचना</span>
            </h4>
            <p className="text-slate-600">सरपंच: <strong className="text-slate-900">{profile.sarpanch.name}</strong> ({profile.sarpanch.phone})</p>
            <p className="text-slate-600">उपसरपंच: <strong className="text-slate-900">{profile.upsarpanch.name}</strong> ({profile.upsarpanch.phone})</p>
            <p className="text-slate-600">ग्रामसेवक: <strong className="text-slate-900">{profile.gramsevak.name}</strong> ({profile.gramsevak.phone})</p>
          </div>
        </div>
      )}

    </div>
  );
}
