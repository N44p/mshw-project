import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'محول مقاسات الملابس والأحذية',
  description: 'تحويل المقاسات , كم مقاس ب الانش , تحويل إلى إنش , تحويل إلى سانتي متر , تحويل إلى مقاس أوروبي , تحويل إلى مقاس أمريكي , مقاسات ملابس , كم مقاس .',
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }