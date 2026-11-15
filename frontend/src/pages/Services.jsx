import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import ReceiptModal from '../components/ReceiptModal';
import PaymentGateModal from '../components/PaymentGateModal';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  Send, 
  FileCheck2, 
  ShieldCheck, 
  User, 
  Phone, 
  Home as HomeIcon,
  CreditCard,
  Building2,
  Landmark,
  QrCode,
  Upload,
  FileUp,
  File,
  Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Services() {
  // 👇 येथे '|| {}' सेफ्टी चेक लावला आहे
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  // Dynamic certificate types fetched from Backend / Admin CMS
  const [serviceCatalog, setServiceCatalog] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application Details
  const [formData, setFormData] = useState({
    applicantName: '',
    fatherOrHusbandName: '',
    mobile: '',
    email: '',
    aadhaarNumber: '',
    purpose: '',
    address: 'गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव',
    residingSinceYears: 20,
    documentsNote: 'सर्व आवश्यक कागदपत्रांची प्रत सोबत जोडलेली आहे.'
  });

  // जेव्हा user डेटा सर्व्हरकडून येईल, तेव्हा फॉर्म अपडेट होईल
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        applicantName: prev.applicantName || user.name || '',
        mobile: prev.mobile || user.mobile || '',
        email: prev.email || user.email || '',
        address: prev.address || user.address || 'गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव'
      }));
    }
  }, [user]);

  // Mandatory Document Upload States
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [residenceProofFile, setResidenceProofFile] = useState(null);
  const [optionalDocFile, setOptionalDocFile] = useState(null);

  // Payment Gateway Gate Modal State
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    Promise.all([
      apiRequest('/certificate-types'),
      apiRequest('/payment-settings')
    ]).then(([certRes, payRes]) => {
      if (certRes && certRes.success && certRes.certificateTypes && certRes.certificateTypes.length > 0) {
        setServiceCatalog(certRes.certificateTypes);
        setSelectedService(certRes.certificateTypes[0]);
      }
      if (payRes && payRes.success) {
        setPaymentSettings(payRes.paymentSettings);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Step 1: Validate Details and Mandatory Uploads, then trigger Payment Gate
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('कृपया अर्ज करण्यासाठी प्रथम लॉगिन किंवा नोंदणी करा.');
      navigate('/login');
      return;
    }

    if (!formData.applicantName || !formData.purpose) {
      setErrorMsg('कृपया अर्जदाराचे नाव व दाखला कशासाठी हवा आहे ते नमूद करा.');
      return;
    }

    // Strict Check: Mandatory Document Upload Verification
    if (!aadhaarFile) {
      setErrorMsg('कृपया आधार कार्ड किंवा ओळखपत्राची प्रत (PDF/प्रतिमा) अपलोड करणे अनिवार्य आहे.');
      return;
    }

    if (!residenceProofFile) {
      setErrorMsg('कृपया रहिवासी पुरावा / घरपट्टी पावती / वीज बिल प्रत अपलोड करणे अनिवार्य आहे.');
      return;
    }

    // Open Payment Gate
    setShowPaymentGate(true);
  };

  // Step 2: Payment Gate Success -> Submit Application to Backend with Payment Details
  const handlePaymentSuccess = async (paymentDetails) => {
    setShowPaymentGate(false);
    setSubmitting(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('dg_gram_token') || localStorage.getItem('token');
      const fd = new FormData();

      // Text fields
      fd.append('applicantName', formData.applicantName || '');
      fd.append('fatherOrHusbandName', formData.fatherOrHusbandName || '');
      fd.append('mobile', formData.mobile || '');
      fd.append('email', formData.email || '');
      fd.append('aadhaarNumber', formData.aadhaarNumber || '');
      fd.append('serviceType', selectedService?.id || '');
      fd.append('serviceNameMr', selectedService?.nameMr || '');
      fd.append('purpose', formData.purpose || '');
      fd.append('address', formData.address || '');
      fd.append('residingSinceYears', String(formData.residingSinceYears || 20));
      fd.append('documentsNote',
        `आधार प्रत: ${aadhaarFile?.name || '-'}, रहिवासी पुरावा: ${residenceProofFile?.name || '-'}` +
        (optionalDocFile ? `, इतर: ${optionalDocFile.name}` : '')
      );

      // Payment details as a JSON string field
      fd.append('paymentDetailsJson', JSON.stringify(paymentDetails));

      // Actual files
      if (aadhaarFile)        fd.append('aadhaarFile',        aadhaarFile);
      if (residenceProofFile) fd.append('residenceProofFile', residenceProofFile);
      if (optionalDocFile)    fd.append('optionalDocFile',    optionalDocFile);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dg-gram.onrender.com';
      const rawRes = await fetch(`${API_BASE_URL}/api/applications/apply`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: fd
      });
      const res = await rawRes.json();

      setSubmitting(false);

      if (res && res.success && res.receipt) {
        setSuccessReceipt(res.receipt);
        setFormData({
          applicantName: user?.name || '',
          fatherOrHusbandName: '',
          mobile: user?.mobile || '',
          email: user?.email || '',
          aadhaarNumber: '',
          purpose: '',
          address: user?.address || 'गाळण बुद्रुक, ता. पाचोरा',
          residingSinceYears: 20,
          documentsNote: 'कागदपत्रे तपासणीसाठी तयार आहेत.'
        });
        setAadhaarFile(null);
        setResidenceProofFile(null);
        setOptionalDocFile(null);
      } else {
        setErrorMsg(res?.message || 'अर्जात त्रुटी आढळली. कृपया पुन्हा प्रयत्न करा.');
      }
    } catch (err) {
      setSubmitting(false);
      console.error('Application submit error:', err);
      setErrorMsg('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-2xl space-y-2">
          <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            आपले सरकार ई-सेवा
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            नागरी सेवा व अधिकृत दाखले अर्ज
          </h1>
          <p className="text-sm text-orange-100 leading-relaxed">
            ग्रामपंचायत गाळण बुद्रुक: कागदपत्रे जोडा, अधिकृत शासकीय शुल्क भरा आणि डिजिटल स्वाक्षरीसह अधिकृत दाखला (उदा. नमुना ८, रहिवासी) घरबसल्या मिळवा.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              १. उपलब्ध सेवा व दाखल्यांचा प्रकार निवडा
            </h2>
            <p className="text-xs text-slate-500">
              आवश्यक दाखल्यावर क्लिक करून खालील अर्ज व कागदपत्रे अपलोड करा.
            </p>
          </div>
          <span className="text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-lg">
            उपलब्ध दाखले: {serviceCatalog.length}
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">दाखले यादी लोड होत आहे...</div>
        ) : serviceCatalog.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
            सध्या कोणतेही दाखले उपलब्ध नाहीत.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCatalog.map((s) => {
              const isSelected = selectedService?.id === s?.id;
              return (
                <div
                  key={s?.id || Math.random()}
                  onClick={() => handleServiceSelect(s)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-orange-500 bg-orange-50/40 shadow-md ring-2 ring-orange-400/20' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-600" />
                        {s?.deliveryDays || '२-३ दिवस'}
                      </span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        शुल्क: {s?.fee || '₹ २०'}
                      </span>
                    </div>

                    <h3 className={`font-bold text-base leading-snug ${isSelected ? 'text-orange-700' : 'text-slate-900'}`}>
                      {s?.nameMr || 'दाखला सेवा'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {s?.desc || ''}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">आवश्यक कागदपत्रे:</span> {s?.requiredDocs || 'आधार कार्ड'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Application & Mandatory Upload Form */}
      {selectedService && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                २. ऑनलाइन अर्ज व कागदपत्रे अपलोड
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {selectedService?.nameMr || 'दाखला'} साठी अर्ज
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold">
                शासकीय शुल्क: {selectedService?.fee || '₹ २०'}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!user && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl text-xs flex justify-between items-center">
              <span>आपण लॉगिन केलेले नाही. कृपया अर्ज सबमिट करण्यापूर्वी लॉगिन करा.</span>
              <Link to="/login" className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                लॉगिन करा
              </Link>
            </div>
          )}

          <form onSubmit={handleProceedToPayment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  अर्जदाराचे संपूर्ण नाव (Applicant Full Name) *
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleChange}
                  required
                  placeholder="उदा. राजेंद्र सोपान पाटील"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  वडीलांचे किंवा पतीचे नाव (Father / Husband Name)
                </label>
                <input
                  type="text"
                  name="fatherOrHusbandName"
                  value={formData.fatherOrHusbandName}
                  onChange={handleChange}
                  placeholder="उदा. सोपान रामभाऊ पाटील"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मोबाईल क्रमांक (Mobile Number) *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  placeholder="उदा. ९८२३००००००"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  आधार क्रमांक (Aadhaar Number) *
                </label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  required
                  placeholder="XXXX-XXXX-8921"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  गावात किती वर्षांपासून वास्तव्य आहे? (Years of Residence)
                </label>
                <input
                  type="number"
                  name="residingSinceYears"
                  value={formData.residingSinceYears}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  दाखला कशासाठी पाहिजे आहे? (Purpose of Certificate) *
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  placeholder="उदा. शैक्षणिक शिष्यवृत्ती, रेशन कार्ड, बँक खाते उघडणे"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                सध्याचा संपूर्ण पत्ता (Full Address in Gadan Budruk) *
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            {/* MANDATORY DOCUMENT UPLOAD SECTION */}
            <div className="bg-amber-50/60 border-2 border-amber-300 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-amber-700" />
                <h4 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                  ३. अनिवार्य कागदपत्रे अपलोड (Mandatory Document Uploads) *
                </h4>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                महाराष्ट्र शासनाच्या नियमांनुसार अर्जाची छाननी करण्यासाठी खालील कागदपत्रांची प्रत (PDF किंवा फोटो) जोडणे अनिवार्य आहे.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* 1. Aadhaar Card Upload */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    १. आधार कार्ड / ओळखपत्र प्रत (Aadhaar Card) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    required
                    onChange={(e) => setAadhaarFile(e.target.files[0])}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer"
                  />
                  {aadhaarFile && (
                    <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{aadhaarFile.name} जोडले</span>
                    </div>
                  )}
                </div>

                {/* 2. Residence / Property Tax Proof */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    २. रहिवासी पुरावा / घरपट्टी पावती / वीज बिल *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    required
                    onChange={(e) => setResidenceProofFile(e.target.files[0])}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer"
                  />
                  {residenceProofFile && (
                    <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{residenceProofFile.name} जोडले</span>
                    </div>
                  )}
                </div>

                {/* 3. Optional Supporting Doc */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800">
                    ३. इतर संबंधित कागदपत्र (हॉस्पिटल डिस्चार्ज स्लिप / वारस पुरावा / लग्नपत्रिका - ऐच्छिक)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setOptionalDocFile(e.target.files[0])}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-orange-600 focus:ring-orange-500" />
                <span>
                  मी प्रमाणित करतो/करते की वर दिलेली सर्व माहिती सत्य व अचूक असून जोडलेली कागदपत्रे खरी आहेत. पुढील टप्प्यात शासकीय देयक भरण्यास माझी संमती आहे.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 text-sm"
              >
                <Lock className="w-4 h-4" />
                <span>शुल्क भरणा व अर्ज सबमिट करा (Proceed to Payment)</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* MANDATORY PAYMENT GATEWAY MODAL */}
      {showPaymentGate && selectedService && (
        <PaymentGateModal
          service={selectedService}
          applicantData={formData}
          paymentSettings={paymentSettings}
          isProcessing={isProcessingPayment}
          setIsProcessing={setIsProcessingPayment}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentGate(false)}
        />
      )}

      {/* SUCCESS DIGITAL TRANSACTION RECEIPT */}
      {successReceipt && (
        <ReceiptModal
          receipt={successReceipt}
          onClose={() => setSuccessReceipt(null)}
        />
      )}

    </div>
  );
}