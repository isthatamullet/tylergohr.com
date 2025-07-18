import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Concerto - AI Development Orchestration Platform',
  description: 'Building the orchestration layer that makes enterprise AI development more reliable and productive.',
  keywords: 'AI development, orchestration, developer tools, enterprise AI, context preservation',
  authors: [{ name: 'Tyler Gohr' }],
  openGraph: {
    title: 'Concerto - AI Development Orchestration Platform',
    description: 'Building the orchestration layer that makes enterprise AI development more reliable and productive.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: false, // Keep unlisted from search engines for now
    follow: false,
  },
}

export default function ConcertoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* No main navigation - clean layout for Concerto pages */}
      <main>
        {children}
      </main>
    </>
  )
}