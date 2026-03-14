"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// قاعدة بيانات موسعة وشاملة (أضفنا مقاسات أصغر)
const sizeData = {
  shoes: [
    { eu: '35', us: '3.5', uk: '2.5', cm: '22.5' },
    { eu: '36', us: '4.5', uk: '3.5', cm: '23' },
    { eu: '37', us: '5', uk: '4', cm: '23.5' },
    { eu: '38', us: '6', uk: '5', cm: '24' },
    { eu: '39', us: '7', uk: '6', cm: '24.5' },
    { eu: '40', us: '7.5', uk: '6.5', cm: '25' },
    { eu: '41', us: '8.5', uk: '7.5', cm: '26' },
    { eu: '42', us: '9', uk: '8', cm: '26.5' },
    { eu: '43', us: '10', uk: '9', cm: '27.5' },
    { eu: '44', us: '10.5', uk: '9.5', cm: '28' },
    { eu: '45', us: '11.5', uk: '10.5', cm: '29' },
  ] as { eu: string; us: string; uk: string; cm: string }[],
  clothing: [
    { label: 'XS', eu: '34', us: '2', uk: '6', int: 'X-Small' },
    { label: 'S', eu: '36', us: '4', uk: '8', int: 'Small' },
    { label: 'M', eu: '38', us: '6', uk: '10', int: 'Medium' },
    { label: 'L', eu: '40', us: '8', uk: '12', int: 'Large' },
    { label: 'XL', eu: '42', us: '10', uk: '14', int: 'X-Large' },
    { label: 'XXL', eu: '44', us: '12', uk: '16', int: '2X-Large' },
  ] as { label: string; eu: string; us: string; uk: string; int: string }[]
};

export default function SizeLab() {
  const [mode, setMode] = useState<'shoes' | 'clothing'>('shoes');
  const [index, setIndex] = useState(4); // الافتراضي في المنتصف

  const currentData = sizeData[mode][index];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-linear-to-r from-[#D4AF37] via-[#F9F6EE] to-[#C5A028] mb-4"
          >
            Size Lab
          </motion.h1>
          <p className="text-stone-400 text-lg">أداة لتحويل مقاساتك العالمية</p>
        </header>

        {/* أزرار التبديل */}
        <div className="flex justify-center mb-10 p-1 bg-stone-900/50 rounded-2xl w-fit mx-auto border border-stone-800">
          <button 
            onClick={() => {setMode('shoes'); setIndex(4)}}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${mode === 'shoes' ? 'bg-[#D4AF37] text-black shadow-[0_0_25px_rgba(212,175,55,0.3)]' : 'hover:bg-stone-800 text-stone-400'}`}
          >
            أحذية
          </button>
          <button 
            onClick={() => {setMode('clothing'); setIndex(2)}}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${mode === 'clothing' ? 'bg-[#D4AF37] text-black shadow-[0_0_25px_rgba(212,175,55,0.3)]' : 'hover:bg-stone-800 text-stone-400'}`}
          >
            ملابس
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <section className="bg-stone-900/40 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#D4AF37]">
              <span className="w-1.5 h-7 bg-[#D4AF37] rounded-full inline-block"></span>
              تحكم في المقاس
            </h3>
            
            <div className="space-y-8">
              <div className="flex justify-between items-center text-stone-400 text-sm italic">
                <span>أصغر</span>
                <span>اسحب للتغيير</span>
                <span>أكبر</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={sizeData[mode].length - 1} 
                value={index}
                onChange={(e) => setIndex(parseInt(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              
              {/* توضيح الوحدة في المقاس الحالي */}
              <div className="flex justify-between text-4xl font-black text-[#F9F6EE] bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-inner overflow-hidden relative">
                <div className="flex flex-col">
                  <span className="text-[10px] text-stone-500 uppercase tracking-[0.3em] mb-1 font-normal">المقاس الحالي</span>
                  <motion.div key={`${mode}-${index}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-baseline gap-2">
                    <span>{"label" in currentData ? currentData.label : currentData.eu}</span>
                    <span className="text-xs text-[#D4AF37] font-bold">
                        {mode === 'shoes' ? 'EU' : 'Size'}
                    </span>
                  </motion.div>
                </div>
                <div className="opacity-5 text-6xl absolute -left-2 -bottom-2 font-black italic">
                   {mode === 'shoes' ? 'SHOE' : 'WEAR'}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <ResultCard label="الأمريكي (US)" value={currentData.us} color="gold" delay={0.1} unit="US" />
            <ResultCard label="البريطاني (UK)" value={currentData.uk} color="silver" delay={0.2} unit="UK" />
            <ResultCard 
              label={mode === 'shoes' ? "طول القدم (CM)" : "المقاس العالمي"} 
              value={mode === 'shoes' && "cm" in currentData ? currentData.cm : ("int" in currentData ? currentData.int : "")} 
              color="white" 
              delay={0.3} 
              full 
              unit={mode === 'shoes' ? "سم" : "Global"}
            />
          </section>
        </div>

        <footer className="mt-12 p-6 bg-stone-900/30 border border-stone-800 rounded-2xl flex items-center gap-4">
          <div className="text-2xl opacity-50">✨</div>
          <p className="text-stone-400 text-sm">
            {mode === 'shoes' 
  ? `نصيحة: مقاس ${(currentData as any).eu} EU يعادل تقريباً ${(currentData as any).cm} سنتيمتر. قم بقياس قدمك بالمسطرة للتأكد.`
  : "نصيحة: تأكد من مراجعة جدول القياسات الخاص بكل ماركة تجارية."}
          </p>
        </footer>
      </div>
    </div>
  );
}

// إضافة خاصية unit للبطاقة
function ResultCard({ label, value, color, delay, full = false, unit }: any) {
  const colors: Record<string, string> = {
    gold: 'border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37]',
    silver: 'border-stone-700 bg-stone-800/20 text-stone-300',
    white: 'border-stone-600 bg-stone-700/10 text-[#F9F6EE]',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${full ? 'col-span-2 flex-row justify-between px-10' : 'flex-col justify-center'} p-6 rounded-3xl border ${colors[color]} backdrop-blur-md flex items-center shadow-lg transition-transform hover:scale-[1.02]`}
    >
      <div className={full ? 'text-right' : 'text-center mb-2'}>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-medium block">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tighter">{value}</span>
        <span className="text-[10px] font-bold opacity-40 uppercase">{unit}</span>
      </div>
    </motion.div>
  );
}