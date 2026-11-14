import React from 'react';
import { Printer, CheckCircle, FileText, Landmark, Clock, ArrowDownCircle } from 'lucide-react';

export default function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Receipt Header Actions */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">डिजिटल अर्ज पावती (Application Receipt)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              प्रिंट
            </button>
            <button
              onClick={onClose}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg"
            >
              बंद करा
            </button>
          </div>
        </div>

        {/* Printable Formal Transaction Receipt */}
        <div className="p-6 sm:p-8 space-y-5 bg-white text-slate-800 printable-card">
          
          <div className="text-center border-b-2 border-slate-800 pb-3">
            <div className="text-xs font-bold text-slate-600 uppercase">महाराष्ट्र शासन</div>
            <div className="text-lg font-black text-slate-950">ग्रामपंचायत गाळण बुद्रुक</div>
            <div className="text-xs text-slate-600">ता. पाचोरा, जि. जळगाव - ४२४२०१</div>
            <div className="mt-2 inline-block bg-slate-100 text-slate-800 border border-slate-300 px-3 py-0.5 rounded-full text-xs font-bold">
              नागरी सेवा अधिकृत ई-पावती
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">पावती क्रमांक (Receipt No):</span>
              <span className="font-mono font-bold text-slate-900">{receipt.receiptNo || 'RCPT-882190'}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">तारीख व वेळ:</span>
              <span className="font-semibold text-slate-900">
                {new Date(receipt.timestamp || Date.now()).toLocaleString('mr-IN')}
              </span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between border-b border-orange-200/60 pb-1.5">
              <span className="text-slate-600">ट्रॅकिंग क्रमांक (Tracking ID):</span>
              <span className="font-mono font-black text-orange-700">{receipt.trackingId}</span>
            </div>
            <div className="flex justify-between border-b border-orange-200/60 pb-1.5">
              <span className="text-slate-600">अर्जदाराचे नाव:</span>
              <span className="font-bold text-slate-900">{receipt.applicantName}</span>
            </div>
            <div className="flex justify-between border-b border-orange-200/60 pb-1.5">
              <span className="text-slate-600">मागणी केलेली सेवा:</span>
              <span className="font-bold text-slate-900">{receipt.serviceNameMr}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-600">शासकीय सेवा शुल्क:</span>
              <span className="font-black text-sm text-emerald-700">{receipt.feeAmount || '₹ २०.००'}</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">महत्त्वाची सूचना:</p>
            <p>१. सदर पावती जतन करून ठेवा. अर्जाची स्थिती तपासण्यासाठी वरील ट्रॅकिंग क्रमांक आवश्यक आहे.</p>
            <p>२. कागदपत्रांची पडताळणी पूर्ण झाल्यावर २ ते ३ कार्यालयीन दिवसांत दाखला डिजिटल स्वाक्षरीसह उपलब्ध होईल.</p>
          </div>

          <div className="pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
            <div>संगणकीय जनरेटेड डिजिटल पावती</div>
            <div className="font-semibold text-slate-700">ग्रामपंचायत गाळण बुद्रुक</div>
          </div>

        </div>

      </div>
    </div>
  );
}
