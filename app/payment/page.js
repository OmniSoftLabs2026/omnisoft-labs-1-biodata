'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { useBiodata } from '@/lib/biodata-store'
import { templates } from '@/components/biodata-preview'
import { ArrowLeft, Shield, Lock, CreditCard, Check } from 'lucide-react'
import Link from 'next/link'

export default function PaymentPage() {
  const router = useRouter()
  const { data, hydrated } = useBiodata()
  const [processing, setProcessing] = useState(false)

  const selected = data.template && templates[data.template] ? data.template : 'Ivory Cream'
  const t = templates[selected]

  const handlePay = () => {
    setProcessing(true)
    // Mock payment — simulate a short delay then redirect
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('biodatacraft:paid', 'true')
      }
      router.push('/success')
    }, 1500)
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteNav />
        <div className="container-narrow py-24 text-muted-foreground">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        <section className="container-narrow pt-14 pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Step 3 of 3</span>
            <span className="h-px w-8 bg-border" />
            <span>Payment</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Complete your order</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            One-time payment. Instant PDF download. No subscriptions.
          </p>
        </section>

        <section className="container-narrow pb-24">
          <div className="grid md:grid-cols-[1fr_380px] gap-8">
            {/* Order summary */}
            <div className="space-y-6">
              {/* Selected template card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Selected Template</p>
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-lg border grid place-items-center font-serif text-2xl shrink-0"
                    style={{ background: t.bg, color: t.accent, borderColor: t.border }}
                  >
                    {t.monogram}
                  </div>
                  <div>
                    <p className="font-serif text-xl">{selected}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Premium biodata template</p>
                  </div>
                </div>
              </div>

              {/* What you get */}
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">What you get</p>
                <ul className="space-y-3">
                  {[
                    'High-quality A4 PDF download',
                    'Print-ready format',
                    'Watermark-free document',
                    'Re-download anytime',
                    'Edit & regenerate free',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/design"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="h-4 w-4" /> Change template
              </Link>
            </div>

            {/* Payment card */}
            <div className="self-start">
              <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Order Total</p>

                {/* Price breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biodata PDF</span>
                    <span className="line-through text-muted-foreground">₹99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-medium">Launch offer</span>
                    <span className="text-primary font-medium">−₹20</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-serif text-2xl font-bold">₹79</span>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={processing}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay ₹79
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    Secure 256-bit encrypted payment
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    100% money-back guarantee
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-muted-foreground text-center leading-relaxed">
                By proceeding you agree to our Terms of Service.
                Payment gateway will be integrated soon.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
