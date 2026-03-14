"use client"

import React, { useState, useEffect } from 'react';
import moment from 'moment-hijri';

// إعداد اللغة العربية
moment.locale('ar-SA');

export default function AnnualCalendar() {
  // viewDate: السنة التي يتم استعراضها حالياً
  const [viewDate, setViewDate] = useState(moment().startOf('iYear' as any));
  // selectedDate: اليوم الذي يختاره المستخدم ليظهر في البطاقة العلوية
  const [selectedDate, setSelectedDate] = useState(moment());
  const [months, setMonths] = useState<any[]>([]);

  // توليد 12 شهراً بناءً على السنة المختارة
  useEffect(() => {
    const allMonths = [];
    const startOfSelectedYear = viewDate.clone().startOf('iYear' as any);
    
    for (let i = 0; i < 12; i++) {
      // استخدام 'as any' لتجنب خطأ TypeScript مع 'iMonth'
      const month = startOfSelectedYear.clone().add(i, 'iMonth' as any);
      allMonths.push(month);
    }
    setMonths(allMonths);
  }, [viewDate]);

  // دالة التنقل بين السنوات (سابق / تالي)
  const changeYear = (offset: number) => {
    setViewDate(prev => prev.clone().add(offset, 'iYear' as any));
  };

  // دالة لتوليد أيام كل شهر وتنسيقها في جدول
  const renderDays = (currentMonth: any) => {
    const startOfMonth = currentMonth.clone().startOf('iMonth' as any);
    const endOfMonth = currentMonth.clone().endOf('iMonth' as any);
    const days = [];
    
    // إضافة خانات فارغة لضبط بداية الشهر مع يوم الأسبوع الصحيح
    for (let i = 0; i < startOfMonth.day(); i++) {
      days.push(null);
    }

    let day = startOfMonth.clone();
    while (day <= endOfMonth) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      
      {/* 1. البطاقة العلوية (Header) - التصميم المتدرج */}
      <div className="sticky top-4 z-20 max-w-4xl mx-auto mb-10">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 shadow-2xl text-white">
          <div className="flex justify-between items-center text-right">
            <div>
              <p className="text-indigo-100 font-medium mb-1">{selectedDate.format('dddd')}</p>
              <h2 className="text-3xl md:text-4xl font-black leading-tight">
                {selectedDate.format('iD iMMMM iYYYY')} هـ
              </h2>
            </div>
            <div className="text-left">
              <p className="text-xs opacity-70">الموافق ميلادياً</p>
              <p className="text-xl font-bold">{selectedDate.format('D MMMM YYYY')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. شبكة الشهور (Calendar Grid) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, mIdx) => (
          <div key={mIdx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 p-3 text-center">
              <h3 className="text-white font-bold text-sm">
                {month.format('iMMMM iYYYY')} هـ
              </h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(d => (
                  <div key={d} className="text-center text-[11px] font-bold text-slate-400 py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {renderDays(month).map((day, dIdx) => {
                  if (!day) return <div key={dIdx} className="h-10" />;
                  
                  const isSelected = day.isSame(selectedDate, 'day');
                  const isToday = day.isSame(moment(), 'day');

                  return (
                    <button
                      key={dIdx}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        group relative flex flex-col items-center justify-center rounded-xl transition-all h-12 w-full
                        ${isSelected ? 'bg-indigo-600 text-white shadow-md z-10 scale-105' : 'hover:bg-indigo-50 text-slate-700'}
                        ${isToday && !isSelected ? 'border-2 border-indigo-400' : ''}
                      `}
                    >
                      <span className="text-sm font-black leading-none">{day.format('iD')}</span>
                      <span className={`text-[9px] mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {day.format('D')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. أزرار التحكم في الأسفل */}
      <div className="max-w-4xl mx-auto mt-12 mb-10 flex flex-col items-center gap-6">
        <div className="flex justify-between w-full gap-4 font-sans">
          <button 
            onClick={() => changeYear(-1)}
            className="flex-1 bg-white border-2 border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-600 font-bold py-4 rounded-2xl transition-all shadow-sm active:scale-95"
          >
            ← السنة السابقة
          </button>

          <button 
            onClick={() => changeYear(1)}
            className="flex-1 bg-white border-2 border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-600 font-bold py-4 rounded-2xl transition-all shadow-sm active:scale-95"
          >
            السنة التالية →
          </button>
        </div>

        <div className="text-center bg-indigo-50 border border-indigo-100 px-8 py-3 rounded-full shadow-inner">
            <p className="text-slate-600 text-sm">
                تصفح تقويم عام: <span className="text-indigo-700 font-black text-lg">{viewDate.format('iYYYY')} هـ</span>
            </p>
        </div>
      </div>
    </div>
  );
}