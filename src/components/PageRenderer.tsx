import { Helmet } from "react-helmet-async"
import SectionRenderer from "./SectionRenderer"
import { getPageData } from "@/services/cms"
import { pageRegistry } from "@/services/pageRegistry"

interface PageRendererProps {
  route: string
  children?: React.ReactNode
}

export default function PageRenderer({ route, children }: PageRendererProps) {
  const reg = pageRegistry.find(p => p.route === route)
  const data = getPageData(route)

  if (!reg) return <>{children}</>

  const seo = data?.seo || { title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '' }

  return (
    <>
      <Helmet>
        <title>{seo.title || `${reg.name} | AB DIGITAL SOLUTION`}</title>
        {seo.description && <meta name="description" content={seo.description} />}
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
        {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
        {data?.status === 'draft' && <meta name="robots" content="noindex,nofollow" />}
      </Helmet>
      {data?.status === 'draft' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 text-center text-xs py-1 font-medium">
          DRAFT MODE — This page is not published
        </div>
      )}
      {reg.sections.map((sec) => (
        <SectionRenderer key={sec.type} type={sec.type} data={data?.sections?.[sec.type]} />
      ))}
      {children}
    </>
  )
}
