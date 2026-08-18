import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function GeneratorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1">
        <section className="container-narrow pt-16 pb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Step 1 of 3</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Create your biodata</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
            This is where the guided form will live. We&apos;ll build the sections one by one — personal details,
            family background, education &amp; career, and partner preferences.
          </p>
        </section>

        <section className="container-narrow pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-xl border border-border bg-card p-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Form placeholder</p>
              <h2 className="mt-2 font-serif text-2xl">Sections coming soon</h2>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Personal details</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Family background</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Education &amp; career</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Partner preferences</li>
                <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Contact details</li>
              </ul>
              <div className="mt-10 flex justify-end">
                <Link href="/payment" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
                  Continue to payment <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <aside className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Live preview</p>
              <div className="mt-4 aspect-[3/4] rounded-lg border border-border bg-background p-6">
                <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Marriage Biodata</p>
                <div className="my-3 h-px bg-border" />
                <p className="text-center font-serif text-xl text-muted-foreground/60">Your Name</p>
                <p className="text-center text-xs text-muted-foreground mt-1">Profession · Age · City</p>
                <div className="my-4 h-px bg-border" />
                <div className="space-y-2 text-xs text-muted-foreground/60">
                  <div className="h-2 bg-secondary rounded" />
                  <div className="h-2 bg-secondary rounded w-4/5" />
                  <div className="h-2 bg-secondary rounded w-3/5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Preview will update as you fill the form.</p>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
