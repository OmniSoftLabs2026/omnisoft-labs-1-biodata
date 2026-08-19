'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SiteNav from '@/components/site-nav'

// Payment is now handled via the modal on /design page.
// This page redirects users there.
export default function PaymentPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/design')
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <div className="container-narrow py-24 text-center text-muted-foreground">
        Redirecting to design page…
      </div>
    </div>
  )
}
