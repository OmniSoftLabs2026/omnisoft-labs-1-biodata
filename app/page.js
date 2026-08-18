import Link from 'next/link'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { ArrowRight, FileText, Sparkles, ShieldCheck, Download } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Thoughtful templates',
    desc: 'Refined layouts with elegant typography — no clutter, just clarity.',
  },
  {
    icon: Sparkles,
    title: 'Made in minutes',
    desc: 'Fill a simple form and preview your biodata instantly. No design skills needed.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    desc: 'Your details stay yours. We never share or misuse your information.',
  },
  {
    icon: Download,
    title: 'Print-ready PDF',
    desc: 'Download a crisp, share-ready PDF — perfect for family and matchmakers.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="container-narrow pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Premium marriage biodata, made simple
            </div>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight text-foreground">
              A beautiful biodata,<br />
              <span className="italic text-primary">crafted with care.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Create an elegant, print-ready marriage biodata in minutes. Clean layouts, refined typography,
              and a calm process — designed for families who value simplicity and grace.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                Create your biodata <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-secondary transition"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>

        {/* Preview strip */}
        <section className="container-narrow">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-14">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Sample preview</p>
                <h2 className="font-serif text-3xl md:text-4xl leading-tight">Elegant on paper. Effortless to make.</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Choose from tasteful templates, add your details, and get a biodata that feels considered — never
                  cluttered.
                </p>
              </div>
              <div className="aspect-[3/4] rounded-lg border border-border bg-background p-8 shadow-sm">
                <div className="h-full flex flex-col">
                  <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">Marriage Biodata</p>
                  <div className="my-4 h-px bg-border" />
                  <p className="text-center font-serif text-2xl">Aarav Sharma</p>
                  <p className="text-center text-xs text-muted-foreground mt-1">Software Engineer · 28 · Mumbai</p>
                  <div className="my-5 h-px bg-border" />
                  <div className="grid grid-cols-2 gap-y-3 text-xs">
                    <span className="text-muted-foreground">Height</span><span>5&apos;10&quot;</span>
                    <span className="text-muted-foreground">Religion</span><span>Hindu</span>
                    <span className="text-muted-foreground">Education</span><span>M.Tech, IIT Bombay</span>
                    <span className="text-muted-foreground">Family</span><span>Nuclear</span>
                  </div>
                  <div className="mt-auto pt-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                    — With warm regards —
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container-narrow py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Why BiodataCraft</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl leading-tight">Designed to feel calm and premium.</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-serif text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="container-narrow pb-24">
          <div className="rounded-2xl bg-secondary/60 border border-border p-10 md:p-14">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">How it works</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Three quiet steps.</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-8">
              {[
                { n: '01', t: 'Fill your details', d: 'Answer a short, guided form — personal, family, and preferences.' },
                { n: '02', t: 'Preview & refine', d: 'See a live preview. Adjust anything with a click.' },
                { n: '03', t: 'Download PDF', d: 'Get a print-ready PDF, beautifully typeset and share-ready.' },
              ].map((s) => (
                <div key={s.n}>
                  <div className="font-serif text-primary text-2xl">{s.n}</div>
                  <h3 className="mt-2 font-serif text-xl">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                Start now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
