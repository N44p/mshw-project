export const PrayerTimeBox = ({ label, time, isActive }: { label: string, time: string, isActive: boolean }) => (
  <div className={`flex flex-col items-center p-6 rounded-[2rem] border transition-all duration-700 ${
    isActive ? 'bg-[#C5A059] border-[#C5A059] shadow-2xl shadow-[#c5a059]/40' : 'bg-white border-[#F3EFE0]'
  }`}>
    <span className={`text-sm font-bold mb-2 ${isActive ? 'text-white/80' : 'text-[#A69D85]'}`}>{label}</span>
    <span className={`text-2xl font-light font-mono ${isActive ? 'text-white' : 'text-[#5C5447]'}`}>{time}</span>
  </div>
);