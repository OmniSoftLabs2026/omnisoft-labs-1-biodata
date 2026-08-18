import Link from 'next/link'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import TemplateCard from '@/components/template-card'
import { ArrowRight, PencilLine, LayoutTemplate, Download } from 'lucide-react'

const templates = [
  {
    name: 'Ivory Cream',
    sample: {
      name: 'Aarav Sharma',
      role: 'Software Engineer',
      age: '28 yrs',
      city: 'Mumbai',
      height: "5'10\"",
      religion: 'Hindu · Brahmin',
      education: 'M.Tech, IIT Bombay',
      family: 'Nuclear · Mumbai',
    },
  },
  {
    name: 'Warm Taupe',
    sample: {
      name: 'Ananya Verma',
      role: 'Chartered Accountant',
      age: '26 yrs',
      city: 'Jaipur',
      height: "5'5\"",
      religion: 'Hindu · Agarwal',
      education: 'CA, B.Com (Hons)',
      family: 'Joint · Jaipur',
    },
  },
  {
    name: 'Royal Gold',
    sample: {
      name: 'Rohan Mehta',
      role: 'Product Manager',
      age: '30 yrs',
      city: 'Bengaluru',
      height: "6'0\"",
      religion: 'Hindu · Punjabi',
      education: 'MBA, IIM Ahmedabad',
      family: 'Nuclear · Delhi',
    },
  },
  {
    name: 'Deep Burgundy',
    sample: {
      name: 'Isha Patel',
      role: 'Interior Designer',
      age: '27 yrs',
      city: 'Ahmedabad',
      height: "5'4\"",
      religion: 'Hindu · Patel',
      education: 'B.Des, NID',
      family: 'Nuclear · Surat',
    },
  },
  {
    name: 'Forest Green',
    sample: {
      name: 'Kunal Nair',
      role: 'Doctor (MD)',
      age: '29 yrs',
      city: 'Kochi',
      height: "5'9\"",
      religion: 'Hindu · Nair',
      education: 'MBBS, MD Medicine',
      family: 'Nuclear · Kochi',
    },
  },
  {
    name: 'Sage Garden',
    sample: {
      name: 'Priya Iyer',
      role: 'UX Researcher',
      age: '25 yrs',
      city: 'Chennai',
      height: "5'3\"",
      religion: 'Hindu · Iyer',
      education: 'M.Des, IIT Guwahati',
      family: 'Nuclear · Chennai',
    },
  },
  {
    name: 'Terracotta',
    sample: {
      name: 'Arjun Reddy',
      role: 'Civil Engineer',
      age: '31 yrs',
      city: 'Hyderabad',
      height: "5'11\"",
      religion: 'Hindu · Reddy',
      education: 'B.Tech, NIT Warangal',
      family: 'Joint · Hyderabad',
    },
  },
  {
    name: 'Peach Blush',
    sample: {
      name: 'Meera Joshi',
      role: 'Data Scientist',
      age: '26 yrs',
      city: 'Pune',
      height: "5'6\"",
      religion: 'Hindu · Maratha',
      education: 'M.Sc, IISc Bangalore',
      family: 'Nuclear · Pune',
    },
  },
]

const steps = [
  {
    icon: PencilLine,
    n: '01',
    title: 'Enter Your Details',
    desc: 'Fill a short, guided form — personal, family and preferences.',
  },
  {
    icon: LayoutTemplate,
    n: '02',
    title: 'Choose Your Design',
    desc: 'Pick from eight refined templates that suit your style.',
  },
  {
    icon: Download,
    n: '03',
    title: 'Download Your PDF',
    desc: 'Get a crisp, print-ready PDF you can share right away.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="container-narrow pt-20 pb-24 md:pt-28 md:pb-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Premium marriage biodata generator
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-foreground max-w-4xl mx-auto">
            Create a Beautiful <span className="italic text-primary">Marriage Biodata</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create your personalized marriage biodata in minutes and download it as a premium PDF.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href="/generator"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Create My Biodata <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Simple &nbsp;•&nbsp; Elegant &nbsp;•&nbsp; Ready to Download
          </p>
        </section>

        {/* Templates */}
        <section className="container-narrow pb-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Templates</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl leading-tight">
              Choose From 8 Premium Designs
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every template is thoughtfully typeset — clean, dignified, and print-ready.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((t) => (
              <TemplateCard key={t.name} name={t.name} sample={t.sample} />
            ))}
          </div>
        </section>

        {/* 3 steps */}
        <section className="container-narrow pb-24">
          <div className="rounded-2xl border border-border bg-secondary/50 p-10 md:p-14">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">How it works</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">Ready in three quiet steps.</h2>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-xl border border-border bg-card p-6 text-center"
                >
                  <div className="mx-auto h-11 w-11 rounded-full border border-border bg-background grid place-items-center">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-4 font-serif text-primary text-sm tracking-[0.2em]">{s.n}</div>
                  <h3 className="mt-1 font-serif text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                Create My Biodata <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
