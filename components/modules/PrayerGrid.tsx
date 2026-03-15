"use client"
import { PrayerTimeBox } from "../prayer/ui/PrayerTimeBox";

const PrayerGrid = ({ times, nextPrayerName, labels }: any) => {
  // ترتيب الصلوات الذي نريده بالضبط
  const order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {order.map((key) => {
        if (!times[key]) return null; // تخطي أي صلاة غير موجودة
        return (
          <PrayerTimeBox 
            key={key}
            label={labels[key]}
            time={times[key]} // الوقت هنا سيكون بنظام 12 ساعة
            isActive={nextPrayerName === key}
          />
        );
      })}
    </div>
  );
};

export default PrayerGrid;