import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'التقويم اليومي المباشر',
  description: ' كم تاريخ اليوم بالميلادي , كم تاريخ اليوم بالهجري , تقويم السنة الميلادية , تقويم السنة الهجرية , كم الشهر , ,اسماء الشهور الميلادية . اسماء الشهور الهجرية , تاريخ ميلادي يوافق كم و تاريخ الهجري يوافق كم  ',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }