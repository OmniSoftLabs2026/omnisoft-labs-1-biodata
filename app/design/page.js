'use client'

import Link from 'next/link'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { useBiodata } from '@/lib/biodata-store'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function DesignPage() {
  const { data, hydrated } = useBiodata()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1">
        <section className="container-narrow pt-16 pb-24">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Step 2 of 3</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Choose your design</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
            Your details are safely saved. Template selection with live preview will be added in the next step.
          </p>

          {hydrated && (
            <div className="mt-10 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Saved: <span className="text-foreground font-medium">{data.fullName || 'Your biodata'}</span>
                {data.profession && <span>&middot; {data.profession}</span>}
                {data.height && <span>&middot; {data.height}</span>}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/generator"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary transition"
                >
                  Edit details
                </Link>
                <Link
                  href="/payment"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  Continue to payment <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
