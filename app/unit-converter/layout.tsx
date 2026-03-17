import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'محول الوحدات الشامل',
  description: 'تحويل الأوزان، الأطوال، المساحات، ودرجات الحرارة , كم المتر , كم الطن , تحويل طن إلى متر , تحويل الحرارة , تحويل درجة الحرارة , تحويل المساحة , تحويل الطول , تحويل الوزن , تحويل الوحدات , محول الوحدات .',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }