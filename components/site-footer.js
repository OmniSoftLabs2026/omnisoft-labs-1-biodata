import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/70 mt-24">
      <div className="container-narrow py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/90 grid place-items-center text-primary-foreground font-serif">B</div>
            <span className="font-serif text-lg">BiodataCraft</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Elegant marriage biodata, crafted in minutes. Private, thoughtful, and beautifully typeset.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <Link href="/generator" className="hover:text-foreground">Generator</Link>
          <Link href="/payment" className="hover:text-foreground">Payment</Link>
          <Link href="/success" className="hover:text-foreground">Download</Link>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="container-narrow py-4 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} BiodataCraft. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
