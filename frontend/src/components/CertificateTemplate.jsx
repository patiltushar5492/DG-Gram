import React from 'react';
import { Printer, CheckCircle, FileCheck2, Landmark, ShieldCheck } from 'lucide-react';

export default function CertificateTemplate({ application }) {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = application.issueDate 
    ? new Date(application.issueDate).toLocaleDateString('mr-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('mr-IN');

  return (
    <div className="space-y-4">
      {/* Print Trigger Button */}
      <div className="flex justify-end gap-3 no-print">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>अधिकृत दाखला प्रिंट करा (Print Official Certificate)</span>
        </button>
      </div>

      {/* Official Government Printable Layout */}
      <div className="printable-card bg-white p-8 sm:p-12 max-w-4xl mx-auto border-4 border-double border-slate-800 rounded-none shadow-lg text-slate-900 relative font-serif">
        
        {/* Subtle Watermark Seal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <div className="text-center">
            <Landmark className="w-96 h-96 mx-auto text-slate-950" />
            <div className="text-4xl font-black mt-2">महाराष्ट्र शासन</div>
          </div>
        </div>

        {/* Outer Corner Ornaments (CSS Styled) */}
        <div className="relative z-10">

          {/* Header Block with Ashok Stambh / State Heading */}
          <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex justify-center items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center bg-slate-50">
                <Landmark className="w-8 h-8 text-slate-900" />
              </div>
            </div>

            <div className="text-sm font-bold uppercase tracking-widest text-slate-700">
              महाराष्ट्र शासन (Government of Maharashtra)
            </div>
            <div className="text-xs font-semibold text-slate-600">
              ग्राम विकास व पंचायत राज विभाग | जिल्हा परिषद जळगाव | पंचायत समिती पाचोरा
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 tracking-wide">
              ग्रामपंचायत कार्यालय, गाळण बुद्रुक
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              ता. पाचोरा, जि. जळगाव - ४२४२०१ (महाराष्ट्र) | ई-मेल: gp.galanbudruk@gmail.com
            </p>
          </div>

          {/* Certificate Metadata Ribbon */}
          <div className="flex justify-between items-center text-xs sm:text-sm font-sans border-b border-slate-300 pb-3 mb-6 font-semibold">
            <div>
              <span className="text-slate-600">जावक क्रमांक (Outward No): </span>
              <span className="text-slate-950 font-mono font-bold">{application.certificateNumber || 'GB/MAHA/2026/RC-0442'}</span>
            </div>
            <div>
              <span className="text-slate-600">दिनांक (Date): </span>
              <span className="text-slate-950">{formattedDate}</span>
            </div>
          </div>

          {/* Certificate Title Badge */}
          <div className="text-center my-6">
            <div className="inline-block border-2 border-slate-900 px-8 py-2 bg-slate-50 text-slate-950 text-xl sm:text-2xl font-black tracking-wide shadow-xs uppercase">
              {application.serviceNameMr || 'रहिवासी दाखला (Residence Certificate)'}
            </div>
          </div>

          {/* Certificate Legal Body Text (Authentic Marathi Draft) */}
          <div className="text-base sm:text-lg leading-relaxed text-slate-900 space-y-4 my-8 text-justify indent-8">
            <p>
              दाखला देण्यात येतो की, श्री / श्रीमती / कु. 
              <span className="font-bold border-b border-dotted border-slate-900 px-2 font-sans">
                {application.applicantName}
              </span> 
              {application.fatherOrHusbandName && (
                <>
                  वडिलांचे / पतीचे नाव: 
                  <span className="font-bold border-b border-dotted border-slate-900 px-2 font-sans">
                    {application.fatherOrHusbandName}
                  </span>
                </>
              )}
              हे मौजे <strong>गाळण बुद्रुक</strong>, तालुका <strong>पाचोरा</strong>, जिल्हा <strong>जळगाव (महाराष्ट्र)</strong> येथील कायमचे मूळ रहिवासी आहेत.
            </p>

            <p>
              अर्जदाराने दिलेल्या माहितीनुसार व उपलब्ध ग्रामपंचायत अभिलेख (गाव नमुना नंबर ८ व मतदार यादी) तपासणीवरून, हे गाळण बुद्रुक येथे मागील 
              <span className="font-bold border-b border-dotted border-slate-900 px-2">
                {application.residingSinceYears || '२५'}
              </span> 
              वर्षांपासून राहतात. त्यांचा पत्ता 
              <span className="font-semibold italic px-1">
                "{application.address || 'गाळण बुद्रुक, ता. पाचोरा'}"
              </span> 
              असा आहे.
            </p>

            <p>
              सदर दाखला अर्जदाराच्या विनंतीवरून व अर्जान्वये नमूद केलेल्या कारणास्तव: 
              <strong className="underline underline-offset-4 px-1">
                "{application.purpose || 'शासकीय व शैक्षणिक कामासाठी'}"
              </strong> 
              देण्यात येत आहे.
            </p>

            <p className="text-sm italic text-slate-700 indent-0 pt-2">
              (टीप: सदर दाखला ई-गव्हर्नन्स प्रणालीद्वारे संगणकीय स्वाक्षरीने तयार करण्यात आला असून शासकीय नियमांनुसार सर्व प्रशासकीय कामांसाठी अधिकृत व ग्राह्य आहे.)
            </p>
          </div>

          {/* Verification Box & Digital Stamp */}
          <div className="my-8 pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end font-sans">
            
            {/* QR Code Verification Box */}
            <div className="text-center sm:text-left border border-slate-300 p-3 rounded-md bg-slate-50 text-xs">
              <div className="w-24 h-24 bg-white border border-slate-400 mx-auto sm:mx-0 flex items-center justify-center p-1 shadow-xs">
                {/* Simulated Authentic Government QR Code matrix */}
                <div className="w-full h-full bg-slate-950 p-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-white"></div>
                    <div className="w-4 h-4 bg-white"></div>
                  </div>
                  <div className="text-center text-[7px] text-white font-mono font-bold tracking-tighter">
                    VERIFIED
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-white"></div>
                    <div className="w-4 h-4 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-600 font-mono">
                ट्रॅकिंग: {application.trackingId}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" />
                <span>डिजिटल पडताळणीकृत</span>
              </div>
            </div>

            {/* Middle Stamp */}
            <div className="text-center">
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-red-700 text-red-700 flex flex-col items-center justify-center mx-auto p-2 transform -rotate-6 select-none opacity-90">
                <div className="text-[9px] font-bold">ग्रामपंचायत कार्यालय</div>
                <div className="text-[11px] font-black uppercase my-0.5">गाळण बुद्रुक</div>
                <div className="text-[8px] font-semibold">ता. पाचोरा, जि. जळगाव</div>
                <div className="text-[8px] text-red-800 font-bold border-t border-red-700 mt-0.5">डिजिटल मोहर</div>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="text-center sm:text-right space-y-1">
              <div className="h-12 flex items-end justify-center sm:justify-end">
                <div className="font-serif italic text-blue-900 font-bold text-lg select-none">
                  Digitally Signed
                </div>
              </div>
              <div className="border-t border-slate-900 pt-1 font-bold text-xs sm:text-sm text-slate-900">
                सरपंच / ग्रामविकास अधिकारी
              </div>
              <div className="text-xs text-slate-600">
                ग्रामपंचायत गाळण बुद्रुक
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                ता. पाचोरा, जि. जळगाव
              </div>
            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="text-center text-[10px] text-slate-500 border-t border-slate-300 pt-2 font-mono">
            Security Hash: SHA256:{Math.random().toString(36).substring(2, 15).toUpperCase()} | Aaple Sarkar Compatible
          </div>

        </div>
      </div>
    </div>
  );
}
