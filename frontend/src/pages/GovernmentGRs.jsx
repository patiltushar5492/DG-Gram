import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Landmark, 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  Award,
  Building2,
  FileCheck2,
  Share2,
  Eye,
  Printer,
  X
} from 'lucide-react';

export default function GovernmentGRs() {
  const [grs, setGrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState('');
  const [activePreviewGR, setActivePreviewGR] = useState(null);

  const categories = [
    { id: 'all', label: 'सर्व शासन निर्णय (All GRs)' },
    { id: 'वित्त', label: 'वित्त व १५ वा वित्त आयोग' },
    { id: 'जल जीवन', label: 'जल जीवन मिशन व पाणीपुरवठा' },
    { id: 'जिल्हा परिषद', label: 'जिल्हा परिषद जळगाव परिपत्रके' },
    { id: 'रोजगार हमी', label: 'मनरेगा व शेती योजना' },
    { id: 'स्वच्छता', label: 'स्वच्छ भारत मिशन' }
  ];

  const fetchGRs = async () => {
    setLoading(true);
    let query = `?category=${selectedCategory}`;
    if (search.trim()) {
      query += `&search=${encodeURIComponent(search.trim())}`;
    }
    const res = await apiRequest(`/government-grs${query}`);
    if (res && res.success && res.grs) {
      setGrs(res.grs);
    } else {
      setGrs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGRs();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGRs();
  };

  // Open direct printable official document in new window
  const handleOpenGR = (gr) => {
    if (gr && gr.id) {
      window.open(`/api/government-grs/${gr.id}/download`, '_blank');
    }
  };

  // Trigger modal preview
  const handlePreview = (gr) => {
    setActivePreviewGR(gr);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner Dedicated Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none"></div>
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>अधिकृत राज्य व जिल्हा परिषद आदेश</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            शासन निर्णय व जीआर (Government GRs & Circulars)
          </h1>
          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
            महाराष्ट्र शासन, ग्राम विकास विभाग, पंचायत राज संचालनालय आणि जिल्हा परिषद जळगाव यांनी जारी केलेले सर्व अधिकृत शासन निर्णय (GRs), परिपत्रके व विकास अधिसूचनांचे संकलन.
          </p>
        </div>
      </div>

      {downloadSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="जीआर क्रमांक, विषय किंवा विभागाचे नाव शोधा (Search GR)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              शोधा
            </button>
          </form>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            वर्गवारी:
          </span>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-amber-700 text-white shadow-xs font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRs Listing Table / Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-bold">
          शासन निर्णय लोड होत आहेत, कृपया प्रतीक्षा करा...
        </div>
      ) : grs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
          कोणताही शासन निर्णय सापडला नाही. कृपया शोध शब्द बदलून पहा.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 px-1">
            एकूण {grs.length} शासन निर्णय उपलब्ध
          </div>

          <div className="grid grid-cols-1 gap-4">
            {grs.map((gr) => (
              <div
                key={gr?.id || Math.random()}
                className="bg-white border-2 border-slate-200/80 hover:border-amber-400 rounded-2xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                      जीआर क्र: {gr?.grNumber || 'N/A'}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                      {gr?.category || 'सामान्य'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {gr?.date || '-'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {gr?.title || 'शासन निर्णय'}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {gr?.summary || ''}
                  </p>

                  <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 pt-1">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span>विभाग: {gr?.department || 'महाराष्ट्र शासन'}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <span className="text-xs text-slate-400 font-mono hidden md:inline">
                    PDF आकार: {gr?.fileSize || '2 MB'}
                  </span>

                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handlePreview(gr)}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>पहा (View)</span>
                    </button>

                    <button
                      onClick={() => handleOpenGR(gr)}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>डाउनलोड (PDF)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Information Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
        <Landmark className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">माहिती अधिकार व पारदर्शकता सूचना:</strong> हे सर्व शासन निर्णय सार्वजनिक हितासाठी व ग्रामस्थांच्या माहितीसाठी महाराष्ट्र शासनाच्या अधिकृत संकेतस्थळाहून संकलित केलेले आहेत. अधिक माहितीसाठी नागरिक ग्रामपंचायत कार्यालयात प्रत्यक्ष संपर्क करू शकतात.
        </div>
      </div>

      {/* Modal Preview for GR */}
      {activePreviewGR && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-300 flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">महाराष्ट्र शासन निर्णय पूर्वावलोकन (GR Preview)</h3>
              </div>
              <button
                onClick={() => setActivePreviewGR(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto font-serif">
              <div className="text-center border-b-2 border-slate-900 pb-3">
                <div className="text-xs font-bold text-slate-600 uppercase">महाराष्ट्र शासन (Government of Maharashtra)</div>
                <div className="text-sm font-semibold text-slate-700">{activePreviewGR?.department || ''}</div>
                <div className="text-lg font-black text-slate-950 mt-1">अधिकृत शासन निर्णय / परिपत्रक</div>
                <div className="font-mono font-bold text-amber-800 text-xs mt-0.5">
                  क्रमांक: {activePreviewGR?.grNumber || ''}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-sans text-slate-500 border-b border-slate-200 pb-2">
                <div>वर्गवारी: <strong>{activePreviewGR?.category || ''}</strong></div>
                <div>दिनांक: <strong>{activePreviewGR?.date || ''}</strong></div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs sm:text-sm font-bold text-amber-950 font-sans leading-relaxed">
                विषय: {activePreviewGR?.title || ''}
              </div>

              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                <p className="font-bold text-slate-900">प्रस्तावना व शासन आदेश सारांश:</p>
                <p className="text-justify font-sans">{activePreviewGR?.summary || ''}</p>
                <p className="text-justify font-sans text-slate-600 pt-2">
                  सदर आदेश ग्रामपंचायत गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव कार्यक्षेत्रातील अंमलबजावणीसाठी सार्वजनिक संकेतस्थळावर प्रसिद्ध करण्यात आलेला आहे.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-300 flex justify-between items-center font-sans text-xs">
                <div className="text-red-700 font-bold border border-dashed border-red-400 p-2 rounded-lg text-center">
                  डिजिटल प्रमाणित प्रत
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">ग्राम विकास विभाग</div>
                  <div className="text-[10px] text-slate-500">महाराष्ट्र शासन, मंत्रालय, मुंबई</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setActivePreviewGR(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                बंद करा
              </button>
              <button
                onClick={() => handleOpenGR(activePreviewGR)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट / डाउनलोड PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}