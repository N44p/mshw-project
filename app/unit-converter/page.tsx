"use client"

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, Ruler, Weight, Thermometer, 
  Layers, RefreshCw, Binary, Calculator, ShoppingBasket,
  ChevronDown, Sparkles
} from "lucide-react";

const UNIT_DATA: any = {
  length: {
    name: "الطول",
    icon: <Ruler size={20} />,
    units: { "متر": 1, "كيلومتر": 1000, "سنتيمتر": 0.01, "ميل": 1609.34, "قدم": 0.3048, "بوصة": 0.0254 }
  },
  weight: {
    name: "الوزن",
    icon: <Weight size={20} />,
    units: { "كيلوجرام": 1, "جرام": 0.001, "باوند": 0.453592, "أونصة": 0.0283495, "طن": 1000 }
  },
  temp: {
    name: "الحرارة",
    icon: <Thermometer size={20} />,
    units: { "سيلزيوس": 1, "فهرنهايت": 1 }
  },
  area: {
    name: "المساحة",
    icon: <Layers size={20} />,
    units: { "متر مربع": 1, "هكتار": 10000, "فدان": 4046.86, "كيلومتر مربع": 1000000 }
  }
};

export default function MidnightConverter() {
  const [cat, setCat] = useState("length");
  const [valFrom, setValFrom] = useState("1");
  const [valTo, setValTo] = useState("");
  const [unitFrom, setUnitFrom] = useState("كيلومتر");
  const [unitTo, setUnitTo] = useState("متر");

  const convertValue = (value: string, from: string, to: string, category: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    if (category === "temp") {
      if (from === to) return num.toString();
      if (from === "سيلزيوس" && to === "فهرنهايت") return ((num * 9/5) + 32).toFixed(2);
      if (from === "فهرنهايت" && to === "سيلزيوس") return ((num - 32) * 5/9).toFixed(2);
      return num.toString();
    }
    const factorFrom = UNIT_DATA[category].units[from] || 1;
    const factorTo = UNIT_DATA[category].units[to] || 1;
    return ((num * factorFrom) / factorTo).toLocaleString('en-US', { maximumFractionDigits: 4 }).replace(/,/g, '');
  };

  useEffect(() => {
    setValTo(convertValue(valFrom, unitFrom, unitTo, cat));
  }, [valFrom, unitFrom, unitTo, cat]);

  const swapUnits = () => {
    setUnitFrom(unitTo);
    setUnitTo(unitFrom);
    setValFrom(valTo);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#0F1115] flex flex-col items-center overflow-hidden font-sans text-white selection:bg-[#6366F1]/30" dir="rtl">
      
      {/* Header - Midnight Style */}
      <header className="w-full bg-[#161920]/80 backdrop-blur-xl border-b border-white/5 py-6 flex justify-center shrink-0">
        <div className="w-full max-w-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-[#6366F1] to-[#A855F7] p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                <RefreshCw className="text-white h-4 w-4" />
             </div>
             <h1 className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-white to-gray-400">محول الأبعاد</h1>
          </div>
          <Sparkles size={16} className="text-[#6366F1]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md overflow-y-auto px-6 py-8 flex flex-col gap-8 no-scrollbar">
        
        {/* Category Grid - Neon Accents */}
        <div className="grid grid-cols-4 gap-3 shrink-0">
          {Object.keys(UNIT_DATA).map((key) => (
            <button
              key={key}
              onClick={() => {
                setCat(key);
                const units = key === 'temp' ? ["سيلزيوس", "فهرنهايت"] : Object.keys(UNIT_DATA[key].units);
                setUnitFrom(units[0]);
                setUnitTo(units[1]);
              }}
              className={`flex flex-col items-center justify-center py-4 rounded-3xl transition-all duration-300 active:scale-90 border ${
                cat === key 
                ? 'bg-[#1E222B] border-[#6366F1] text-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                : 'bg-[#161920] border-white/5 text-gray-500'
              }`}
            >
              <div className={cat === key ? "animate-pulse" : ""}>{UNIT_DATA[key].icon}</div>
              <span className="text-[9px] font-black mt-2">{UNIT_DATA[key].name}</span>
            </button>
          ))}
        </div>

        {/* Converter Card - Deep Glass */}
        <div className="relative space-y-3">
          {/* Input Block */}
          <div className="bg-[#161920] p-7 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <p className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest">القيمة الحالية</p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={valFrom}
                onChange={(e) => setValFrom(e.target.value)}
                className="w-full bg-transparent text-4xl font-black outline-none text-white placeholder:text-gray-800"
              />
              <div className="bg-[#1E222B] px-4 py-2 rounded-2xl text-[11px] font-black text-[#6366F1] border border-white/5">
                {unitFrom}
              </div>
            </div>
          </div>

          {/* Swap Button - Electric Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={swapUnits}
              className="bg-[#6366F1] text-white p-3.5 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.4)] border-[6px] border-[#0F1115] hover:scale-110 active:rotate-180 transition-all duration-500"
            >
              <ArrowLeftRight size={20} />
            </button>
          </div>

          {/* Result Block */}
          <div className="bg-[#1E222B] p-7 rounded-[2.5rem] border border-[#6366F1]/20 shadow-inner">
            <p className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest">النتيجة المتوقعة</p>
            <div className="flex items-center gap-4">
              <div className="w-full text-4xl font-black text-white truncate drop-shadow-sm">
                {valTo || "0"}
              </div>
              <div className="bg-[#161920] px-4 py-2 rounded-2xl text-[11px] font-black text-gray-400 border border-white/5">
                {unitTo}
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Tag */}
        <div className="bg-gradient-to-r from-[#6366F1]/10 to-transparent p-5 rounded-[2rem] flex items-center gap-4 border border-[#6366F1]/10">
          <div className="bg-[#6366F1]/20 p-2.5 rounded-xl text-[#6366F1]">
            <Binary size={18} />
          </div>
          <div>
            <p className="text-[11px] font-black text-white">تحويل فوري</p>
            <p className="text-[10px] text-gray-500 font-medium">دقة حسابية متناهية مع نظام التحويل الذكي.</p>
          </div>
        </div>
      </main>

      {/* Footer Nav - Neon Selection */}
      <footer className="w-full bg-[#161920]/90 border-t border-white/5 py-5 flex justify-around items-center shrink-0">
        <button className="flex flex-col items-center gap-1.5 text-[#6366F1]">
          <RefreshCw size={20} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          <span className="text-[9px] font-black uppercase tracking-tighter">المحول</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-gray-600">
          <Calculator size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter">الحاسبة</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-gray-600">
          <ShoppingBasket size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter">الغذاء</span>
        </button>
      </footer>
    </div>
  );
}