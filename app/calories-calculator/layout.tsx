import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'حاسبة السعرات الحرارية',
  description: 'احسب السعرات الحرارية , حاسبة السعرات , سعرات الحرارية للأطمعة والفواكة , سعرات حرارية دقيقة.',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }