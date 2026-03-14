"use client"

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Trash2, Leaf, 
  Minus, ShoppingBasket, Calculator, X, Flame
} from "lucide-react";

// قاعدة البيانات (تضم الـ 100 صنف)
const FOOD_LIBRARY = [
  // --- بروتينات (Protein) ---
  { id: 1, name: "بيض مسلوق", cal: 78, unit: "حبة", cat: "بروتين" },
  { id: 2, name: "صدر دجاج مشوي", cal: 165, unit: "100جم", cat: "بروتين" },
  { id: 3, name: "سلمون مشوي", cal: 208, unit: "100جم", cat: "بروتين" },
  { id: 4, name: "تونة بالماء", cal: 128, unit: "100جم", cat: "بروتين" },
  { id: 5, name: "لحم بقري ستيك", cal: 250, unit: "100جم", cat: "بروتين" },
  { id: 6, name: "روبيان مشوي", cal: 99, unit: "100جم", cat: "بروتين" },
  { id: 7, name: "عدس مطبوخ", cal: 116, unit: "100جم", cat: "بروتين" },
  { id: 8, name: "حمص مطبوخ", cal: 164, unit: "100جم", cat: "بروتين" },
  { id: 9, name: "فاصوليا حمراء", cal: 127, unit: "100جم", cat: "بروتين" },
  { id: 10, name: "زبادي يوناني", cal: 59, unit: "100جم", cat: "بروتين" },
  { id: 11, name: "جبنة قريش", cal: 98, unit: "100جم", cat: "بروتين" },
  { id: 12, name: "توفو", cal: 76, unit: "100جم", cat: "بروتين" },
  { id: 13, name: "تركي (حبش) مدخن", cal: 104, unit: "100جم", cat: "بروتين" },
  { id: 14, name: "سمك فيليه أبيض", cal: 90, unit: "100جم", cat: "بروتين" },
  { id: 15, name: "كبدة مشوية", cal: 175, unit: "100جم", cat: "بروتين" },

  // --- نشويات (Carbs) ---
  { id: 16, name: "أرز أبيض مطبوخ", cal: 130, unit: "100جم", cat: "نشويات" },
  { id: 17, name: "أرز بني مطبوخ", cal: 111, unit: "100جم", cat: "نشويات" },
  { id: 18, name: "بطاطس مسلوقة", cal: 87, unit: "100جم", cat: "نشويات" },
  { id: 19, name: "بطاطس حلوة", cal: 86, unit: "100جم", cat: "نشويات" },
  { id: 20, name: "شوفان (خام)", cal: 389, unit: "100جم", cat: "نشويات" },
  { id: 21, name: "كينوا مطبوخة", cal: 120, unit: "100جم", cat: "نشويات" },
  { id: 22, name: "مكرونة قمح كامل", cal: 124, unit: "100جم", cat: "نشويات" },
  { id: 23, name: "خبز أسمر", cal: 80, unit: "شريحة", cat: "نشويات" },
  { id: 24, name: "خبز نخالة", cal: 70, unit: "شريحة", cat: "نشويات" },
  { id: 25, name: "توست بر", cal: 75, unit: "شريحة", cat: "نشويات" },
  { id: 26, name: "ذرة حلوة", cal: 86, unit: "100جم", cat: "نشويات" },
  { id: 27, name: "برغل مطبوخ", cal: 83, unit: "100جم", cat: "نشويات" },
  { id: 28, name: "فريكة مطبوخة", cal: 150, unit: "100جم", cat: "نشويات" },
  { id: 29, name: "شعير", cal: 123, unit: "100جم", cat: "نشويات" },
  { id: 30, name: "كوسكسي مطبوخ", cal: 112, unit: "100جم", cat: "نشويات" },

  // --- فواكه (Fruits) ---
  { id: 31, name: "تفاح", cal: 52, unit: "100جم", cat: "فواكه" },
  { id: 32, name: "موز", cal: 89, unit: "100جم", cat: "فواكه" },
  { id: 33, name: "برتقال", cal: 47, unit: "100جم", cat: "فواكه" },
  { id: 34, name: "فراولة", cal: 32, unit: "100جم", cat: "فواكه" },
  { id: 35, name: "عنب", cal: 67, unit: "100جم", cat: "فواكه" },
  { id: 36, name: "مانجو", cal: 60, unit: "100جم", cat: "فواكه" },
  { id: 37, name: "أناناس", cal: 50, unit: "100جم", cat: "فواكه" },
  { id: 38, name: "بطيخ", cal: 30, unit: "100جم", cat: "فواكه" },
  { id: 39, name: "توت أزرق", cal: 57, unit: "100جم", cat: "فواكه" },
  { id: 40, name: "خوخ", cal: 39, unit: "100جم", cat: "فواكه" },
  { id: 41, name: "كمثرى", cal: 57, unit: "100جم", cat: "فواكه" },
  { id: 42, name: "كيوي", cal: 61, unit: "100جم", cat: "فواكه" },
  { id: 43, name: "تمر سكري", cal: 277, unit: "100جم", cat: "فواكه" },
  { id: 44, name: "تين", cal: 74, unit: "100جم", cat: "فواكه" },
  { id: 45, name: "رمان", cal: 83, unit: "100جم", cat: "فواكه" },
  { id: 46, name: "مشمش", cal: 48, unit: "100جم", cat: "فواكه" },
  { id: 47, name: "كرز", cal: 50, unit: "100جم", cat: "فواكه" },
  { id: 48, name: "جوافة", cal: 68, unit: "100جم", cat: "فواكه" },
  { id: 49, name: "شمام", cal: 34, unit: "100جم", cat: "فواكه" },
  { id: 50, name: "جريب فروت", cal: 42, unit: "100جم", cat: "فواكه" },

  // --- خضروات (Vegetables) ---
  { id: 51, name: "خيار", cal: 15, unit: "100جم", cat: "خضار" },
  { id: 52, name: "طماطم", cal: 18, unit: "100جم", cat: "خضار" },
  { id: 53, name: "خس", cal: 15, unit: "100جم", cat: "خضار" },
  { id: 54, name: "سبانخ", cal: 23, unit: "100جم", cat: "خضار" },
  { id: 55, name: "بروكلي", cal: 34, unit: "100جم", cat: "خضار" },
  { id: 56, name: "قرنبيط", cal: 25, unit: "100جم", cat: "خضار" },
  { id: 57, name: "جزر", cal: 41, unit: "100جم", cat: "خضار" },
  { id: 58, name: "فلفل رومي", cal: 20, unit: "100جم", cat: "خضار" },
  { id: 59, name: "بصل", cal: 40, unit: "100جم", cat: "خضار" },
  { id: 60, name: "ثوم", cal: 149, unit: "100جم", cat: "خضار" },
  { id: 61, name: "كوسا", cal: 17, unit: "100جم", cat: "خضار" },
  { id: 62, name: "باذنجان", cal: 25, unit: "100جم", cat: "خضار" },
  { id: 63, name: "فطر (مشروم)", cal: 22, unit: "100جم", cat: "خضار" },
  { id: 64, name: "فاصوليا خضراء", cal: 31, unit: "100جم", cat: "خضار" },
  { id: 65, name: "بامية", cal: 33, unit: "100جم", cat: "خضار" },
  { id: 66, name: "ملوخية (ورق)", cal: 46, unit: "100جم", cat: "خضار" },
  { id: 67, name: "كرفس", cal: 16, unit: "100جم", cat: "خضار" },
  { id: 68, name: "جرجير", cal: 25, unit: "100جم", cat: "خضار" },
  { id: 69, name: "بنجر (شمندر)", cal: 43, unit: "100جم", cat: "خضار" },
  { id: 70, name: "ملفوف", cal: 25, unit: "100جم", cat: "خضار" },

  // --- دهون ومكسرات (Fats & Nuts) ---
  { id: 71, name: "أفوكادو", cal: 160, unit: "نصف حبة", cat: "دهون" },
  { id: 72, name: "لوز", cal: 7, unit: "حبة", cat: "دهون" },
  { id: 73, name: "جوز (عين جمل)", cal: 26, unit: "حبة", cat: "دهون" },
  { id: 74, name: "فول سوداني", cal: 6, unit: "حبة", cat: "دهون" },
  { id: 75, name: "فستق", cal: 4, unit: "حبة", cat: "دهون" },
  { id: 76, name: "كاجو", cal: 9, unit: "حبة", cat: "دهون" },
  { id: 77, name: "زيت زيتون", cal: 119, unit: "ملعقة", cat: "دهون" },
  { id: 78, name: "زبدة فول سوداني", cal: 94, unit: "ملعقة", cat: "دهون" },
  { id: 79, name: "طحينة", cal: 89, unit: "ملعقة", cat: "دهون" },
  { id: 80, name: "زيت جوز هند", cal: 117, unit: "ملعقة", cat: "دهون" },
  { id: 81, name: "بذور الشيا", cal: 48, unit: "ملعقة", cat: "دهون" },
  { id: 82, name: "بذور الكتان", cal: 37, unit: "ملعقة", cat: "دهون" },
  { id: 83, name: "زيتون أخضر", cal: 5, unit: "حبة", cat: "دهون" },
  { id: 84, name: "زيتون أسود", cal: 7, unit: "حبة", cat: "دهون" },
  { id: 85, name: "قشطة لايت", cal: 30, unit: "ملعقة", cat: "دهون" },

  // --- مشروبات ووجبات خفيفة (Drinks & Snacks) ---
  { id: 86, name: "حليب قليل الدسم", cal: 42, unit: "100مل", cat: "مشروب" },
  { id: 87, name: "حليب لوز غير محلى", cal: 15, unit: "100مل", cat: "مشروب" },
  { id: 88, name: "قهوة سوداء", cal: 2, unit: "كوب", cat: "مشروب" },
  { id: 89, name: "شاي أخضر", cal: 0, unit: "كوب", cat: "مشروب" },
  { id: 90, name: "عصير برتقال طازج", cal: 45, unit: "100مل", cat: "مشروب" },
  { id: 91, name: "عصير تفاح طبيعي", cal: 46, unit: "100مل", cat: "مشروب" },
  { id: 92, name: "لبن زبادي لايت", cal: 40, unit: "100جم", cat: "مشروب" },
  { id: 93, name: "شوكولاتة داكنة 70%", cal: 50, unit: "مكعب", cat: "سناك" },
  { id: 94, name: "فشار (بدون زيت)", cal: 31, unit: "كوب", cat: "سناك" },
  { id: 95, name: "عسل نحل", cal: 64, unit: "ملعقة", cat: "سناك" },
  { id: 96, name: "مربى دايت", cal: 20, unit: "ملعقة", cat: "سناك" },
  { id: 97, name: "مقرمشات الأرز", cal: 35, unit: "قطعة", cat: "سناك" },
  { id: 98, name: "ترمس مطبوخ", cal: 119, unit: "100جم", cat: "سناك" },
  { id: 99, name: "جبنة موزاريلا لايت", cal: 45, unit: "20جم", cat: "سناك" },
  { id: 100, name: "حليب شوفان", cal: 45, unit: "100مل", cat: "مشروب" },
];
export default function PerfectAutoCenteredTracker() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("الكل");
  const [myList, setMyList] = useState<any[]>([]);
  const [goal, setGoal] = useState(2000);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const categories = ["الكل", "بروتين", "نشويات", "دهون", "فواكه", "خضار", "مشروب", "سناك"];

  const updateQty = (food: any, delta: number) => {
    const existing = myList.find(item => item.id === food.id);
    if (existing) {
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        setMyList(myList.filter(item => item.id !== food.id));
      } else {
        setMyList(myList.map(item => item.id === food.id ? { ...item, qty: newQty } : item));
      }
    } else if (delta > 0) {
      setMyList([...myList, { ...food, qty: 1 }]);
    }
  };

  const totalCals = myList.reduce((sum, item) => sum + (item.cal * item.qty), 0);
  const filtered = useMemo(() => {
    return FOOD_LIBRARY.filter(f => 
      f.name.includes(search) && (activeCat === "الكل" || f.cat === activeCat)
    );
  }, [search, activeCat]);

  return (
    <div className="h-[100dvh] bg-[#F5F5F0] flex flex-col items-center overflow-hidden font-sans text-[#3C3C3C]" dir="rtl">
      
      {/* Header - متمركز تلقائياً */}
      <header className="w-full flex-none bg-white/90 backdrop-blur-md border-b border-[#E5E5DE] px-5 py-4 z-50 flex justify-center">
        <div className="w-full max-w-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#6B705C] p-2 rounded-xl">
              <Leaf className="text-white h-4 w-4" />
            </div>
            <h1 className="text-lg font-black tracking-tight">ميزان الغذاء</h1>
          </div>
          
          <button 
            onClick={() => setIsLogOpen(true)}
            className="p-2 bg-[#E9E9E2] rounded-xl flex items-center gap-2 transition-transform active:scale-90"
          >
            <ShoppingBasket size={20} className="text-[#6B705C]" />
            <span className="font-bold text-xs">{myList.length}</span>
          </button>
        </div>
      </header>

      {/* Main Content - التمركز التلقائي للشبكة */}
      <main className="flex-1 w-full overflow-y-auto custom-scrollbar pb-40 flex flex-col items-center">
        <div className="w-full max-w-2xl p-4 md:p-6 space-y-6">
          
          {/* Search Bar - متمركز */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A5A58D]" size={18} />
              <Input 
                placeholder="ابحث عن طعام..."
                className="h-14 pr-12 rounded-2xl border-none bg-white shadow-sm w-full text-base focus:ring-2 focus:ring-[#6B705C]/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Categories - تمركز تلقائي للهاتف */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth justify-start md:justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                    activeCat === cat ? 'bg-[#6B705C] text-white shadow-md' : 'bg-white text-[#A5A58D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Food Cards Grid - تمركز تلقائي */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(food => {
              const inList = myList.find(m => m.id === food.id);
              return (
                <div key={food.id} className="bg-white p-4 rounded-3xl border border-[#E5E5DE] shadow-sm flex justify-between items-center active:bg-gray-50 transition-colors">
                  <div className="flex-1 ml-2 overflow-hidden">
                    <p className="text-[9px] font-black text-[#A5A58D] uppercase tracking-tighter">{food.cat}</p>
                    <h3 className="font-bold text-[#3C3C3C] text-sm truncate">{food.name}</h3>
                    <p className="text-[11px] font-bold text-[#6B705C]">{food.cal} cal</p>
                  </div>

                  <div className="flex items-center bg-[#F5F5F0] rounded-2xl p-1 shrink-0 border border-[#E5E5DE]">
                    {inList && (
                      <div className="flex items-center">
                        <button onClick={()=>updateQty(food, -1)} className="w-8 h-8 flex items-center justify-center text-[#6B705C]"><Minus size={14}/></button>
                        <span className="w-6 text-center font-black text-xs">{inList.qty}</span>
                      </div>
                    )}
                    <button onClick={()=>updateQty(food, 1)} className="w-8 h-8 bg-[#6B705C] text-white rounded-xl flex items-center justify-center shadow-sm"><Plus size={14}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* العداد الكبسولة المتمركز تلقائياً (Perfect Floating Bar) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
        <div className="bg-[#3C3C3C] text-white p-5 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col gap-3 border border-white/5 backdrop-blur-sm">
          {/* Handle bar للإيحاء بالسحب */}
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-1"></div>
          
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Flame className={totalCals > goal ? "text-orange-500 animate-pulse" : "text-[#A5A58D]"} size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">المجموع</p>
                <h2 className="text-2xl font-black tracking-tighter">{totalCals}</h2>
              </div>
            </div>

            <div className="text-left border-r border-white/10 pr-5">
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-right">المتبقي</p>
              <h2 className={`text-xl font-black ${totalCals > goal ? 'text-orange-500' : 'text-white'}`}>
                {goal - totalCals}
              </h2>
            </div>
          </div>

          {/* شريط التقدم النحيف */}
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-in-out ${totalCals > goal ? 'bg-orange-500' : 'bg-[#A5A58D]'}`} 
              style={{ width: `${Math.min((totalCals/goal)*100, 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Drawer المتمركز (سجل الوجبات) */}
      {isLogOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLogOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-t-[3rem] p-6 max-h-[85dvh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-black text-xl">وجبات اليوم</h3>
              <button onClick={() => setIsLogOpen(false)} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="space-y-3">
              {myList.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-[#F5F5F0] rounded-[1.8rem] border border-[#E5E5DE]">
                  <div className="flex-1">
                    <p className="font-black text-sm text-[#3C3C3C]">{item.name}</p>
                    <p className="text-[10px] text-[#A5A58D] font-bold">الكمية: {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm text-[#6B705C]">{item.cal * item.qty} cal</span>
                    <button onClick={()=>updateQty(item, -item.qty)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
              {myList.length === 0 && (
                <div className="text-center py-20 opacity-20">
                  <Calculator size={64} className="mx-auto mb-4" />
                  <p className="font-black text-sm">أضف بعض الوقود ليومك!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}