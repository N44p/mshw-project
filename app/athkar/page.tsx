"use client"

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, RotateCcw, Moon, Star, Quote } from "lucide-react"

const athkarData = [
  { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, category: "توحيد" },
  { text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 1, category: "دعاء" },
  { text: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ", count: 1, category: "سيد الاستغفار" },
  { text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ", count: 3, category: "ثواب مضاعف" },
  { text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3, category: "حماية" },
  { text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيًّا", count: 3, category: "رضا" },
  { text: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7, category: "كفاية" },
  { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد", count: 10, category: "صلاة على النبي" },
  { text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, category: "فضل عظيم" },
  { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3, category: "تحصين" },
  { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100, category: "مغفرة" },
  { text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: 100, category: "استغفار" },
  { text: "اللَّهُمَّ عافِني في بَدَني، اللَّهُمَّ عافِني في سَمْعي، اللَّهُمَّ عافِني في بَصَري، لا إلهَ إلَّا أنتَ", count: 3, category: "عافية" },
  { text: "قُلْ هُوَ اللَّهُ أَحَدٌ، قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، قُلْ أَعُوذُ بِرَبِّ النَّاسِ", count: 3, category: "المعوذات" },
  { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1, category: "صباح" },
];

const islamicTheme = `
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;700;900&family=Reem+Kufi:wght@400;700&display=swap');
  
  .islamic-app { font-family: 'Cairo', sans-serif; }
  .the-dhikr { font-family: 'Amiri', serif; }
  .kufi-font { font-family: 'Reem Kufi', sans-serif; }
  
  .bg-sand-pattern {
    background-color: #fdfaf5;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z' fill='%3C#92400e' fill-opacity='0.02'/%3E%3C/svg%3E");
  }
`;

export default function Athkar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);

  const handleCounter = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentCount + 1 < athkarData[currentIndex].count) {
      setCurrentCount(currentCount + 1);
    } else {
      nextDhikr();
    }
  };

  const nextDhikr = () => {
    if (currentIndex + 1 < athkarData.length) {
      setCurrentIndex(currentIndex + 1);
      setCurrentCount(0);
    } else {
      setCurrentIndex(0);
      setCurrentCount(0);
    }
  };

  const prevDhikr = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-sand-pattern py-8 px-4 islamic-app selection:bg-orange-100" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: islamicTheme }} />
      
      <div className="max-w-md mx-auto relative">
        <Card className="overflow-hidden border-none shadow-[0_50px_100px_-20px_rgba(120,60,0,0.15)] rounded-[3.5rem] bg-white/90 backdrop-blur-sm">
          
          {/* Header */}
          <div className="bg-[#92400e] p-8 text-white relative overflow-hidden">
            <Star className="absolute -top-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
            
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-6">
                <div className="bg-orange-100/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
                  <Moon className="h-6 w-6 text-orange-100 fill-orange-100" />
                </div>
                <div>
                  <h2 className="kufi-font text-2xl font-bold tracking-wider">أذكاري</h2>
                  <p className="text-[10px] text-orange-100/40 font-medium uppercase tracking-[0.2em]">حصن المسلم</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {setCurrentIndex(0); setCurrentCount(0);}}
                className="text-white hover:bg-white/10 rounded-2xl h-12 w-12"
              >
                <RotateCcw className="h-5 w-5 opacity-60" />
              </Button>
            </div>
            
            <div className="mt-6 flex justify-between items-center bg-black/10 rounded-2xl px-4 py-2">
               <span className="text-[10px] font-bold text-orange-100/80">الذكر {currentIndex + 1} من {athkarData.length}</span>
               <div className="flex gap-1">
                  <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-300 transition-all duration-300" 
                      style={{ width: `${((currentIndex + 1) / athkarData.length) * 100}%` }}
                    />
                  </div>
               </div>
            </div>
          </div>

          <CardContent className="p-8 pt-10 flex flex-col items-center">
            {/* التصنيف */}
            <span className="mb-4 px-4 py-1 rounded-full bg-orange-50 text-[#92400e] text-[10px] font-black border border-orange-100 uppercase tracking-widest">
              {athkarData[currentIndex].category}
            </span>

            {/* نص الذكر */}
            <div className="w-full min-h-[220px] flex items-center justify-center text-center bg-[#fffdfa] rounded-[3rem] p-8 mb-10 border border-orange-50 shadow-inner relative group">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-orange-100/50 -scale-x-100" />
              <p className="the-dhikr text-2xl md:text-3xl leading-[1.8] font-bold text-stone-800 transition-all duration-300">
                {athkarData[currentIndex].text}
              </p>
            </div>

            {/* العداد */}
            <div className="relative group cursor-pointer" onClick={handleCounter}>
              <div className="absolute inset-0 bg-orange-500 rounded-[4.5rem] blur-3xl opacity-5 group-active:opacity-20 transition-opacity"></div>
              
              <button 
                className="w-44 h-44 rounded-[4.5rem] bg-[#92400e] text-white flex flex-col items-center justify-center 
                           shadow-[0_30px_60px_-15px_rgba(146,64,14,0.4)] transition-all duration-75
                           active:scale-90 border-[10px] border-[#fdfaf5] relative z-10"
              >
                <span className="text-6xl font-black mb-1 tabular-nums tracking-tighter">{currentCount}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-orange-300/60 italic">اضغط هنا</span>
              </button>
              
              <div className="absolute -top-1 -right-2 bg-[#b45309] text-white text-[11px] font-black px-5 py-2 rounded-2xl shadow-xl border-2 border-white z-20">
                الهدف: {athkarData[currentIndex].count}
              </div>
            </div>

            {/* أزرار التنقل */}
            <div className="w-full flex justify-between mt-12 items-center">
              <Button 
                variant="ghost"
                className="rounded-2xl px-6 h-12 text-stone-400 hover:text-[#92400e] hover:bg-orange-50 transition-colors"
                onClick={prevDhikr}
                disabled={currentIndex === 0}
              >
                <ChevronRight className="h-5 w-5 ml-2" /> السابق
              </Button>

              <Button 
                variant="ghost"
                className="rounded-2xl px-6 h-12 text-stone-400 hover:text-[#92400e] hover:bg-orange-50 transition-colors"
                onClick={nextDhikr}
                disabled={currentIndex === athkarData.length - 1}
              >
                التالي <ChevronLeft className="h-5 w-5 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* التذييل المطور */}
        <div className="text-center mt-10 space-y-3 pb-10">
            <div className="flex items-center justify-center gap-4 opacity-20">
              <div className="h-[1px] w-12 bg-[#92400e]"></div>
              <Star size={12} className="text-[#92400e]" />
              <div className="h-[1px] w-12 bg-[#92400e]"></div>
            </div>
            <p className="kufi-font text-[#92400e] text-lg font-bold tracking-wide">
              أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
            </p>
            <p className="text-[9px] text-stone-900 font-bold uppercase tracking-[0.2em] opacity-60">
              سبحان الله • والحمد لله • ولا إله إلا الله • والله أكبر
            </p>
        </div>
      </div>
    </div>
  );
}
