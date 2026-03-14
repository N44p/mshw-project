"use client"

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gauge, Share2, ShieldCheck, Zap } from "lucide-react";

export default function InternetSpeed() {
  const [testing, setTesting] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [ping, setPing] = useState(0);

  const startTest = () => {
    setTesting(true);
    setSpeed(0);
    // محاكاة حركة العداد بليونة (Ease-in-out)
    let val = 0;
    const interval = setInterval(() => {
      val += (Math.random() * 25);
      if (val >= 184) { // قيمة افتراضية للسرعة
        clearInterval(interval);
        setSpeed(184.2);
        setPing(12);
        setTesting(false);
      } else {
        setSpeed(Math.floor(val));
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12" dir="rtl">
      <div className="relative group">
        {/* تأثير الإضاءة الخلفية (Glow) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        
        <Card className="relative bg-white border-none rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            
            {/* القسم الأيمن: لوحة القياس */}
            <div className="p-10 bg-slate-50 flex flex-col items-center justify-center border-l border-slate-100">
              <div className="relative w-72 h-72 flex items-center justify-center">
                {/* الدوائر المتداخلة للتصميم */}
                <div className="absolute inset-0 rounded-full border-[1px] border-slate-200 border-dashed animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border-[1px] border-blue-100"></div>
                
                <div className="text-center z-10">
                  <p className="text-slate-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">Download</p>
                  <h2 className="text-8xl font-black text-slate-900 tracking-tighter">
                    {speed}
                  </h2>
                  <p className="text-blue-600 font-bold mt-2">Mbps</p>
                </div>
              </div>

              <div className="mt-8 w-full grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Latency</p>
                  <p className="text-xl font-black text-slate-800">{ping} <span className="text-xs text-slate-400 font-normal">ms</span></p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Stability</p>
                  <p className="text-xl font-black text-slate-800">99<span className="text-xs text-slate-400 font-normal">%</span></p>
                </div>
              </div>
            </div>

            {/* القسم الأيسر: التحكم والمعلومات */}
            <div className="p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6 text-blue-600">
                  <Zap size={20} fill="currentColor" />
                  <span className="font-bold tracking-widest text-sm uppercase">Network Engine v2.0</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">
                  اختبار استقرار <br/> وسرعة الاتصال
                </h1>
                <p className="text-slate-500 leading-relaxed text-sm">
                  نظامنا يقوم الآن بتحليل جودة الإشارة الموجهة وفحص بروتوكولات النقل لضمان أدق نتيجة ممكنة لشبكتك الحالية.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl">
                  <ShieldCheck className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-900">اتصالك آمن ومحمي أثناء الفحص</span>
                </div>

                <Button 
                  onClick={startTest}
                  disabled={testing}
                  className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-lg transition-all duration-500 shadow-xl active:scale-95"
                >
                  {testing ? "جاري التحليل..." : "بدأ الفحص الشامل"}
                </Button>
                
                <div className="flex justify-center gap-6 pt-4 text-slate-300">
                   <Share2 size={18} className="cursor-pointer hover:text-slate-600 transition-colors" />
                   <Gauge size={18} />
                </div>
              </div>
            </div>
            
          </div>
        </Card>
      </div>
      
      <p className="text-center mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">
        Premium Dashboard Experience • 2026
      </p>
    </div>
  );
}