import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'صانع وقارئ رمز QR',
  description: 'أنشئ رموز QR مخصصة أو امسح الرموز ضوئياً بسرعة وسهولة.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }