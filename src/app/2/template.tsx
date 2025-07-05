"use client"

import { usePathname } from 'next/navigation'
import { ClientAnimatePresence, ClientMotionDiv } from '@/app/2/lib/framer-motion-client'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return (
    <ClientAnimatePresence mode="wait">
      <ClientMotionDiv
        key={pathname}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ 
          duration: 0.35, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="min-h-screen"
      >
        {children}
      </ClientMotionDiv>
    </ClientAnimatePresence>
  )
}