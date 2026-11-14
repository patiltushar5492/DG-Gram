import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { Briefcase, Building, CheckCircle2, Clock, Calendar, MapPin, IndianRupee, Layers } from 'lucide-react';

export default function Development() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/development-works').then(res => {
      if (res.success && res.works) {
        setWorks(res.works);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-2">
          <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            पारदर्शक ग्रामविकास निधी
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            गावातील विकासकामे व प्रकल्प प्रगती
          </h1>
          <p className="text-sm text-emerald-100 leading-relaxed">
            १५ वा वित्त आयोग, जल जीवन मिशन, जिल्हा नियोजन समिती व ग्रामपंचायत स्वनिधी अंतर्गत सुरू असलेली सर्व भौतिक व पायाभूत विकासकामे.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">
          माहिती लोड होत आहे...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {works.map((work) => (
            <div
              key={work.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    {work.fundingSource}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    work.progress === 100 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {work.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {work.title}
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-500 block">अंदाजपत्रकीय निधी:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{work.budget}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">खर्च झालेला निधी:</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{work.spent}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-slate-600 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>स्थान: <strong>{work.location}</strong></span>
                  </div>
                  <div className="col-span-2 text-slate-500 text-[11px]">
                    मजूर / कंत्राटदार: <strong>{work.contractor}</strong>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>कामाची प्रत्यक्ष प्रगती</span>
                  <span className="text-emerald-700">{work.progress}% पूर्ण</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      work.progress === 100 ? 'bg-blue-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${work.progress}%` }}
                  ></div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
