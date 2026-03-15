export const PrayerMainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#D4AF37]/10 py-12 px-6">
    <div className="max-w-6xl mx-auto space-y-12">
      {children}
      <footer className="pt-12 text-center">
        <div className="inline-block w-12 h-[1px] bg-[#F3EFE0] mb-4" />
        <p className="text-[#CDC8B8] text-[10px] tracking-[0.4em] uppercase font-bold">
         •تقبل اللله صالح أعمالكم • 
        </p>
      </footer>
    </div>
  </div>
);