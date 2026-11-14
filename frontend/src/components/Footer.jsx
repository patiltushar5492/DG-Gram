import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-orange-500 no-print">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="text-white font-bold text-lg leading-tight">
                ग्रामपंचायत गाळण बुद्रुक
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ता. पाचोरा, जि. जळगाव अंतर्गत डिजिटल भारत अभियानांतर्गत विकसित अधिकृत ई-प्रशासन वेब पोर्टल. सर्व शासकीय सेवा व दाखले आता थेट ग्रामस्थांच्या सेवेत.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>सुरक्षित व प्रमाणित डिजिटल पोर्टल</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              महत्त्वाचे दुवे (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-orange-400 transition-colors">
                  • ऑनलाइन दाखले अर्ज (Online Certificates)
                </Link>
              </li>
              <li>
                <Link to="/government-grs" className="text-amber-400 hover:underline font-medium">
                  • शासन निर्णय व जीआर (Government GRs)
                </Link>
              </li>
              <li>
                <Link to="/development" className="hover:text-orange-400 transition-colors">
                  • चालू व प्रस्तावित विकासकामे (Works)
                </Link>
              </li>
              <li>
                <Link to="/grievances" className="hover:text-orange-400 transition-colors">
                  • ऑनलाइन तक्रार निवारण (Grievance Redressal)
                </Link>
              </li>
              <li>
                <Link to="/track-application" className="hover:text-orange-400 transition-colors">
                  • अर्जाची सद्यस्थिती (Application Status)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              शासकीय संकेतस्थळे
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  • महाराष्ट्र शासन अधिकृत पोर्टल (maharashtra.gov.in)
                </a>
              </li>
              <li>
                <a href="https://aaplesarkar.mahaonline.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  • आपले सरकार सेवा पोर्टल (Aaple Sarkar)
                </a>
              </li>
              <li>
                <a href="https://jalgaon.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  • जिल्हाधिकारी कार्यालय, जळगाव
                </a>
              </li>
              <li>
                <a href="https://egramswaraj.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  • ई-ग्रामस्वराज (eGramSwaraj MoPR)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              कार्यालयीन संपर्क (Contact)
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>ग्रामपंचायत कार्यालय, मु. पो. गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव - ४२४२०१</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>०२५९६-२४५००१ / ९८२३००००००</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>gp.galanbudruk@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <span>सोमवार - शनिवार: स. १० ते सं. ५:४५</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright ribbon */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <div>
            © २०२६ ग्रामपंचायत गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव. सर्व हक्क राखीव.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>डिजिटल सुशासन व तंत्रज्ञानाने समृद्ध गाव</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
