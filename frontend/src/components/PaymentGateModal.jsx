import React from 'react';
import { ShieldCheck, Landmark, CheckCircle, ArrowRight, Lock, Building, QrCode } from 'lucide-react';

export default function PaymentGateModal({ 
  service, 
  applicantData, 
  paymentSettings, 
  onPaymentSuccess, 
  onClose,
  isProcessing,
  setIsProcessing 
}) {
  const [paymentMethod, setPaymentMethod] = React.useState('upi');
  const [upiRefId, setUpiRefId] = React.useState('');
  const [payerMobile, setPayerMobile] = React.useState(applicantData.mobile || '');

  const feeAmount = service?.feeAmount || 20;

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        paymentMethod,
        transactionId: 'TXN-' + Date.now().toString().slice(-8),
        upiRefId: upiRefId || ('UPI' + Math.floor(1000000000 + Math.random() * 9000000000)),
        amountPaid: feeAmount,
        paidAt: new Date().toISOString(),
        payerMobile,
        status: 'PAID'
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Payment Gate Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b-2 border-orange-500">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-orange-400">
                शासकीय देयक गेटवे (Government Payment Gateway)
              </div>
              <h3 className="text-sm font-black text-white">
                ग्रामपंचायत गाळण बुद्रुक ई-पेमेंट
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Payment Body */}
        <div className="p-6 space-y-5">

          {/* Amount Due Card */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block uppercase">दाखल्याचे नाव:</span>
              <span className="font-black text-sm text-slate-900">{service?.nameMr}</span>
              <span className="text-xs text-slate-600 block mt-0.5">अर्जदार: {applicantData?.applicantName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">एकूण देय शुल्क</span>
              <div className="text-2xl font-black text-emerald-700 font-mono">₹ {feeAmount}.००</div>
            </div>
          </div>

          {/* Official Bank Account Details configured by Admin */}
          {paymentSettings && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                <span className="font-bold text-slate-700">जमा होणारे अधिकृत खाते:</span>
                <span className="text-emerald-700 font-semibold">{paymentSettings.bankName}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-500">खाते क्र.: <strong>{paymentSettings.accountNumber}</strong></span>
                <span className="text-slate-500">IFSC: <strong>{paymentSettings.ifscCode}</strong></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">अधिकृत UPI ID:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{paymentSettings.upiId}</span>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              पेमेंट पद्धत निवडा (Select Payment Mode) *:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50 text-orange-800 ring-2 ring-orange-200' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                UPI / QR कोड
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'card' ? 'border-orange-500 bg-orange-50 text-orange-800 ring-2 ring-orange-200' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                डेबिट / क्रेडिट कार्ड
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'netbanking' ? 'border-orange-500 bg-orange-50 text-orange-800 ring-2 ring-orange-200' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                नेट बँकिंग
              </button>
            </div>
          </div>

          {/* Form based on selected mode */}
          <form onSubmit={handleSimulatePayment} className="space-y-4">
            {paymentMethod === 'upi' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3">
                <div className="w-32 h-32 bg-white border-2 border-slate-300 rounded-xl mx-auto p-1.5 flex items-center justify-center shadow-xs">
                  <img
                    src={paymentSettings?.qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=gpgalanbudruk@mahb"}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-slate-600">
                  GooglePay, PhonePe, Paytm किंवा BHIM द्वारे वरील QR स्कॅन करा.
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="UPI UTR / संदर्भ क्रमांक (उदा. 439018239011)"
                    value={upiRefId}
                    onChange={(e) => setUpiRefId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                <input
                  type="text"
                  placeholder="कार्ड क्रमांक (Card Number): 4532 •••• •••• 8921"
                  required
                  defaultValue="4532 8901 2341 8921"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY: 12/28"
                    required
                    defaultValue="12/28"
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                  />
                  <input
                    type="password"
                    placeholder="CVV: 891"
                    maxLength={3}
                    required
                    defaultValue="891"
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold">
                  <option>State Bank of India (SBI)</option>
                  <option>Bank of Maharashtra</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Bank of Baroda</option>
                </select>
                <div className="text-[11px] text-slate-500">
                  आपण सुरक्षित सरकारी पेमेंट गेटवेवर रिडायरेक्ट व्हाल.
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing ? 'देयक सुरक्षितपणे पडताळत आहे...' : `₹ ${feeAmount}.०० शुल्क भरा व अर्ज सादर करा`}
                </span>
              </button>
            </div>
          </form>

          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              २५६-बिट सुरक्षित बँक एन्क्रिप्शन
            </span>
            <span>महाराष्ट्र शासन ई-पेमेंट मानके</span>
          </div>

        </div>

      </div>
    </div>
  );
}
