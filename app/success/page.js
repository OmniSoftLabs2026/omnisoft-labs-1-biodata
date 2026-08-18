'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { useBiodata } from '@/lib/biodata-store'
import BiodataPreview, { templates } from '@/components/biodata-preview'
import { Download, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const router = useRouter()
  const { data, hydrated } = useBiodata()
  const [paid, setPaid] = useState(false)
  const [generating, setGenerating] = useState(false)
  const previewRef = useRef(null)

  const selected = data.template && templates[data.template] ? data.template : 'Ivory Cream'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('biodatacraft:paid')
      if (status === 'true') {
        setPaid(true)
      } else {
        router.push('/payment')
      }
    }
  }, [router])

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return
    setGenerating(true)

    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const el = previewRef.current
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')

      // A4 dimensions in mm
      const pdfW = 210
      const pdfH = 297

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
      pdf.save('biodata.pdf')
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Something went wrong generating the PDF. Please try again.')
    } finally {
      setGenerating(false)
    }
  }, [])

  if (!hydrated || !paid) {
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
        <section className="container-narrow pt-16 pb-6 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-green-100 grid place-items-center">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <h1 className="mt-5 font-serif text-4xl md:text-5xl tracking-tight">Your biodata is ready!</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Payment successful. Download your beautifully formatted biodata PDF below.
          </p>
        </section>

        <section className="container-narrow pb-8 flex justify-center">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={generating}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60"
            >
              {generating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating PDF…</>
              ) : (
                <><Download className="h-4 w-4" /> Download PDF</>
              )}
            </button>
            <Link
              href="/generator"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3.5 text-sm font-medium hover:bg-secondary transition"
            >
              Edit & Regenerate <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Hidden full-size A4 preview for PDF generation */}
        <section className="container-narrow pb-24 flex justify-center">
          <div className="rounded-2xl border border-border bg-secondary/30 p-4 sm:p-6 w-full" style={{ maxWidth: '660px' }}>
            <div ref={previewRef}>
              <BiodataPreview data={data} design={selected} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
