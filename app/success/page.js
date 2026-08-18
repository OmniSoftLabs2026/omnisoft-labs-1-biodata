import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import Link from 'next/link'
import { Download, CheckCircle2, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1">
        <section className="container-narrow pt-20 pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 grid place-items-center">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">Step 3 of 3</p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Your biodata is ready.</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Thank you. Your document has been beautifully typeset and is ready to download. You can revisit and
              re-download it anytime.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
              <Link
                href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-secondary transition"
              >
                Create another <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-14 rounded-xl border border-border bg-card p-6 text-left">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">A gentle note</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Your biodata is a reflection of you and your family. Take a moment to review it before sharing. If
                you&apos;d like edits, you can return to the generator anytime.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
