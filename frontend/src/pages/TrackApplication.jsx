import React, { useState } from 'react';
import { apiRequest } from '../utils/api';
import CertificateTemplate from '../components/CertificateTemplate';
import { 
  Search, 
  FileCheck2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  FileText, 
  MapPin, 
  User, 
  Phone,
  ArrowRight
} from 'lucide-react';

export default function TrackApplication() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null); // { type: 'application' | 'grievance', data }
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSearchResult(null);
    setSearched(true);

    const term = trackingId.trim();
    // Use the universal tracker endpoint that checks both applications and grievances
    const res = await apiRequest(`/track/any/${encodeURIComponent(term)}`);
    setLoading(false);

    if (res.success && res.data) {
      setSearchResult(res);
    } else {
      setErrorMsg(res.message || 'दिलेल्या ट्रॅकिंग आयडीनुसार कोणतीही नोंद आढळली नाही. कृपया अचूक क्रमांक प्रविष्ट करा.');
    }
  };

  const handleQuickSample = (sampleId) => {
    setTrackingId(sampleId);
    setErrorMsg('');
    setSearchResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2 no-print">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>डिजिटल ट्रॅकिंग प्रणाली (Tracking Portal)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          दाखला अर्ज व तक्रार स्थिती तपासा
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          दाखला पावतीवरील ट्रॅकिंग आयडी (उदा. <strong>GB-CERT-2026-891</strong>) किंवा तक्रार नोंदणी क्रमांक (उदा. <strong>GB-GRV-8821</strong>) प्रविष्ट करा.
        </p>
      </div>

      {/* Tracking Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto no-print space-y-3">
        <form onSubmit={handleTrack} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ट्रॅकिंग आयडी प्रविष्ट करा (उदा. GB-CERT-2026-891 किंवा GB-GRV-8821)..."
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white uppercase font-mono font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'शोधत आहे...' : 'तपासा'}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>उदाहरणे:</span>
          <button
            type="button"
            onClick={() => handleQuickSample('GB-CERT-2026-891')}
            className="font-mono font-bold text-orange-600 hover:underline cursor-pointer"
          >
            GB-CERT-2026-891 (दाखला मंजूर)
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => handleQuickSample('GB-GRV-8821')}
            className="font-mono font-bold text-red-600 hover:underline cursor-pointer"
          >
            GB-GRV-8821 (तक्रार निवारण)
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => handleQuickSample('GB-GRV-9014')}
            className="font-mono font-bold text-amber-600 hover:underline cursor-pointer"
          >
            GB-GRV-9014 (तक्रार चालू)
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 no-print">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. CASE: APPLICATION RESULT */}
      {searchResult && searchResult.type === 'application' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto no-print space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-600 font-mono">
                  दाखला ट्रॅकिंग आयडी: {searchResult.data.trackingId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {searchResult.data.serviceNameMr}
                </h3>
              </div>

              {/* Status Badge */}
              <div>
                {searchResult.data.status === 'approved' && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-300">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    मंजूर (Approved & Ready)
                  </span>
                )}
                {searchResult.data.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-300">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    पडताळणी चालू (Under Review)
                  </span>
                )}
                {searchResult.data.status === 'rejected' && (
                  <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 font-bold text-xs px-3 py-1.5 rounded-full border border-red-300">
                    <XCircle className="w-4 h-4 text-red-600" />
                    नामंजूर (Rejected)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">अर्जदाराचे नाव:</span>
                <span className="font-bold text-slate-900">{searchResult.data.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">अर्जाची तारीख:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(searchResult.data.appliedAt).toLocaleString('mr-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">दाखला कारण:</span>
                <span className="font-semibold text-slate-800">{searchResult.data.purpose}</span>
              </div>
              <div>
                <span className="text-slate-500 block">अधिकारी शेरा (Remarks):</span>
                <span className="font-semibold text-slate-800">{searchResult.data.remarks || 'कागदपत्रे छाननी सुरू आहे.'}</span>
              </div>
            </div>
          </div>

          {/* If Approved: Show the official printable certificate component */}
          {searchResult.data.status === 'approved' && (
            <div className="pt-2">
              <div className="text-center font-bold text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 py-2.5 rounded-xl mb-4 max-w-4xl mx-auto no-print">
                ✨ अभिनंदन! आपला दाखला ग्रामपंचायतीने डिजिटल स्वाक्षरीसह मंजूर केला आहे. खालील दाखला थेट प्रिंट करा.
              </div>
              <CertificateTemplate application={searchResult.data} />
            </div>
          )}
        </div>
      )}

      {/* 2. CASE: GRIEVANCE / COMPLAINT RESULT */}
      {searchResult && searchResult.type === 'grievance' && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-md max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-800 border border-red-200 font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                  तक्रार ट्रॅकिंग: {searchResult.data.trackingId}
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                  {searchResult.data.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                {searchResult.data.title}
              </h3>
            </div>

            <div>
              {searchResult.data.status === 'resolved' && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  निवारण झाले (Resolved)
                </span>
              )}
              {searchResult.data.status === 'in_progress' && (
                <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-300">
                  <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                  काम चालू आहे (In Progress)
                </span>
              )}
              {(searchResult.data.status === 'open' || searchResult.data.status === 'pending') && (
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-300">
                  <Clock className="w-4 h-4 text-amber-600" />
                  नोंद झाली / प्रलंबित (Pending)
                </span>
              )}
              {searchResult.data.status === 'rejected' && (
                <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 font-bold text-xs px-3 py-1.5 rounded-full border border-red-300">
                  <XCircle className="w-4 h-4 text-red-600" />
                  नाकारण्यात आली (Rejected)
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">तक्रारदार:</span>
              <span className="font-bold text-slate-900">{searchResult.data.citizenName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">नोंदणी तारीख:</span>
              <span className="font-semibold text-slate-900">
                {new Date(searchResult.data.createdAt).toLocaleString('mr-IN')}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block">समस्येचे ठिकाण:</span>
              <span className="font-medium text-slate-900 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                {searchResult.data.location}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block">तक्रारीचे सविस्तर वर्णन:</span>
              <p className="mt-1 text-slate-800 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                {searchResult.data.description}
              </p>
            </div>
          </div>

          {/* Administrative Resolution Block */}
          {searchResult.data.resolution && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs space-y-1">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>ग्रामपंचायत प्रशासकीय निवारण शेरा (Official Resolution):</span>
              </div>
              <p className="text-emerald-800 leading-relaxed font-medium">
                {searchResult.data.resolution}
              </p>
              {searchResult.data.resolvedAt && (
                <div className="text-[10px] text-emerald-600 pt-1">
                  निवारण दिनांक: {new Date(searchResult.data.resolvedAt).toLocaleDateString('mr-IN')}
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-slate-500 flex justify-between items-center pt-2">
            <span>ग्रामपंचायत गाळण बुद्रुक, ता. पाचोरा</span>
            <span>डिजिटल तक्रार निवारण कक्ष</span>
          </div>
        </div>
      )}

    </div>
  );
}
