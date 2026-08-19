'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useState, useRef, useMemo, useCallback } from 'react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { useBiodata } from '@/lib/biodata-store'
import BiodataPreview, { templates, templateOrder } from '@/components/biodata-preview'
import {
  ArrowLeft, Download, Check, Eye, X, FileText,
  Shield, Sparkles, Palette, Loader2, AlertCircle,
} from 'lucide-react'

const PRICE_ORIGINAL = 99
const PRICE_OFFER = 79

export default function DesignPage() {
  const { data, setTemplate, hydrated } = useBiodata()
  const [showModal, setShowModal] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState('')
  const [paymentStage, setPaymentStage] = useState('')
  const pdfRef = useRef(null)

  const selected = data.template && templates[data.template] ? data.template : 'Ivory Cream'
  const t = templates[selected]

  const hasData = useMemo(() => {
    const personal = data.personal || []
    return personal.some((f) => String(f.value || '').trim() !== '')
  }, [data.personal])

  /* ── Generate PDF after verified payment ── */
  const generatePDF = useCallback(async () => {
    if (!pdfRef.current) return
    setPaymentStage('Generating PDF…')
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const el = pdfRef.current
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
    pdf.save('biodata.pdf')
  }, [])

  /* ── Razorpay payment flow ── */
  const handlePay = useCallback(async () => {
    setProcessing(true)
    setError('')
    setPaymentStage('Creating order…')

    try {
      // Step 1: Create Razorpay order on server
      const orderRes = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selected }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order')

      setPaymentStage('Opening payment…')

      // Step 2: Open Razorpay Checkout
      if (!window.Razorpay) throw new Error('Payment gateway not loaded. Please refresh and try again.')

      await new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'BiodataCraft',
          description: `Premium Biodata - ${selected}`,
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              // Step 3: Verify payment on server
              setPaymentStage('Verifying payment…')

              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              })

              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed')

              // Step 4: Generate PDF only after server verification
              await generatePDF()

              setDownloaded(true)
              resolve()
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment was cancelled. You can try again anytime.'))
            },
          },
          prefill: {},
          theme: { color: '#18181b' },
        })

        checkout.open()
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      setError(msg)
    } finally {
      setProcessing(false)
      setPaymentStage('')
    }
  }, [selected, generatePDF])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteNav />
        <div className="container-narrow py-24 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          <p className="mt-3">Loading your biodata…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="flex-1">
        {/* Header */}
        <section className="container-narrow pt-14 pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Step 2 of 3</span>
            <span className="h-px w-8 bg-border" />
            <span>Choose Design</span>
          </div>
          <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Select your template</h1>
              <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
                Pick a design and see your biodata come alive. All templates at one simple price.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-4 w-4 text-primary" />
              Live preview
            </div>
          </div>
        </section>

        {/* Template cards */}
        <section className="container-narrow pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {templateOrder.map((name) => {
              const tpl = templates[name]
              const isActive = selected === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTemplate(name)}
                  className={`relative rounded-xl border p-2.5 transition text-center ${
                    isActive
                      ? 'border-primary ring-2 ring-primary/20 bg-card'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/40'
                  }`}
                >
                  <div
                    className="mx-auto h-12 w-12 rounded-lg border grid place-items-center font-serif text-xl"
                    style={{ background: tpl.bg, color: tpl.accent, borderColor: tpl.border }}
                  >
                    {tpl.monogram}
                  </div>
                  <p className="mt-2 text-[11px] font-medium leading-tight truncate">{name}</p>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <span className="text-[10px] text-muted-foreground line-through">₹{PRICE_ORIGINAL}</span>
                    <span className="text-[11px] font-bold text-primary">₹{PRICE_OFFER}</span>
                  </div>
                  {isActive && (
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-white grid place-items-center shadow-sm">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Live A4 preview */}
        <section className="container-narrow pb-24">
          <div className="mt-6">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 sm:p-6 flex justify-center">
              <div className="w-full" style={{ maxWidth: '595px' }}>
                <div style={{ aspectRatio: '1 / 1.414', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    <BiodataPreview data={data} design={selected} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Link
                href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary transition"
              >
                <ArrowLeft className="h-4 w-4" /> Edit Details
              </Link>

              <button
                type="button"
                onClick={() => { setShowModal(true); setDownloaded(false); setError('') }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                <Download className="h-4 w-4" />
                Download PDF
                <span className="ml-1 text-xs opacity-80">— ₹{PRICE_OFFER}</span>
              </button>
            </div>

            {!hasData && (
              <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground text-center">
                Your preview is empty.{' '}
                <Link href="/generator" className="text-primary underline underline-offset-2">
                  Fill in your details
                </Link>{' '}
                to see the biodata come alive.
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Hidden full-size preview for PDF generation */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', left: '-9999px', top: 0, width: '595px', zIndex: -1 }}
      >
        <div ref={pdfRef}>
          <BiodataPreview data={data} design={selected} />
        </div>
      </div>

      {/* ── Payment Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !processing) setShowModal(false)
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Close */}
            {!processing && (
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80 grid place-items-center text-muted-foreground hover:text-foreground transition z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {downloaded ? (
              /* ── Success state ── */
              <div className="p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 grid place-items-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mt-5 font-serif text-2xl tracking-tight">Download Complete!</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Your biodata PDF has been saved to your device.
                </p>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              /* ── Payment state ── */
              <>
                <div
                  className="h-1.5 w-full"
                  style={{ background: t.bg, borderBottom: `1px solid ${t.border}` }}
                />

                <div className="p-8">
                  <div className="text-center">
                    <div
                      className="mx-auto h-14 w-14 rounded-xl border grid place-items-center font-serif text-2xl"
                      style={{ background: t.bg, color: t.accent, borderColor: t.border }}
                    >
                      {t.monogram}
                    </div>
                    <h2 className="mt-4 font-serif text-2xl tracking-tight">
                      Your Biodata Is Ready
                    </h2>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      Complete payment to download your high-quality PDF.
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { icon: FileText, label: 'High-quality PDF' },
                      { icon: Shield, label: 'No watermark' },
                      { icon: Palette, label: 'Selected premium design' },
                      { icon: Sparkles, label: 'Instant download' },
                    ].map((b) => (
                      <div
                        key={b.label}
                        className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2.5"
                      >
                        <b.icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-xs font-medium">{b.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{selected}</p>
                        <p className="text-xs text-muted-foreground">Premium biodata template</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          ₹{PRICE_ORIGINAL}
                        </span>
                        <span className="font-serif text-2xl font-bold">₹{PRICE_OFFER}</span>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Pay button */}
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={processing}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {paymentStage || 'Processing…'}
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Pay ₹{PRICE_OFFER} & Download PDF
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-[11px] text-center text-muted-foreground">
                    Secure payment via Razorpay · Instant delivery · No subscriptions
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
