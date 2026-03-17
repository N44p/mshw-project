import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'محول العملات المباشر',
  description: 'تحويل العملات , سعر الدولار اليوم , دولار كم يساوي , تحويل الجنية , الاسترالني كم يساوي , تحويل ريال سعودي للجنية مصري , كم يساوي جنية مصري , الدينار الكويتي , سعر الصرف , أسعار صرف اليوم.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }