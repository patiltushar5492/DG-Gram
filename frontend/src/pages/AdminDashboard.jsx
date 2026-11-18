import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import CertificateTemplate from '../components/CertificateTemplate';
import Form8Template from '../components/Form8Template';
import ApplicationReviewModal from '../components/ApplicationReviewModal';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Bell, 
  Award, 
  Briefcase, 
  ExternalLink,
  Printer,
  FileCheck2,
  Layers,
  MessageSquare,
  HelpCircle,
  RefreshCw,
  Clock,
  MapPin,
  Send,
  Upload,
  Landmark,
  CreditCard,
  Building,
  BarChart3,
  FileUp,
  Settings,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  // 👇 येथे सेफ्टी चेक लावला आहे
  const { user, isAdmin, authLoading } = useAuth() || {};
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('applications');

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [certificateTypes, setCertificateTypes] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [villageProfile, setVillageProfile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [tickerText, setTickerText] = useState('');
  const [works, setWorks] = useState([]);
  const [grs, setGrs] = useState([]);

  const [certToPrint, setCertToPrint] = useState(null);
  const [selectedAppForReview, setSelectedAppForReview] = useState(null);
  const [alertNotice, setAlertNotice] = useState({ text: '', type: '' });
  const [selectedGrievanceForResolution, setSelectedGrievanceForResolution] = useState(null);
  const [resolutionInput, setResolutionInput] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState('resolved');

  const [newCertType, setNewCertType] = useState({
    nameMr: '',
    desc: '',
    deliveryDays: '२-३ दिवस',
    feeAmount: 20,
    requiredDocs: 'आधार कार्ड, स्थानिक रहिवासी पुरावा'
  });

  const [grUploadData, setGrUploadData] = useState({
    grNumber: '',
    title: '',
    department: 'ग्राम विकास व पंचायत राज विभाग, महाराष्ट्र शासन',
    category: 'वित्त व विकास निधी',
    date: new Date().toISOString().split('T')[0],
    summary: ''
  });
  const [selectedGrFile, setSelectedGrFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    badge: 'महत्त्वाची घोषणा',
    description: '',
    date: '२०२६',
    bgImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'तपशील पहा',
    buttonLink: '/services'
  });

  const [newWork, setNewWork] = useState({
    title: '',
    category: 'रस्ते व पायाभूत सुविधा',
    budget: '₹५,००,०००',
    spent: '₹०',
    progress: 10,
    status: 'चालू काम (In Progress)',
    fundingSource: '१५ वा वित्त आयोग',
    contractor: 'स्थानिक मजूर संस्था',
    location: 'गाळण बुद्रुक'
  });

  useEffect(() => {
    if (authLoading) return;

    // Robust check against both React context and localStorage
    const token = localStorage.getItem('dg_gram_token') || localStorage.getItem('token');
    const storedUserStr = localStorage.getItem('dg_gram_user');
    let isUserAdmin = isAdmin;

    if (!isUserAdmin && storedUserStr) {
      try {
        const u = JSON.parse(storedUserStr);
        isUserAdmin = u?.role === 'admin' || u?.isAdmin === true;
      } catch (e) {}
    }

    if (!token || !isUserAdmin) {
      navigate('/login', { replace: true });
      return;
    }

    loadAllData();
  }, [isAdmin, authLoading]);

  const isForm8 = (app) => {
    if (!app) return false;
    const type = (app.serviceType || '').toLowerCase();
    const name = (app.serviceNameMr || '').toLowerCase();
    return type.includes('namuna8') || type.includes('form8') || name.includes('नमुना नंबर ८') || name.includes('नमुना नं. ८') || name.includes('उतारा');
  };

  const showNotification = (text, type = 'success') => {
    setAlertNotice({ text, type });
    setTimeout(() => setAlertNotice({ text: '', type: '' }), 4000);
  };

  const loadAllData = async () => {
    const [sRes, aRes, grvRes, certRes, payRes, profRes, slRes, tRes, wRes, gRes] = await Promise.all([
      apiRequest('/admin/stats'),
      apiRequest('/admin/applications'),
      apiRequest('/admin/grievances'),
      apiRequest('/admin/certificate-types'),
      apiRequest('/payment-settings'),
      apiRequest('/village-profile'),
      apiRequest('/admin/hero-slides'),
      apiRequest('/ticker-notice'),
      apiRequest('/development-works'),
      apiRequest('/government-grs')
    ]);

    if (sRes.success) setStats(sRes.stats);
    if (aRes.success) setApplications(aRes.applications || []);
    if (grvRes.success) setGrievances(grvRes.grievances || []);
    if (certRes.success) setCertificateTypes(certRes.certificateTypes || []);
    if (payRes.success) setPaymentSettings(payRes.paymentSettings);
    if (profRes.success) setVillageProfile(profRes.profile);
    if (slRes.success) setSlides(slRes.slides || []);
    if (tRes.success && tRes.ticker) setTickerText(tRes.ticker.text);
    if (wRes.success) setWorks(wRes.works || []);
    if (gRes.success) setGrs(gRes.grs || []);
  };

  const handleUpdateAppStatus = async (id, status, customRemarks = null) => {
    let remarks = customRemarks;
    if (remarks === null) {
      remarks = prompt(
        status === 'approved' 
          ? 'मंजुरी शेरा प्रविष्ट करा (उदा. कागदपत्रे छाननी पूर्ण झाली):' 
          : 'नामंजुरीचे कारण प्रविष्ट करा:'
      );
      if (remarks === null) return;
    }

    const res = await apiRequest(`/admin/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, remarks })
    });

    if (res.success) {
      showNotification(res.message);
      if (selectedAppForReview && selectedAppForReview.id === id) {
        setSelectedAppForReview(null);
      }
      loadAllData();
    } else {
      showNotification(res.message || 'त्रुटी उद्भवली', 'error');
    }
  };

  const handleSaveGrievanceResolution = async (e) => {
    e.preventDefault();
    if (!selectedGrievanceForResolution) return;

    const res = await apiRequest(`/admin/grievances/${selectedGrievanceForResolution.id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: resolutionStatus,
        resolution: resolutionInput.trim()
      })
    });

    if (res.success) {
      showNotification(res.message);
      setSelectedGrievanceForResolution(null);
      loadAllData();
    } else {
      showNotification(res.message || 'त्रुटी उद्भवली', 'error');
    }
  };

  const handleAddCertType = async (e) => {
    e.preventDefault();
    if (!newCertType.nameMr) return;

    const res = await apiRequest('/admin/certificate-types', {
      method: 'POST',
      body: JSON.stringify(newCertType)
    });

    if (res.success) {
      showNotification(res.message);
      setNewCertType({
        nameMr: '',
        desc: '',
        deliveryDays: '२-३ दिवस',
        feeAmount: 20,
        requiredDocs: 'आधार कार्ड, स्थानिक रहिवासी पुरावा'
      });
      loadAllData();
    } else {
      showNotification(res.message || 'त्रुटी उद्भवली', 'error');
    }
  };

  const handleDeleteCertType = async (id) => {
    if (!confirm('आपण हा दाखला प्रकार हटवू इच्छिता का?')) return;
    const res = await apiRequest(`/admin/certificate-types/${id}`, { method: 'DELETE' });
    if (res.success) {
      showNotification(res.message);
      loadAllData();
    }
  };

  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/admin/payment-settings', {
      method: 'PUT',
      body: JSON.stringify(paymentSettings)
    });
    if (res.success) {
      showNotification(res.message);
      loadAllData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedGrFile(file);
      } else {
        alert('कृपया केवळ PDF फाईल अपलोड करा.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedGrFile(e.target.files[0]);
    }
  };

  const handleUploadGR = async (e) => {
    e.preventDefault();
    if (!grUploadData.grNumber || !grUploadData.title) {
      alert('कृपया जीआर क्रमांक व विषय भरा.');
      return;
    }

    const formData = new FormData();
    formData.append('grNumber', grUploadData.grNumber);
    formData.append('title', grUploadData.title);
    formData.append('department', grUploadData.department);
    formData.append('category', grUploadData.category);
    formData.append('date', grUploadData.date);
    formData.append('summary', grUploadData.summary);

    if (selectedGrFile) {
      formData.append('file', selectedGrFile);
    }

    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dg-gram.onrender.com';
      const res = await fetch(`${API_BASE_URL}/api/admin/government-grs/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        setGrUploadData({
          grNumber: '',
          title: '',
          department: 'ग्राम विकास व पंचायत राज विभाग, महाराष्ट्र शासन',
          category: 'वित्त व विकास निधी',
          date: new Date().toISOString().split('T')[0],
          summary: ''
        });
        setSelectedGrFile(null);
        loadAllData();
      } else {
        showNotification(data.message || 'अपलोड करताना त्रुटी आली', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('सर्व्हर त्रुटी', 'error');
    }
  };

  const handleDeleteGR = async (id) => {
    if (!confirm('सदर शासन निर्णय हटवू इच्छिता का?')) return;
    const res = await apiRequest(`/admin/government-grs/${id}`, { method: 'DELETE' });
    if (res.success) {
      showNotification(res.message);
      loadAllData();
    }
  };

  const handleSaveVillageProfile = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/admin/village-profile', {
      method: 'PUT',
      body: JSON.stringify(villageProfile)
    });
    if (res.success) {
      showNotification(res.message);
      loadAllData();
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newSlide.title) return;
    const res = await apiRequest('/admin/hero-slides', {
      method: 'POST',
      body: JSON.stringify(newSlide)
    });
    if (res.success) {
      showNotification(res.message);
      setNewSlide({
        title: '',
        subtitle: '',
        badge: 'महत्त्वाची घोषणा',
        description: '',
        date: '२०२६',
        bgImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'तपशील पहा',
        buttonLink: '/services'
      });
      loadAllData();
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!confirm('बॅनर हटवू इच्छिता का?')) return;
    const res = await apiRequest(`/admin/hero-slides/${id}`, { method: 'DELETE' });
    if (res.success) {
      showNotification(res.message);
      loadAllData();
    }
  };

  const handleUpdateTicker = async (e) => {
    e.preventDefault();
    const res = await apiRequest('/admin/ticker-notice', {
      method: 'PUT',
      body: JSON.stringify({ text: tickerText, enabled: true })
    });
    if (res.success) {
      showNotification('स्क्रोलिंग सूचना पट्टी तात्काळ अद्ययावत केली!');
    }
  };

  const handleAddWork = async (e) => {
    e.preventDefault();
    if (!newWork.title) return;
    const res = await apiRequest('/admin/development-works', {
      method: 'POST',
      body: JSON.stringify(newWork)
    });
    if (res.success) {
      showNotification(res.message);
      setNewWork({
        title: '',
        category: 'रस्ते व पायाभूत सुविधा',
        budget: '₹५,००,०००',
        spent: '₹०',
        progress: 10,
        status: 'चालू काम (In Progress)',
        fundingSource: '१५ वा वित्त आयोग',
        contractor: 'स्थानिक मजूर संस्था',
        location: 'गाळण बुद्रुक'
      });
      loadAllData();
    }
  };

  const handleDeleteWork = async (id) => {
    if (!confirm('विकासकाम हटवू इच्छिता का?')) return;
    const res = await apiRequest(`/admin/development-works/${id}`, { method: 'DELETE' });
    if (res.success) {
      showNotification(res.message);
      loadAllData();
    }
  };

  // 👇 डॅशबोर्ड डेटा लोड होईपर्यंत सुरक्षित राहण्यासाठी चेक
  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 font-bold">
        प्रशासन डॅशबोर्ड लोड होत आहे...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print border-b-4 border-orange-500">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <ShieldCheck className="w-4 h-4" />
            <span>१००% एडमिन नियंत्रित ई-प्रशासन प्रणाली (100% Admin CMS Console)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            सरपंच व ग्रामसेवक डिजिटल प्रशासन केंद्र
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            गाळण बुद्रुक: संकेतस्थळाचा संपूर्ण मजकूर, दाखला प्रकार, बँक खाते, शासन निर्णय व सांख्यिकी थेट नियंत्रित करा.
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          रिफ्रेश करा
        </button>
      </div>

      {alertNotice.text && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in no-print ${
          alertNotice.type === 'error' ? 'bg-red-50 text-red-800 border border-red-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
        }`}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{alertNotice.text}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">दाखले अर्ज</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.totalApplications}
          </div>
          <div className="text-xs font-semibold text-amber-600 mt-1">
            {stats.pendingApplications} प्रलंबित (Under Review)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">तक्रारी निवारण</span>
          <div className="text-2xl sm:text-3xl font-black text-red-600 mt-1">
            {stats.totalGrievances}
          </div>
          <div className="text-xs font-semibold text-emerald-700 mt-1">
            {stats.resolvedGrievances} सोडवल्या ({stats.openGrievances} चालू)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">दाखला प्रकार (CMS)</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
            {certificateTypes.length}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            नागरिकांसाठी थेट उपलब्ध
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block uppercase">शासन निर्णय व जीआर</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
            {stats.governmentGRsCount}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            PDF व परिपत्रके संकलन
          </div>
        </div>
      </div>

      {certToPrint && (
        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-emerald-400 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 no-print">
            <h3 className="font-bold text-emerald-950 text-base">
              प्रशासकीय {isForm8(certToPrint) ? 'गाव नमुना नं. ८ उतारा' : 'दाखला'} प्रिंटिंग व्ह्यू: {certToPrint.applicantName} ({certToPrint.serviceNameMr})
            </h3>
            <button
              onClick={() => setCertToPrint(null)}
              className="text-xs bg-slate-200 hover:bg-slate-300 font-bold px-3 py-1.5 rounded-lg text-slate-700 cursor-pointer"
            >
              बंद करा
            </button>
          </div>
          {isForm8(certToPrint) ? (
            <Form8Template application={certToPrint} />
          ) : (
            <CertificateTemplate application={certToPrint} />
          )}
        </div>
      )}

      {selectedAppForReview && (
        <ApplicationReviewModal
          application={selectedAppForReview}
          onClose={() => setSelectedAppForReview(null)}
          onApprove={(app, remarks) => handleUpdateAppStatus(app.id, 'approved', remarks)}
          onReject={(app, remarks) => handleUpdateAppStatus(app.id, 'rejected', remarks)}
          onPrintCertificate={(app) => {
            setSelectedAppForReview(null);
            setCertToPrint(app);
            window.scrollTo({ top: 350, behavior: 'smooth' });
          }}
        />
      )}

      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-print pb-1">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'applications' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          १. नागरी दाखले मंजुरी ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('grievances')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'grievances' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          २. तक्रार निवारण ({grievances.length})
        </button>

        <button
          onClick={() => setActiveTab('certTypes')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'certTypes' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          ३. नवीन दाखला प्रकार जोडा (CMS)
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'payment' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          ४. बँक खाते व देयक सेटिंग्ज
        </button>

        <button
          onClick={() => setActiveTab('grUpload')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'grUpload' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          ५. शासन निर्णय PDF अपलोड
        </button>

        <button
          onClick={() => setActiveTab('villageCms')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'villageCms' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          ६. गाव सांख्यिकी व माहिती CMS
        </button>

        <button
          onClick={() => setActiveTab('slider')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'slider' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          ७. मुख्यपृष्ठ बॅनर व स्क्रोलिंग पट्टी
        </button>

        <button
          onClick={() => setActiveTab('works')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'works' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          ८. विकासकामे ({works.length})
        </button>
      </div>

      {activeTab === 'applications' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 no-print">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              नागरिक दाखले अर्ज छाननी व डिजिटल मंजुरी
            </h2>
            <p className="text-xs text-slate-500">
              येथून अर्ज तपासून 'मंजूर' करा. मंजूर होताच अर्जदाराला अधिकृत डिजिटल दाखला तात्काळ उपलब्ध होतो.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">ट्रॅकिंग आयडी</th>
                  <th className="p-3">अर्जदाराचे नाव</th>
                  <th className="p-3">दाखला प्रकार</th>
                  <th className="p-3">वास्तव्य वर्षे</th>
                  <th className="p-3">तारीख</th>
                  <th className="p-3">स्थिती</th>
                  <th className="p-3 text-right">प्रशासकीय कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-orange-700">{app.trackingId}</td>
                    <td className="p-3 font-bold text-slate-900">{app.applicantName}</td>
                    <td className="p-3">{app.serviceNameMr}</td>
                    <td className="p-3">{app.residingSinceYears} वर्षे</td>
                    <td className="p-3 text-slate-500">{new Date(app.appliedAt).toLocaleDateString('mr-IN')}</td>
                    <td className="p-3">
                      {app.status === 'approved' && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          मंजूर (Approved)
                        </span>
                      )}
                      {app.status === 'pending' && (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          प्रलंबित (Pending)
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          नामंजूर (Rejected)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedAppForReview(app)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="कागदपत्रे व देयक तपासणी"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>तपासा (Review)</span>
                      </button>

                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            मंजूर करा
                          </button>
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                            className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            नामंजूर
                          </button>
                        </>
                      )}

                      {app.status === 'approved' && (
                        <button
                          onClick={() => {
                            setCertToPrint(app);
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          {isForm8(app) ? 'उतारा प्रिंट' : 'दाखला प्रिंट'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'grievances' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 no-print">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                स्थानिक नागरिक तक्रार निवारण व्यवस्थापन
              </h2>
              <p className="text-xs text-slate-500">
                ग्रामस्थांनी नोंदवलेल्या समस्यांची तपासणी करा, दर्जा बदला आणि अधिकृत निवारण शेरा नोंदवा.
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
              एकूण तक्रारी: {grievances.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">तक्रार ट्रॅकिंग</th>
                  <th className="p-3">तक्रारदार</th>
                  <th className="p-3">वर्गवारी</th>
                  <th className="p-3">विषय व ठिकाण</th>
                  <th className="p-3">तारीख</th>
                  <th className="p-3">स्थिती</th>
                  <th className="p-3 text-right">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {grievances.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-red-700">{g.trackingId}</td>
                    <td className="p-3 font-bold text-slate-900">
                      {g.citizenName}
                      <div className="text-[10px] text-slate-500 font-normal">{g.mobile}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                        {g.category}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{g.title}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                        <span className="truncate">{g.location}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(g.createdAt).toLocaleDateString('mr-IN')}</td>
                    <td className="p-3">
                      {g.status === 'resolved' && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          निवारण झाले
                        </span>
                      )}
                      {g.status === 'in_progress' && (
                        <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          काम चालू आहे
                        </span>
                      )}
                      {(g.status === 'open' || g.status === 'pending') && (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          प्रलंबित
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedGrievanceForResolution(g);
                          setResolutionInput(g.resolution || '');
                          setResolutionStatus(g.status === 'open' ? 'in_progress' : g.status);
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        निवारण करा
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedGrievanceForResolution && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-red-700">
                  {selectedGrievanceForResolution.trackingId}
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  तक्रार निवारण व दर्जा अद्ययावत
                </h3>
              </div>
              <button
                onClick={() => setSelectedGrievanceForResolution(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <p><strong>तक्रारदार:</strong> {selectedGrievanceForResolution.citizenName} ({selectedGrievanceForResolution.mobile})</p>
              <p><strong>विषय:</strong> {selectedGrievanceForResolution.title}</p>
              <p><strong>ठिकाण:</strong> {selectedGrievanceForResolution.location}</p>
              <p className="text-slate-600"><strong>तपशील:</strong> {selectedGrievanceForResolution.description}</p>
            </div>

            <form onSubmit={handleSaveGrievanceResolution} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  नवीन दर्जा (Status) *:
                </label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                >
                  <option value="in_progress">काम चालू आहे (In Progress)</option>
                  <option value="resolved">पूर्ण / निवारण झाले (Resolved)</option>
                  <option value="rejected">नाकारण्यात आली (Rejected)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  प्रशासकीय निवारण शेरा (Official Resolution / Remarks) *:
                </label>
                <textarea
                  rows={3}
                  placeholder="उदा. कर्मचारी पाठवून पाईपलाईन दुरुस्त करण्यात आली आहे..."
                  value={resolutionInput}
                  onChange={(e) => setResolutionInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrievanceForResolution(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  शेरा जतन करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'certTypes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 lg:col-span-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>नवीन दाखला प्रकार जोडा (Add Certificate)</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              येथे जोडलेला नवीन दाखला थेट मुख्य संकेतस्थळावर नागरी अर्जासाठी उपलब्ध होतो.
            </p>

            <form onSubmit={handleAddCertType} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">दाखल्याचे नाव *:</label>
                <input
                  type="text"
                  placeholder="उदा. गाव नमुना नंबर ८ आकारणी उतारा"
                  value={newCertType.nameMr}
                  onChange={(e) => setNewCertType({ ...newCertType, nameMr: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">थोडक्यात माहिती / उपयोग:</label>
                <textarea
                  rows={2}
                  placeholder="उदा. मिळकत कर भरणा व वारस हक्क नोंदीसाठी."
                  value={newCertType.desc}
                  onChange={(e) => setNewCertType({ ...newCertType, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">सेवा शुल्क (₹):</label>
                  <input
                    type="number"
                    value={newCertType.feeAmount}
                    onChange={(e) => setNewCertType({ ...newCertType, feeAmount: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">कालावधी:</label>
                  <input
                    type="text"
                    value={newCertType.deliveryDays}
                    onChange={(e) => setNewCertType({ ...newCertType, deliveryDays: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">आवश्यक कागदपत्रे:</label>
                <input
                  type="text"
                  placeholder="आधार कार्ड, वीज बिल, कर पावती"
                  value={newCertType.requiredDocs}
                  onChange={(e) => setNewCertType({ ...newCertType, requiredDocs: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>दाखला प्रकार सक्रिय करा</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 lg:col-span-2">
            <h3 className="text-base font-bold text-slate-900">
              सक्रिय दाखले व प्रमाणपत्र प्रकार ({certificateTypes.length})
            </h3>

            <div className="space-y-3">
              {certificateTypes.map((c) => (
                <div key={c.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-start bg-slate-50/50 hover:bg-indigo-50/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{c.nameMr}</span>
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {c.fee}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">({c.deliveryDays})</span>
                    </div>
                    <p className="text-xs text-slate-600">{c.desc}</p>
                    <p className="text-[11px] text-slate-500">
                      आवश्यक कागदपत्रे: <strong className="text-slate-700">{c.requiredDocs}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCertType(c.id)}
                    title="हटवा"
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payment' && paymentSettings && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 no-print max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-600" />
              <span>ग्रामपंचायत बँक खाते व देयक सेटिंग्ज (Bank & Payment Settings)</span>
            </h2>
            <p className="text-xs text-slate-500">
              नागरिकांनी भरलेले सर्व दाखला शुल्क ज्या अधिकृत खात्यात जमा होईल त्याचे तपशील येथे बदला.
            </p>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">बँकेचे नाव (Bank Name) *:</label>
                <input
                  type="text"
                  value={paymentSettings.bankName}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">शाखा (Branch) *:</label>
                <input
                  type="text"
                  value={paymentSettings.branchName}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, branchName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">खातेधारक नाव (Account Holder) *:</label>
                <input
                  type="text"
                  value={paymentSettings.accountHolderName}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, accountHolderName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">बँक खाते क्रमांक (Account Number) *:</label>
                <input
                  type="text"
                  value={paymentSettings.accountNumber}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">IFSC कोड *:</label>
                <input
                  type="text"
                  value={paymentSettings.ifscCode}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, ifscCode: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID (GooglePay / PhonePe) *:</label>
                <input
                  type="text"
                  value={paymentSettings.upiId}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">पावती व कर सूचना संदेश (Receipt Note):</label>
              <textarea
                rows={2}
                value={paymentSettings.taxReceiptNotice}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, taxReceiptNotice: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>बँक व देयक तपशील जतन करा</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {activeTab === 'grUpload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 lg:col-span-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-amber-600" />
              <span>शासन निर्णय PDF ड्रॅग-अँड-ड्रॉप अपलोड</span>
            </h3>
            <p className="text-xs text-slate-500">
              मंत्रालय किंवा जिल्हा परिषदेचे अधिकृत PDF परिपत्रक येथे ड्रॅग आणि ड्रॉप करा.
            </p>

            <form onSubmit={handleUploadGR} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">जीआर क्रमांक *:</label>
                <input
                  type="text"
                  placeholder="उदा. ग्रामवि-२०२६/प्र.क्र.५५"
                  value={grUploadData.grNumber}
                  onChange={(e) => setGrUploadData({ ...grUploadData, grNumber: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">विषय (Title) *:</label>
                <input
                  type="text"
                  placeholder="उदा. १५ वा वित्त आयोग निधी वाटप नियमावली"
                  value={grUploadData.title}
                  onChange={(e) => setGrUploadData({ ...grUploadData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">विभाग:</label>
                <input
                  type="text"
                  value={grUploadData.department}
                  onChange={(e) => setGrUploadData({ ...grUploadData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अधिकृत PDF फाईल:</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-amber-500 bg-amber-50' : 'border-slate-300 hover:border-amber-400 bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-amber-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-800">
                    {selectedGrFile ? selectedGrFile.name : 'PDF फाईल येथे ड्रॅग करा किंवा निवडा'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    (Max: 25MB - PDF Format)
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">संक्षिप्त सारांश:</label>
                <textarea
                  rows={2}
                  value={grUploadData.summary}
                  onChange={(e) => setGrUploadData({ ...grUploadData, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>जीआर प्रसिद्ध करा (Publish GR)</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 lg:col-span-2">
            <h3 className="text-base font-bold text-slate-900">
              पोर्टलवरील सर्व शासन निर्णय व परिपत्रके ({grs.length})
            </h3>

            <div className="space-y-3">
              {grs.map((g) => (
                <div key={g.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-start bg-slate-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                        {g.grNumber}
                      </span>
                      {g.fileUrl ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          अपलोड केलेली PDF
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                          डिजिटल ई-प्रत
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{g.title}</h4>
                    <p className="text-[11px] text-slate-500">{g.department} | दिनांक: {g.date} | आकार: {g.fileSize}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => window.open(`https://dg-gram.onrender.com/api/government-grs/${g.id}/download`, '_blank')}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer"
                    >
                      पहा
                    </button>
                    <button
                      onClick={() => handleDeleteGR(g.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'villageCms' && villageProfile && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 no-print max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>गावाची अधिकृत सांख्यिकी व मजकूर CMS (Content & Statistics Management)</span>
            </h2>
            <p className="text-xs text-slate-500">
              गावाची लोकसंख्या, साक्षरता दर, भौगोलिक माहिती व आरोग्य सुविधांचा मजकूर येथे संपादित करा. मुख्य संकेतस्थळावर तात्काळ अपडेट होईल.
            </p>
          </div>

          <form onSubmit={handleSaveVillageProfile} className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
                १. गाव सांख्यिकी आकडेवारी (Village Statistics)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">एकूण लोकसंख्या:</label>
                  <input
                    type="text"
                    value={villageProfile.statistics?.population || ''}
                    onChange={(e) => setVillageProfile({
                      ...villageProfile,
                      statistics: { ...villageProfile.statistics, population: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">एकूण कुटुंबे:</label>
                  <input
                    type="text"
                    value={villageProfile.statistics?.totalHouseholds || ''}
                    onChange={(e) => setVillageProfile({
                      ...villageProfile,
                      statistics: { ...villageProfile.statistics, totalHouseholds: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">साक्षरता दर:</label>
                  <input
                    type="text"
                    value={villageProfile.statistics?.literacyRate || ''}
                    onChange={(e) => setVillageProfile({
                      ...villageProfile,
                      statistics: { ...villageProfile.statistics, literacyRate: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">प्रभाग / वॉर्ड संख्या:</label>
                  <input
                    type="text"
                    value={villageProfile.statistics?.wardCount || ''}
                    onChange={(e) => setVillageProfile({
                      ...villageProfile,
                      statistics: { ...villageProfile.statistics, wardCount: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
                २. माहितीपर विभाग (Geographic, Education & Health Details)
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">भौगोलिक स्थान व संपर्क मजकूर:</label>
                <textarea
                  rows={2}
                  value={villageProfile.aboutSections?.locationText || ''}
                  onChange={(e) => setVillageProfile({
                    ...villageProfile,
                    aboutSections: { ...villageProfile.aboutSections, locationText: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">शैक्षणिक व सामाजिक सुविधा मजकूर:</label>
                <textarea
                  rows={2}
                  value={villageProfile.aboutSections?.educationText || ''}
                  onChange={(e) => setVillageProfile({
                    ...villageProfile,
                    aboutSections: { ...villageProfile.aboutSections, educationText: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">आरोग्य व पेयजल व्यवस्था मजकूर:</label>
                <textarea
                  rows={2}
                  value={villageProfile.aboutSections?.healthWaterText || ''}
                  onChange={(e) => setVillageProfile({
                    ...villageProfile,
                    aboutSections: { ...villageProfile.aboutSections, healthWaterText: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>माहिती व सांख्यिकी सेव्ह करा</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {activeTab === 'slider' && (
        <div className="space-y-8 no-print">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <span>तात्काळ स्क्रोलिंग सूचना पट्टी नियंत्रण (Notice Ticker)</span>
            </h3>

            <form onSubmit={handleUpdateTicker} className="flex gap-2">
              <input
                type="text"
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                placeholder="उदा. 📢 महत्त्वपूर्ण सूचना: सन २०२६-२७ ची घरपट्टी ३१ मार्च पर्यंत भरावी..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 font-semibold"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-xs"
              >
                अपडेट करा
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-orange-600" />
                <span>नवीन बॅनर स्लाइड जोडा</span>
              </h3>

              <form onSubmit={handleAddSlide} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">बॅज:</label>
                  <input
                    type="text"
                    value={newSlide.badge}
                    onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">शीर्षक *:</label>
                  <input
                    type="text"
                    value={newSlide.title}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">उपशीर्षक:</label>
                  <input
                    type="text"
                    value={newSlide.subtitle}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">तपशील:</label>
                  <textarea
                    rows={2}
                    value={newSlide.description}
                    onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">बॅकग्राउंड फोटो URL:</label>
                  <input
                    type="url"
                    value={newSlide.bgImage}
                    onChange={(e) => setNewSlide({ ...newSlide, bgImage: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>स्लाइड प्रकाशित करा</span>
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                सक्रिय बॅनर स्लाईड्स ({slides.length})
              </h3>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {slides.map((s) => (
                  <div key={s.id} className="border border-slate-200 rounded-xl p-3 flex gap-3 items-center bg-slate-50/50">
                    <img
                      src={s.bgImage}
                      alt={s.title}
                      className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-orange-600 font-bold uppercase">{s.badge}</div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{s.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{s.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSlide(s.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'works' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 lg:col-span-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>नवीन विकासकाम जोडा</span>
            </h3>

            <form onSubmit={handleAddWork} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">कामाचे नाव *:</label>
                <input
                  type="text"
                  placeholder="उदा. सिमेंट काँक्रीट रस्ता"
                  value={newWork.title}
                  onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अंदाजपत्रक (Budget) *:</label>
                <input
                  type="text"
                  value={newWork.budget}
                  onChange={(e) => setNewWork({ ...newWork, budget: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">स्थान:</label>
                <input
                  type="text"
                  value={newWork.location}
                  onChange={(e) => setNewWork({ ...newWork, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">प्रगती टक्केवारी: {newWork.progress}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newWork.progress}
                  onChange={(e) => setNewWork({ ...newWork, progress: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-xs"
              >
                विकासकाम नोंदवा
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 lg:col-span-2">
            <h3 className="text-base font-bold text-slate-900">
              नोंदणीकृत सर्व विकासकामे ({works.length})
            </h3>

            <div className="space-y-3">
              {works.map((w) => (
                <div key={w.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center bg-slate-50/50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {w.fundingSource}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{w.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      स्थान: {w.location} | निधी: <strong className="text-slate-800">{w.budget}</strong> | प्रगती: {w.progress}%
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteWork(w.id)}
                    className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}