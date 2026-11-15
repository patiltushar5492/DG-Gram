import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import CertificateTemplate from '../components/CertificateTemplate';
import Form8Template from '../components/Form8Template';
import ReceiptModal from '../components/ReceiptModal';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Printer, 
  AlertCircle, 
  PlusCircle, 
  User, 
  ShieldCheck,
  Eye,
  Award,
  Download,
  Calendar,
  Sparkles,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CitizenDashboard() {
  // 👇 useAuth() मधून डेटा काढताना '|| {}' सेफ्टी चेक जोडला आहे
  const { user } = useAuth() || {};
  const [applications, setApplications] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppForCert, setSelectedAppForCert] = useState(null);
  const [selectedAppForReceipt, setSelectedAppForReceipt] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiRequest('/applications/my'),
      apiRequest('/grievances/my')
    ]).then(([appsRes, grvsRes]) => {
      if (appsRes && appsRes.success) setApplications(appsRes.applications || []);
      if (grvsRes && grvsRes.success) setGrievances(grvsRes.grievances || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Approved certificates filter
  const approvedApplications = applications.filter(a => a?.status === 'approved');

  // Check if an application is Form 8 (House Extract)
  const isForm8 = (app) => {
    if (!app) return false;
    const type = (app.serviceType || '').toLowerCase();
    const name = (app.serviceNameMr || '').toLowerCase();
    return type.includes('namuna8') || type.includes('form8') || name.includes('नमुना नंबर ८') || name.includes('नमुना नं. ८') || name.includes('उतारा');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Profile Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              नागरिक ई-खाते (Citizen Dashboard)
            </span>
            <h1 className="text-2xl font-black text-slate-900">
              स्वागत आहे, {user?.name || 'नागरिक'}!
            </h1>
            <p className="text-xs text-slate-500">
              मोबाईल: {user?.mobile || 'उपलब्ध नाही'} | गाव: गाळण बुद्रुक, ता. पाचोरा
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            नवीन दाखला अर्ज करा
          </Link>
          <Link
            to="/grievances"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
          >
            तक्रार नोंदवा
          </Link>
        </div>
      </div>

      {/* Selected Certificate Print Modal / View */}
      {selectedAppForCert && (
        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-emerald-400 shadow-xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 no-print">
            <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>
                {isForm8(selectedAppForCert) ? 'गाव नमुना नंबर ८ उतारा (House Extract Form 8)' : 'प्रमाणित शासकीय दाखला'}: {selectedAppForCert?.serviceNameMr}
              </span>
            </h3>
            <button
              onClick={() => setSelectedAppForCert(null)}
              className="text-xs bg-slate-200 hover:bg-slate-300 font-bold px-3 py-1.5 rounded-lg text-slate-700 cursor-pointer"
            >
              व्ह्यू बंद करा (Close)
            </button>
          </div>

          {isForm8(selectedAppForCert) ? (
            <Form8Template application={selectedAppForCert} />
          ) : (
            <CertificateTemplate application={selectedAppForCert} />
          )}
        </div>
      )}

      {/* Approved Certificates Ready for Print Section */}
      {approvedApplications.length > 0 && (
        <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl border-2 border-emerald-400 p-6 sm:p-8 shadow-sm space-y-4 no-print">
          <div className="flex justify-between items-center border-b border-emerald-200/80 pb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                डिजिटल स्वाक्षरीसह मंजूर दाखले
              </span>
              <h2 className="text-xl font-black text-emerald-950 mt-1">
                माझे मंजूर दाखले - थेट प्रिंट करा (Approved Certificates Ready to Print)
              </h2>
              <p className="text-xs text-emerald-800">
                ग्रामपंचायतीने डिजिटल स्वाक्षरीसह मंजूर केलेले खालील दाखले येथे थेट उपलब्ध आहेत.
              </p>
            </div>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
              मंजूर संख्या: {approvedApplications.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {approvedApplications.map((app) => (
              <div
                key={app?.id || Math.random()}
                className="bg-white rounded-2xl p-5 border-2 border-emerald-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-sm">
                      {app?.certificateNumber || app?.trackingId || 'N/A'}
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      मंजूर (Approved)
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 leading-snug">
                    {app?.serviceNameMr || 'दाखला'}
                  </h3>
                  <div className="text-xs text-slate-600 mt-2 space-y-1">
                    <p>अर्जदार: <strong>{app?.applicantName || 'नागरिक'}</strong></p>
                    <p>मंजुरी दिनांक: <strong>{app?.issueDate || new Date(app?.reviewedAt || Date.now()).toLocaleDateString('mr-IN')}</strong></p>
                    {app?.remarks && <p className="text-slate-500 italic text-[11px]">शेरा: {app.remarks}</p>}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedAppForReceipt({
                      receiptNo: `RCPT-${app?.id ? app.id.slice(-6) : '000000'}`,
                      trackingId: app?.trackingId || '',
                      applicantName: app?.applicantName || '',
                      serviceNameMr: app?.serviceNameMr || '',
                      feeAmount: `₹ ${app?.feeAmount || 20}.००`,
                      timestamp: app?.appliedAt || new Date()
                    })}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    पावती
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAppForCert(app);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>
                      {isForm8(app) ? 'उतारा प्रिंट करा (Print Form 8)' : 'दाखला प्रिंट करा (Print Certificate)'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Applications Table */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 no-print">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              माझे सर्व दाखले व प्रमाणपत्र अर्ज (All Applications)
            </h2>
            <p className="text-xs text-slate-500">आपण सादर केलेल्या दाखल्यांची स्थिती, पावती व डाउनलोड</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            एकूण अर्ज: {applications.length}
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">माहिती लोड होत आहे...</div>
        ) : applications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            अद्याप कोणताही दाखला अर्ज केलेला नाही.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">ट्रॅकिंग आयडी</th>
                  <th className="p-3">दाखला प्रकार</th>
                  <th className="p-3">तारीख</th>
                  <th className="p-3">स्थिती (Status)</th>
                  <th className="p-3 text-right">कृती (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {applications.map((app) => (
                  <tr key={app?.id || Math.random()} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-orange-700">{app?.trackingId || 'N/A'}</td>
                    <td className="p-3 font-semibold">{app?.serviceNameMr || 'सेवा'}</td>
                    <td className="p-3 text-slate-500">
                      {app?.appliedAt ? new Date(app.appliedAt).toLocaleDateString('mr-IN') : '-'}
                    </td>
                    <td className="p-3">
                      {app?.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          मंजूर (Approved)
                        </span>
                      )}
                      {app?.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          प्रलंबित (Under Review)
                        </span>
                      )}
                      {app?.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          नामंजूर
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedAppForReceipt({
                          receiptNo: `RCPT-${app?.id ? app.id.slice(-6) : '000000'}`,
                          trackingId: app?.trackingId || '',
                          applicantName: app?.applicantName || '',
                          serviceNameMr: app?.serviceNameMr || '',
                          feeAmount: `₹ ${app?.feeAmount || 20}.००`,
                          timestamp: app?.appliedAt || new Date()
                        })}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        पावती
                      </button>

                      {app?.status === 'approved' && (
                        <button
                          onClick={() => {
                            setSelectedAppForCert(app);
                            window.scrollTo({ top: 180, behavior: 'smooth' });
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          {isForm8(app) ? 'उतारा प्रिंट' : 'दाखला प्रिंट'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Grievances Complaint Tracking */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 no-print">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              माझ्या तक्रारींचा पाठपुरावा (My Complaints)
            </h2>
            <p className="text-xs text-slate-500">स्थानिक पाणी, रस्ते व वीज तक्रारींची सद्यस्थिती</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            एकूण: {grievances.length}
          </span>
        </div>

        {grievances.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">कोणतीही तक्रार नोंदवलेली नाही.</div>
        ) : (
          <div className="space-y-3">
            {grievances.map((g) => (
              <div key={g?.id || Math.random()} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-600">{g?.trackingId || 'N/A'}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">{g?.category || 'तक्रार'}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{g?.title || 'तक्रार विषय'}</h4>
                  <p className="text-xs text-slate-500">{g?.description || ''}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    g?.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g?.status === 'resolved' ? 'निवारण झाले' : 'प्रलंबित'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Digital Receipt Modal */}
      {selectedAppForReceipt && (
        <ReceiptModal
          receipt={selectedAppForReceipt}
          onClose={() => setSelectedAppForReceipt(null)}
        />
      )}

    </div>
  );
}