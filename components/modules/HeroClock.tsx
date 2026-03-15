"use client"

const HeroClock = ({ name, countdown, time }: any) => (
  <div className="relative overflow-hidden bg-white rounded-[3.5rem] p-12 text-center border border-[#F3EFE0] shadow-[0_40px_100px_rgba(212,175,55,0.05)]">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
    
    <div className="space-y-6">
      <p className="text-[#A69D85] text-sm font-bold tracking-[0.3em] uppercase">الصلاة القادمة</p>
      <h2 className="text-7xl md:text-8xl font-serif font-black text-[#5C5447] tracking-tighter italic">
        {name || "..."}
      </h2>
      <div className="text-5xl font-mono font-extralight text-[#B8860B] drop-shadow-sm transition-all">
        {countdown}
      </div>
      <div className="pt-4 flex justify-center items-center gap-3 text-[#A69D85]">
        <span className="w-8 h-[1px] bg-[#F3EFE0]" />
        <span className="text-sm italic font-medium">الأذان في الساعة {time}</span>
        <span className="w-8 h-[1px] bg-[#F3EFE0]" />
      </div>
    </div>
  </div>
);

export default HeroClock; 