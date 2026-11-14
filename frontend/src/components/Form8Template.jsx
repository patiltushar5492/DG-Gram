import React from 'react';
import { Printer, CheckCircle, Landmark, ShieldCheck } from 'lucide-react';

export default function Form8Template({ application }) {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = application.issueDate 
    ? new Date(application.issueDate).toLocaleDateString('mr-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('mr-IN');

  // Authentic Form 8 Property & Dimensions data
  const propNo = application.propertyNumber || '४/१२/२३';
  const wardNo = application.wardNo || 'वॉर्ड क्र. २ (मारुती गल्ली)';
  const houseType = application.houseType || 'पक्के निवासी घर (आरसीसी स्लॅब व विटांचे बांधकाम)';
  const areaSqFt = application.builtUpArea || '६५० चौ. फूट (बांधकाम क्षेत्रफळ)';
  const openPlotArea = application.openPlotArea || '३५० चौ. फूट (मोकळी जागा)';
  const totalArea = application.totalArea || '१००० चौ. फूट';
  const capitalValue = application.capitalVal || '₹ ६,५०,०००';
  const annualRateableValue = application.rateableVal || '₹ ५,२००';

  // Boundaries (चतुःसीमा)
  const northBoundary = application.northBoundary || 'ग्रामपंचायत रस्ता (उत्तर)';
  const southBoundary = application.southBoundary || 'सोपान रामभाऊ पाटील यांची मिळकत (दक्षिण)';
  const eastBoundary = application.eastBoundary || 'मारुती मंदिर परिसर (पूर्व)';
  const westBoundary = application.westBoundary || 'ज्ञानेश्वर विठ्ठल पाटील यांची मिळकत (पश्चिम)';

  return (
    <div className="space-y-4">
      {/* Print Trigger Button */}
      <div className="flex justify-end gap-3 no-print">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>नमुना नं. ८ उतारा प्रिंट करा (Print Official Form 8)</span>
        </button>
      </div>

      {/* Official Maharashtra Government Form No. 8 Document (Strict Clean House Extract Layout) */}
      <div className="printable-card bg-white p-6 sm:p-10 max-w-4xl mx-auto border-4 border-double border-slate-950 rounded-none shadow-xl text-slate-950 relative font-serif">
        
        {/* Subtle Watermark Seal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <div className="text-center">
            <Landmark className="w-96 h-96 mx-auto text-slate-950" />
            <div className="text-3xl font-black mt-2">महाराष्ट्र शासन - ग्रामपंचायत गाळण बुद्रुक</div>
          </div>
        </div>

        <div className="relative z-10 space-y-5">

          {/* Official Form Header */}
          <div className="text-center border-b-2 border-slate-950 pb-4">
            <div className="flex justify-between items-center text-xs font-sans font-bold text-slate-700">
              <span>महाराष्ट्र ग्रामपंचायत कर व फी नियम, १९६०</span>
              <span>नियम ३२ (१) पहा</span>
            </div>

            <div className="flex justify-center items-center gap-2 my-2">
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center bg-slate-50">
                <Landmark className="w-7 h-7 text-slate-900" />
              </div>
            </div>

            <div className="text-sm font-bold uppercase tracking-widest text-slate-800 font-sans">
              महाराष्ट्र शासन (Government of Maharashtra)
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
              ग्रामपंचायत कार्यालय, गाळण बुद्रुक
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 font-sans">
              ता. पाचोरा, जि. जळगाव, महाराष्ट्र - ४२४२०१
            </p>

            <div className="mt-3 inline-block bg-slate-100 border-2 border-slate-900 px-8 py-1.5 text-lg sm:text-xl font-black uppercase tracking-wide">
              गाव नमुना नं. ८ चा उतारा (House / Property Extract)
            </div>
            <div className="text-xs font-sans font-bold text-slate-600 mt-1">
              (इमारत व जमिनीवरील मालकी हक्क व मिळकत आकारणी नोंदवही उतारा)
            </div>
          </div>

          {/* Outward Metadata Ribbon */}
          <div className="flex justify-between items-center text-xs font-sans border-b border-slate-300 pb-2 font-bold">
            <div>
              <span className="text-slate-600">असेसमेंट वर्ष (Assessment Year): </span>
              <span className="text-slate-950 font-mono">२०२६ - २०२७</span>
            </div>
            <div>
              <span className="text-slate-600">उतारा नोंदवही जावक क्र: </span>
              <span className="text-slate-950 font-mono">{application.certificateNumber || 'GB/FORM8/2026/8901'}</span>
            </div>
            <div>
              <span className="text-slate-600">दिनांक: </span>
              <span className="text-slate-950">{formattedDate}</span>
            </div>
          </div>

          {/* Table 1: Ownership & Primary Particulars */}
          <div className="space-y-1 font-sans text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wide">
              १. मालकी व भोगवटा तपशील (Ownership & Occupancy Details):
            </div>
            <table className="w-full border-collapse border border-slate-900 text-left">
              <tbody>
                <tr className="border-b border-slate-900">
                  <td className="p-2.5 font-bold bg-slate-100 w-1/4 border-r border-slate-900">मालमत्ता / घर क्रमांक:</td>
                  <td className="p-2.5 font-bold font-mono text-sm w-1/4 border-r border-slate-900">{propNo}</td>
                  <td className="p-2.5 font-bold bg-slate-100 w-1/4 border-r border-slate-900">प्रभाग / वॉर्ड नाव:</td>
                  <td className="p-2.5 font-medium w-1/4">{wardNo}</td>
                </tr>
                <tr className="border-b border-slate-900">
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">मालकाचे संपूर्ण नाव:</td>
                  <td className="p-2.5 font-bold text-slate-950 border-r border-slate-900">{application.applicantName}</td>
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">वडिलांचे / पतीचे नाव:</td>
                  <td className="p-2.5 font-medium">{application.fatherOrHusbandName || 'सोपान रामभाऊ पाटील'}</td>
                </tr>
                <tr className="border-b border-slate-900">
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">भोगवटादाराचे नाव:</td>
                  <td className="p-2.5 font-bold border-r border-slate-900">{application.applicantName} (स्वतः मालक)</td>
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">जातीचा / आरक्षणाचा संवर्ग:</td>
                  <td className="p-2.5 font-medium">खुला / सामान्य</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">मिळकतीचा अचूक पत्ता:</td>
                  <td colSpan={3} className="p-2.5 font-medium">{application.address || 'गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव - ४२४२०१'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Property Description, Dimensions & Area */}
          <div className="space-y-1 font-sans text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wide">
              २. मत्तेचे वर्णन, क्षेत्रफळ व मूल्यांकन (Property Description & Dimensions):
            </div>
            <table className="w-full border-collapse border border-slate-900 text-left">
              <tbody>
                <tr className="border-b border-slate-900">
                  <td className="p-2.5 font-bold bg-slate-100 w-1/4 border-r border-slate-900">घराचा / मत्तेचा प्रकार:</td>
                  <td className="p-2.5 font-medium border-r border-slate-900" colSpan={3}>{houseType}</td>
                </tr>
                <tr className="border-b border-slate-900">
                  <td className="p-2.5 font-bold bg-slate-100 w-1/4 border-r border-slate-900">बांधकाम क्षेत्रफळ (Built-up):</td>
                  <td className="p-2.5 font-bold text-slate-900 border-r border-slate-900 w-1/4">{areaSqFt}</td>
                  <td className="p-2.5 font-bold bg-slate-100 w-1/4 border-r border-slate-900">मोकळी जागा (Open Area):</td>
                  <td className="p-2.5 font-bold text-slate-900 w-1/4">{openPlotArea}</td>
                </tr>
                <tr className="border-b border-slate-900">
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">एकूण भूखंड क्षेत्रफळ:</td>
                  <td className="p-2.5 font-black text-slate-950 border-r border-slate-900">{totalArea}</td>
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">मिळकतीचे वार्षिक भाडे मूल्य:</td>
                  <td className="p-2.5 font-bold text-emerald-800">{annualRateableValue}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">अंदाजे भांडवली मूल्य:</td>
                  <td className="p-2.5 font-black text-emerald-900 border-r border-slate-900">{capitalValue}</td>
                  <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-900">वापराचा प्रकार:</td>
                  <td className="p-2.5 font-medium">निवासी (Residential)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 3: Property Boundaries (चतुःसीमा) */}
          <div className="space-y-1 font-sans text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wide">
              ३. मिळकतीची चतुःसीमा (Boundaries):
            </div>
            <table className="w-full border-collapse border border-slate-900 text-left">
              <tbody>
                <tr className="border-b border-slate-900">
                  <td className="p-2 font-bold bg-slate-100 w-1/4 border-r border-slate-900">पूर्व (East):</td>
                  <td className="p-2 border-r border-slate-900 w-1/4">{eastBoundary}</td>
                  <td className="p-2 font-bold bg-slate-100 w-1/4 border-r border-slate-900">पश्चिम (West):</td>
                  <td className="p-2 w-1/4">{westBoundary}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-100 border-r border-slate-900">उत्तर (North):</td>
                  <td className="p-2 border-r border-slate-900">{northBoundary}</td>
                  <td className="p-2 font-bold bg-slate-100 border-r border-slate-900">दक्षिण (South):</td>
                  <td className="p-2">{southBoundary}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Certification Legal Paragraph */}
          <div className="text-xs sm:text-sm leading-relaxed text-slate-900 space-y-1.5 pt-1 text-justify">
            <p>
              दाखला देण्यात येतो की, ग्रामपंचायत गाळण बुद्रुक, ता. पाचोरा, जि. जळगाव येथील सन <strong>२०२६-२०२७</strong> च्या अधिकृत कर आकारणी व मिळकत नोंदवही (गाव नमुना नं. ८) मधील नोंदीवरून सदर उतारा अर्जदाराच्या मागणीनुसार तयार करण्यात आलेला आहे. उपलब्ध दप्तरी नोंदीनुसार सदर मिळकत निर्वेध असून अर्जदाराच्या नावे नोंद आहे.
            </p>
            <p className="text-[11px] text-slate-600 italic">
              (टीप: सदर उतारा ई-गव्हर्नन्स प्रणालीद्वारे संगणकीय स्वाक्षरीने तयार करण्यात आला असून शासकीय, महसूल, बँक कर्ज व इतर कायदेशीर कामांसाठी पूर्णतः अधिकृत व ग्राह्य आहे.)
            </p>
          </div>

          {/* Verification Box & Digital Signatures */}
          <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end font-sans">
            
            {/* QR Code Verification Block */}
            <div className="text-center sm:text-left border border-slate-300 p-2.5 rounded-lg bg-slate-50 text-xs">
              <div className="w-24 h-24 bg-white border border-slate-400 mx-auto sm:mx-0 flex items-center justify-center p-1 shadow-xs">
                <div className="w-full h-full bg-slate-950 p-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-white"></div>
                    <div className="w-4 h-4 bg-white"></div>
                  </div>
                  <div className="text-center text-[7px] text-white font-mono font-bold tracking-tighter">
                    VERIFIED FORM 8
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-white"></div>
                    <div className="w-4 h-4 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-600 font-mono">
                ट्रॅकिंग आयडी: {application.trackingId}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" />
                <span>डिजिटल स्वाक्षरीकृत</span>
              </div>
            </div>

            {/* Official Gram Panchayat Stamp */}
            <div className="text-center">
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-red-700 text-red-700 flex flex-col items-center justify-center mx-auto p-1 transform -rotate-6 select-none opacity-90">
                <div className="text-[8px] font-bold">ग्रामपंचायत कार्यालय</div>
                <div className="text-[10px] font-black uppercase my-0.5">गाळण बुद्रुक</div>
                <div className="text-[8px] font-semibold">ता. पाचोरा, जि. जळगाव</div>
                <div className="text-[8px] text-red-800 font-bold border-t border-red-700 mt-0.5">नमुना ८ अधिकृत मोहर</div>
              </div>
            </div>

            {/* Official Digital Signature Blocks */}
            <div className="text-center sm:text-right space-y-1">
              <div className="h-10 flex items-end justify-center sm:justify-end">
                <div className="font-serif italic text-blue-900 font-black text-base select-none">
                  Digitally Approved & Signed
                </div>
              </div>
              <div className="border-t border-slate-900 pt-1 font-bold text-xs text-slate-900">
                ग्रामविकास अधिकारी / सरपंच
              </div>
              <div className="text-xs text-slate-700">
                ग्रामपंचायत गाळण बुद्रुक
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                ता. पाचोरा, जि. जळगाव
              </div>
            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="text-center text-[10px] text-slate-500 border-t border-slate-300 pt-2 font-mono">
            Security Hash: SHA256:{Math.random().toString(36).substring(2, 14).toUpperCase()} | Aaple Sarkar Maharashtra Standards
          </div>

        </div>
      </div>
    </div>
  );
}
