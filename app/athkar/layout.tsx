import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'أذكار الصباح والمساء',
  description: 'أذكار المسلم اليومية مع عداد إلكتروني بسيط وسهل الاستخدام.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }