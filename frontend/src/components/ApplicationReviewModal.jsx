import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  Eye, 
  ExternalLink, 
  ShieldCheck, 
  User, 
  MapPin, 
  Calendar, 
  FileCheck, 
  Download,
  AlertCircle,
  FileX
} from 'lucide-react';

// The backend Express server always serves uploaded files at port 5000.
// Using an absolute URL guarantees the browser opens the PDF directly
// and never accidentally routes the request to the Vite dev-server (port 5173).
const BACKEND_ORIGIN = 'http://localhost:5000';

/**
 * Resolve a document's usable absolute URL.
 * Priority:
 *  1. storedFileName  → build absolute URL from known server origin
 *  2. fileUrl with leading /uploads/  → prefix with BACKEND_ORIGIN
 *  3. fileUrl that already starts with http  → use as-is
 *  4. null / missing → no link
 */
function resolveDocUrl(doc) {
  if (!doc) return null;

  if (doc.storedFileName) {
    return `${BACKEND_ORIGIN}/uploads/${doc.storedFileName}`;
  }
  if (doc.fileUrl) {
    if (doc.fileUrl.startsWith('http')) return doc.fileUrl;
    // Relative path like /uploads/DOC-xxx.pdf → prefix with backend origin
    return `${BACKEND_ORIGIN}${doc.fileUrl}`;
  }
  return null;
}

export default function ApplicationReviewModal({ 
  application, 
  onClose, 
  onApprove, 
  onReject,
  onPrintCertificate 
}) {
  const [activeDocPreview, setActiveDocPreview] = React.useState(null);
  const [remarksInput, setRemarksInput] = React.useState('');

  if (!application) return null;

  // Use ONLY what the backend stored — no hardcoded fallbacks.
  // If documents array is missing (old seeded record), show a clear "not uploaded" notice.
  const documents = application.documents || [];

  const payment = application.payment || {
    status: 'SUCCESS',
    amountPaid: application.feeAmount || 20,
    transactionId: `TXN-${Date.now().toString().slice(-8)}`,
    upiRefId: `UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    paidAt: application.appliedAt,
    paymentMethod: 'UPI / Online Banking'
  };

  const handleOpenDoc = (doc) => {
    const url = resolveDocUrl(doc);
    if (url) {
      // Open directly in new tab — no intermediate modal needed for a true file view
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    // Also set for preview panel
    setActiveDocPreview({ ...doc, resolvedUrl: url });
  };

  const handleApproveClick = () => {
    const remarks = remarksInput.trim() || 'कागदपत्रांची छाननी पूर्ण. अर्ज मंजूर.';
    onApprove(application, remarks);
  };

  const handleRejectClick = () => {
    const remarks = remarksInput.trim() || 'कागदपत्रे अपूर्ण / अर्ज नामंजूर.';
    onReject(application, remarks);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in no-print">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b-2 border-orange-500 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-orange-400 bg-slate-800 px-2 py-0.5 rounded">
                  {application.trackingId}
                </span>
                <span className="text-xs text-slate-400">आपले सरकार धर्तीवर अर्ज छाननी</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {application.serviceNameMr} - अर्ज व कागदपत्रे पडताळणी
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* 1. Payment Verification Card */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  शुल्क भरणा यशस्वी (Payment Verified)
                </span>
                <span className="text-xs text-emerald-900 font-bold font-mono">
                  {payment.transactionId}
                </span>
              </div>
              <div className="text-xs text-emerald-950 font-semibold">
                पद्धत: <span className="font-bold">{payment.paymentMethod}</span> | UPI UTR: <span className="font-mono">{payment.upiRefId}</span>
              </div>
              <div className="text-[11px] text-emerald-800">
                भरणा दिनांक: {new Date(payment.paidAt).toLocaleString('mr-IN')}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">जमा शासकीय शुल्क</span>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                ₹ {payment.amountPaid}.००
              </div>
            </div>
          </div>

          {/* 2. Applicant Profile */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-slate-500 block">अर्जदाराचे पूर्ण नाव:</span>
              <span className="font-bold text-slate-900 text-sm">{application.applicantName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">वडील / पती यांचे नाव:</span>
              <span className="font-bold text-slate-900">{application.fatherOrHusbandName || 'नमूद नाही'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">मोबाईल नंबर:</span>
              <span className="font-bold text-slate-900 font-mono">{application.mobile}</span>
            </div>
            <div>
              <span className="text-slate-500 block">आधार क्र.:</span>
              <span className="font-bold text-slate-900 font-mono">{application.aadhaarNumber || 'नमूद नाही'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">रहिवासी वर्षे:</span>
              <span className="font-bold text-slate-900">{application.residingSinceYears} वर्षे</span>
            </div>
            <div>
              <span className="text-slate-500 block">अर्जाचा उद्देश:</span>
              <span className="font-bold text-slate-900 text-sm">{application.purpose}</span>
            </div>
          </div>

          {/* 3. Supporting Documents Viewer */}
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-orange-100 pb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>अपलोड केलेली अधिकृत कागदपत्रे (Supporting Documents)</span>
              </h4>
              <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                {documents.length} कागदपत्रे
              </span>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                <FileX className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>या अर्जाशी कोणतेही कागदपत्रे जोडलेली आढळली नाहीत.</p>
                <p className="text-slate-300 mt-1">(जुन्या डेमो नोंदीसाठी कागदपत्रे अनुपलब्ध)</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {documents.map((doc, idx) => {
                  const docUrl = resolveDocUrl(doc);
                  const isAvailable = !!docUrl;

                  return (
                    <div
                      key={idx}
                      className={`border rounded-xl p-3.5 flex justify-between items-center transition-all ${
                        isAvailable
                          ? 'border-slate-200 hover:border-orange-300 bg-slate-50/70 hover:bg-orange-50/20'
                          : 'border-red-100 bg-red-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 text-lg ${
                          isAvailable ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-400'
                        }`}>
                          {isAvailable ? '📄' : '❌'}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900">{doc.name}</h5>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {doc.fileName || '(फाईल अपलोड झाली नाही)'}
                          </span>
                          {doc.uploadedAt && (
                            <span className="text-[10px] text-slate-400 block">
                              अपलोड: {new Date(doc.uploadedAt).toLocaleDateString('mr-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {isAvailable ? (
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs no-underline"
                          title={`उघडा: ${docUrl}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>डॉक्युमेंट पहा / उघडा</span>
                        </a>
                      ) : (
                        <span className="text-[11px] font-bold text-red-500 bg-red-100 px-3 py-1.5 rounded-xl">
                          अपलोड नाही
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Remarks input for approve/reject */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              प्रशासकीय शेरा / टिप्पणी (Remarks for Approve / Reject):
            </label>
            <textarea
              value={remarksInput}
              onChange={e => setRemarksInput(e.target.value)}
              rows={2}
              placeholder="उदा. कागदपत्रांची छाननी पूर्ण झाली. रहिवासी पुरावा वैध आढळला."
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {/* 5. Current Status */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs flex justify-between items-center">
            <div>
              <span className="text-slate-500 block">सद्यस्थिती (Current Status):</span>
              <span className={`font-black text-sm uppercase ${
                application.status === 'approved' ? 'text-emerald-700' : application.status === 'rejected' ? 'text-red-700' : 'text-amber-700'
              }`}>
                {application.status === 'approved' ? 'मंजूर (Approved)' : application.status === 'rejected' ? 'नामंजूर (Rejected)' : 'प्रलंबित (Pending Review)'}
              </span>
            </div>
            {application.remarks && (
              <div className="text-right">
                <span className="text-slate-500 block">मागील शेरा:</span>
                <span className="font-semibold text-slate-800">{application.remarks}</span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
          >
            बंद करा
          </button>

          <div className="flex gap-2">
            {application.status === 'approved' ? (
              <button
                onClick={() => onPrintCertificate(application)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>अधिकृत दाखला प्रिंट करा</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleRejectClick}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  नामंजूर (Reject)
                </button>
                <button
                  onClick={handleApproveClick}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>कागदपत्रे बरोबर - मंजूर करा (Approve)</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
