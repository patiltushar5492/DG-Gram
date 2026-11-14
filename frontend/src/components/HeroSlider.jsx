import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';

export default function HeroSlider() {
  const [slides, setSlides] = useState([
    {
      id: "slide_1",
      badge: "आपले स्वागत आहे! (Welcome)",
      title: "ग्रामपंचायत गाळण बुद्रुक डिजिटल पोर्टल",
      subtitle: "पारदर्शक कारभार, गतिमान सेवा आणि आधुनिक ग्रामविकास",
      description: "गाळण बुद्रुक ग्रामस्थांना घरबसल्या शासकीय सेवा, दाखले आणि ग्रामविकासाच्या योजनांची माहिती देण्यासाठी अधिकृत ई-प्रशासन प्रणाली.",
      date: "२०२६-२७ कार्यकाळ",
      bgImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
      buttonText: "ऑनलाइन सेवा मिळवा",
      buttonLink: "/services"
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    apiRequest('/hero-slides').then(res => {
      if (res.success && res.slides && res.slides.length > 0) {
        setSlides(res.slides);
      }
    });
  }, []);

  // Auto advance slide every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentIndex] || slides[0];

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] overflow-hidden bg-slate-900 select-none">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url(${slide.bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
      </div>

      {/* Slide Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white space-y-4 py-8">
          
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              {slide.badge || "अधिकृत पोर्टल"}
            </span>

            {slide.date && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {slide.date}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p className="text-lg sm:text-xl font-medium text-amber-200 drop-shadow-xs">
              {slide.subtitle}
            </p>
          )}

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
            {slide.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to={slide.buttonLink || "/services"}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>{slide.buttonText || "सेवांचा लाभ घ्या"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/government-grs"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              शासन निर्णय (GRs)
            </Link>
          </div>

        </div>
      </div>

      {/* Prev / Next controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/90 text-white p-2.5 rounded-full backdrop-blur-xs transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900/90 text-white p-2.5 rounded-full backdrop-blur-xs transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
