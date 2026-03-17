import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'قائمة المهام اليومية',
  description: 'نظم وقتك وأدر مهامك اليومية, ,ورقة فاضية , جدول فاضي , جدول للمهام , جدول للكتابة.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }