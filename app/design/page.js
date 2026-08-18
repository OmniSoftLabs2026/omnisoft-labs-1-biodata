'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { useBiodata } from '@/lib/biodata-store'
import BiodataPreview, { templates } from '@/components/biodata-preview'
import { ArrowLeft, ArrowRight, Check, Eye } from 'lucide-react'

const templateOrder = [
  'Royal Maroon',
  'Elegant Gold',
  'Modern Navy',
  'Rose Premium',
  'Classic Green',
]

function fieldValue(section, id) {
  const f = (section || []).find((x) => x.id === id)
  return f ? String(f.value || '').trim() : ''
}

export default function DesignPage() {
  const router = useRouter()
  const { data, setTemplate, hydrated } = useBiodata()

  const selected = data.template && templates[data.template] ? data.template : 'Royal Maroon'

  const summary = useMemo(() => {
    const bits = [
      fieldValue(data.personal, 'fullName'),
      fieldValue(data.personal, 'profession'),
      fieldValue(data.personal, 'height'),
    ].filter(Boolean)
    return bits.join(' · ') || 'Your details will appear here'
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
        <section className="container-narrow pt-14 pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Step 2 of 3</span>
            <span className="h-px w-8 bg-border" />
            <span>Design</span>
          </div>
          <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Choose your design</h1>
              <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
                Tap a template to see your biodata rendered in real time. You can switch as often as you like.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-4 w-4 text-primary" />
              Live preview enabled
            </div>
          </div>
        </section>

        <section className="container-narrow pb-24">
          <div className="grid lg:grid-cols-[320px_1fr] gap-8">
            {/* Templates picker */}
            <aside className="space-y-3 lg:sticky lg:top-24 self-start">
              <p className="text-xs uppercase tracking-widest text-muted-foreground px-1">
                5 Premium Designs
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {templateOrder.map((name) => {
                  const t = templates[name]
                  const isActive = selected === name
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setTemplate(name)}
                      className={`text-left rounded-xl border p-3 transition ${
                        isActive
                          ? 'border-primary ring-2 ring-primary/20 bg-card'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-10 w-10 rounded-md border grid place-items-center font-serif text-lg shrink-0"
                          style={{
                            background: t.bg,
                            color: t.accent,
                            borderColor: t.accent,
                          }}
                        >
                          {t.monogram}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-[15px] leading-tight truncate">{name}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">Premium design</p>
                        </div>
                        <span
                          className={`h-5 w-5 rounded-full grid place-items-center shrink-0 transition ${
                            isActive ? 'text-white' : 'text-transparent'
                          }`}
                          style={{ background: isActive ? t.accent : 'transparent', borderWidth: isActive ? 0 : 1, borderColor: 'hsl(var(--border))' }}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                      </div>
                      <div className="mt-3 flex gap-1.5">
                        <span className="h-2 flex-1 rounded" style={{ background: t.accent, opacity: 0.9 }} />
                        <span className="h-2 flex-1 rounded" style={{ background: t.accent, opacity: 0.45 }} />
                        <span className="h-2 flex-1 rounded" style={{ background: t.accent, opacity: 0.2 }} />
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground leading-relaxed">
                Previewing: <span className="text-foreground font-medium">{summary}</span>
              </div>
            </aside>

            {/* Live preview */}
            <div>
              <div className="rounded-2xl border border-border bg-secondary/30 p-4 sm:p-8">
                <BiodataPreview data={data} design={selected} />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Link
                  href="/generator"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary transition"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to details
                </Link>
                <button
                  type="button"
                  onClick={() => router.push('/payment')}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  Continue to Payment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
