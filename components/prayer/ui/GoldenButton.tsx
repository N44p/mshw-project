export const GoldenButton = ({ children, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/50 border border-[#D4AF37]/30 text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all duration-500 font-bold backdrop-blur-sm shadow-sm hover:shadow-[#D4AF37]/20"
  >
    {icon && <span className="text-xl group-hover:rotate-12 transition-transform">{icon}</span>}
    {children}
  </button>
);