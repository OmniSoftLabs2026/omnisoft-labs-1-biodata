// Small biodata preview card used on the homepage template gallery.
// Each design has its own soft color palette while keeping the layout consistent.

const designs = {
  'Royal Maroon': {
    bg: 'bg-[#fdf6f5]',
    border: 'border-[#e6c9c4]',
    accent: 'text-[#7a1f2b]',
    rule: 'bg-[#7a1f2b]',
    chip: 'bg-[#7a1f2b] text-white',
    softBar: 'bg-[#7a1f2b]/15',
    monogram: '\u0936',
  },
  'Elegant Gold': {
    bg: 'bg-[#fbf6ea]',
    border: 'border-[#e8d9a6]',
    accent: 'text-[#8a6a1c]',
    rule: 'bg-[#b7902f]',
    chip: 'bg-[#b7902f] text-white',
    softBar: 'bg-[#b7902f]/20',
    monogram: '\u0905',
  },
  'Modern Navy': {
    bg: 'bg-[#f2f5fb]',
    border: 'border-[#c9d4ea]',
    accent: 'text-[#1e3a6b]',
    rule: 'bg-[#1e3a6b]',
    chip: 'bg-[#1e3a6b] text-white',
    softBar: 'bg-[#1e3a6b]/15',
    monogram: '\u0906',
  },
  'Rose Premium': {
    bg: 'bg-[#fdf3f4]',
    border: 'border-[#f0cdd2]',
    accent: 'text-[#a53a58]',
    rule: 'bg-[#c34766]',
    chip: 'bg-[#c34766] text-white',
    softBar: 'bg-[#c34766]/15',
    monogram: '\u0930',
  },
  'Classic Green': {
    bg: 'bg-[#f2f7f2]',
    border: 'border-[#c9dcc9]',
    accent: 'text-[#2f5d3b]',
    rule: 'bg-[#2f5d3b]',
    chip: 'bg-[#2f5d3b] text-white',
    softBar: 'bg-[#2f5d3b]/15',
    monogram: '\u0906',
  },
}

export default function TemplateCard({ name, sample }) {
  const d = designs[name]
  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition hover:shadow-md hover:-translate-y-0.5">
      {/* Mini biodata preview */}
      <div className={`aspect-[3/4] rounded-md border ${d.border} ${d.bg} p-4 flex flex-col`}>
        <div className="flex items-center justify-between">
          <span className={`text-[8px] uppercase tracking-[0.25em] ${d.accent}`}>Marriage Biodata</span>
          <span className={`h-5 w-5 rounded-sm ${d.chip} grid place-items-center text-[10px] font-serif`}>
            {d.monogram}
          </span>
        </div>

        <div className={`my-2 h-px ${d.rule} opacity-40`} />

        <p className="text-center font-serif text-[13px] leading-tight mt-1">{sample.name}</p>
        <p className="text-center text-[8px] text-muted-foreground mt-0.5">
          {sample.role} &middot; {sample.age} &middot; {sample.city}
        </p>

        <div className={`my-2 h-px ${d.rule} opacity-40`} />

        <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 text-[7px]">
          <span className="text-muted-foreground">Height</span>
          <span className="col-span-2 truncate">{sample.height}</span>
          <span className="text-muted-foreground">Religion</span>
          <span className="col-span-2 truncate">{sample.religion}</span>
          <span className="text-muted-foreground">Education</span>
          <span className="col-span-2 truncate">{sample.education}</span>
          <span className="text-muted-foreground">Family</span>
          <span className="col-span-2 truncate">{sample.family}</span>
        </div>

        <div className="mt-3 space-y-1">
          <div className={`h-1 rounded ${d.softBar}`} />
          <div className={`h-1 rounded ${d.softBar} w-5/6`} />
          <div className={`h-1 rounded ${d.softBar} w-2/3`} />
        </div>

        <div className="mt-auto pt-2">
          <div className={`h-px ${d.rule} opacity-40`} />
          <p className={`mt-1.5 text-center text-[7px] uppercase tracking-[0.25em] ${d.accent}`}>
            — With warm regards —
          </p>
        </div>
      </div>

      {/* Card meta */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-serif text-base leading-tight">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Premium design</p>
        </div>
        <span className={`h-3.5 w-3.5 rounded-full ${d.chip} border border-white shadow-sm`} />
      </div>
    </div>
  )
}
