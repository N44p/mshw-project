// دالة مساعدة لتحويل الوقت للعرض فقط (12 ساعة)
export function format12Hour(time: string) {
  if (!time) return "--:--";
  let [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12 || 12; 
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export async function fetchPrayerTimes(lat: number, lon: number) {
  try {
    const geo = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ar`
    );
    const geoData = await geo.json();
    const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || "موقع غير معروف";

    const res = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=4`
    );
    const data = await res.json();
    const raw = data.data.timings;

    // فلترة الصلوات الـ 6 الأساسية فقط بنظام 24 ساعة (للحسابات)
    const filteredTimes = {
      Fajr: raw.Fajr,
      Sunrise: raw.Sunrise,
      Dhuhr: raw.Dhuhr,
      Asr: raw.Asr,
      Maghrib: raw.Maghrib,
      Isha: raw.Isha
    };

    return { city, times: filteredTimes };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export function calculateNextPrayer(times: any) {
  const now = new Date();
  
  // قائمة الصلوات بالترتيب الزمني
  const list = [
    { name: "Fajr", label: "الفجر", time: times.Fajr },
    { name: "Sunrise", label: "الشروق", time: times.Sunrise },
    { name: "Dhuhr", label: "الظهر", time: times.Dhuhr },
    { name: "Asr", label: "العصر", time: times.Asr },
    { name: "Maghrib", label: "المغرب", time: times.Maghrib },
    { name: "Isha", label: "العشاء", time: times.Isha }
  ];

  for (const p of list) {
    const [h, m] = p.time.split(":");
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m), 0);

    if (d > now) return p;
  }

  // إذا انتهت صلوات اليوم، فالقادمة هي الفجر
  return { ...list[0], isNextDay: true };
}