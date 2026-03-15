export const StatusBadge = ({ city }: { city: string }) => (
  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#FAF9F6] border border-[#F3EFE0] shadow-inner">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
    </span>
    <span className="text-sm font-bold text-[#8A7E6A] tracking-tight">{city}</span>
  </div>
);