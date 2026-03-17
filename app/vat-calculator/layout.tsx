import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'حاسبة ضريبة القيمة المضافة',
  description: 'حساب الضريبة (VAT) , ضريبة العقارية , ضريبة السكانية , ضريبة الوحدات السكانية , ضريبة الدخل , ضريبة المركبات ',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }