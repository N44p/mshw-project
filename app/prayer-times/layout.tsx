import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'مواقيت الصلاة بدقة',
  description: 'مواعيد الصلاة دبي , الرياض , جدة , أبو ظبي , الكويت , المنامة , الدوحة , القاهرة ,صنعاء , عدن , مأرب , حضر موت , الاسكندرية , شرم الشيخ , المنوفية , السويس , عمان , دمشق , حلب , بغداد , الموصل , مسقط , بيروت .',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }