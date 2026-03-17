import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'مواعيد الرواتب والدعم',
  description: 'موعد الرواتب , كم باقي على الرواتب , حساب مواطن , كم باقي على حساب مواطن , الدعم الاجتماعي , تكافل  وكرامة , موعد صرف الدعم , موعد صرف حساب مواطن , موعد صرف تكافل وكرامة , موعد صرف الضمان الاجتماعي , موعد صرف المساعدة المقطوعة , موعد صرف الضمان الاجتماعي الجديد , رواتب الكويت , دعم العمالة , رواتب في الامارات , نافس , رواتب مصر  .',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }