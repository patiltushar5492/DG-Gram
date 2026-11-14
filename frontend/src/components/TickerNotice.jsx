import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function TickerNotice() {
  const [ticker, setTicker] = useState({
    enabled: true,
    text: "📢 ग्रामपंचायत गाळण बुद्रुक: २०२६-२७ ची घरपट्टी व पाणीपट्टी वेळेवर भरून गाव विकासात सहकार्य करा. | नवीन दाखल्यांसाठी ऑनलाइन अर्ज सुरू आहेत."
  });

  useEffect(() => {
    apiRequest('/ticker-notice').then(res => {
      if (res.success && res.ticker) {
        setTicker(res.ticker);
      }
    });
  }, []);

  if (!ticker.enabled || !ticker.text) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-semibold text-xs sm:text-sm py-2 px-4 shadow-inner flex items-center gap-3 overflow-hidden border-b border-orange-600/30">
      <div className="flex items-center gap-1.5 bg-slate-950 text-amber-400 px-2.5 py-1 rounded-md text-xs uppercase font-extrabold tracking-wider shrink-0 shadow-xs">
        <Bell className="w-3.5 h-3.5 animate-bounce" />
        <span>महत्त्वाची सूचना (Notice)</span>
      </div>

      <div className="overflow-hidden whitespace-nowrap relative w-full">
        <div className="inline-block animate-marquee pl-4 text-slate-950 font-bold">
          {ticker.text}
        </div>
      </div>
    </div>
  );
}
