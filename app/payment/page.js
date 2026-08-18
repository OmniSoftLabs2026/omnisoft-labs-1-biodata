import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1">
        <section className="container-narrow pt-16 pb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Step 2 of 3</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Choose a plan</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
            A one-time fee — no subscriptions, no clutter. Payment integration will be added in a later step.
          </p>
        </section>

        <section className="container-narrow pb-24">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Essential',
                price: '₹99',
                desc: 'One elegant template. Instant PDF download.',
                perks: ['Print-ready PDF', 'Classic template', 'Watermark-free'],
              },
              {
                name: 'Premium',
                price: '₹199',
                desc: 'All templates, editable anytime, priority support.',
                perks: ['All premium templates', 'Unlimited edits (30 days)', 'Priority support', 'High-resolution export'],
                featured: true,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border p-8 ${p.featured ? 'border-primary bg-card' : 'border-border bg-card'}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl">{p.name}</h3>
                  {p.featured && (
                    <span className="text-[10px] uppercase tracking-widest bg-primary text-primary-foreground rounded-full px-3 py-1">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-serif text-4xl">{p.price}</span>
                  <span className="text-sm text-muted-foreground">/ one-time</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-6 space-y-3">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/success"
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition ${
                    p.featured
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border bg-background hover:bg-secondary'
                  }`}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground text-center">
            Payments will be securely processed via a trusted provider. No card details are stored on our servers.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
