import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'مواعيد المناسبات الوطنية',
  description: ' اليوم الوطني , يوم العلم الاماراتي , يوم التاسيس , متى عيد الاضحى , متى عيد الفطر , عيد الاستقلال , متى عيد ستة أكتوبر , إجازة عيد الجلاء , شم نسيم متى , عيد العمال , متى رأس السنة الهجرية, يوم تحرير الكويت  , متى عيد الميلاد , يوم المولد الشريف , تعرف على مواعيد الإجازات والمناسبات الرسمية القادمة.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }