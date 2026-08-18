'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { useBiodata } from '@/lib/biodata-store'
import BiodataPreview, { templates, templateOrder } from '@/components/biodata-preview'
import { ArrowLeft, Download, Check, Eye } from 'lucide-react'

export default function DesignPage() {
  const router = useRouter()
  const { data, setTemplate, hydrated } = useBiodata()

  const selected = data.template && templates[data.template] ? data.template : 'Ivory Cream'

  const hasData = useMemo(() => {
    const personal = data.personal || []
    return personal.some((f) => String(f.value || '').trim() !== '')
  }, [data.personal])

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
                Pick a design and see your biodata come alive. All templates are available at one price.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-4 w-4 text-primary" />
              Live preview
            </div>
          </div>
        </section>

        {/* Template cards grid */}
        <section className="container-narrow pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {templateOrder.map((name) => {
              const t = templates[name]
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
                  {/* Color swatch */}
                  <div
                    className="mx-auto h-12 w-12 rounded-lg border grid place-items-center font-serif text-xl"
                    style={{ background: t.bg, color: t.accent, borderColor: t.border }}
                  >
                    {t.monogram}
                  </div>
                  <p className="mt-2 text-[11px] font-medium leading-tight truncate">{name}</p>

                  {/* Pricing */}
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <span className="text-[10px] text-muted-foreground line-through">₹99</span>
                    <span className="text-[11px] font-bold text-primary">₹79</span>
                  </div>

                  {/* Selected check */}
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

        {/* Live preview + actions */}
        <section className="container-narrow pb-24">
          <div className="mt-6">
            {/* A4 Preview */}
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
                onClick={() => router.push('/payment')}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                <Download className="h-4 w-4" />
                Download PDF
                <span className="ml-1 text-xs opacity-80">— ₹79</span>
              </button>
            </div>

            {!hasData && (
              <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground text-center">
                Your preview is empty.{' '}
                <Link href="/generator" className="text-primary underline underline-offset-2">Fill in your details</Link>{' '}
                to see the biodata come alive.
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
