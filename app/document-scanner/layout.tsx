import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'ماسح المستندات (Scanner)',
  description: 'حول صور مستنداتك إلى ملفات رقمية واضحة بسهولة.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }