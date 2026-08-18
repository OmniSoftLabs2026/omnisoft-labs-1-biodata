// Small biodata preview card used on the homepage template gallery.
// Each design has its own color palette while keeping the layout consistent.

const designs = {
  'Ivory Cream': {
    bg: '#FAF8F5', border: '#5B1E31', accent: '#5B1E31',
    rule: '#5B1E31', chip: '#5B1E31', chipText: '#FFFFFF',
    softBar: 'rgba(91,30,49,0.15)', ink: '#1A1412',
    monogram: '\u2766',
  },
  'Warm Taupe': {
    bg: '#9A8C80', border: '#D4AF37', accent: '#FFFFFF',
    rule: '#D4AF37', chip: '#6B5F55', chipText: '#FFFFFF',
    softBar: 'rgba(255,255,255,0.2)', ink: '#FFFFFF',
    monogram: '\u2726',
  },
  'Royal Gold': {
    bg: '#D4AF37', border: '#5B1E31', accent: '#1A1005',
    rule: '#5B1E31', chip: '#5B1E31', chipText: '#D4AF37',
    softBar: 'rgba(26,16,5,0.15)', ink: '#1A1005',
    monogram: '\u2736',
  },
  'Deep Burgundy': {
    bg: '#5B1E31', border: '#D4AF37', accent: '#D4AF37',
    rule: '#D4AF37', chip: '#D4AF37', chipText: '#5B1E31',
    softBar: 'rgba(212,175,55,0.25)', ink: '#FFF5E6',
    monogram: '\u2741',
  },
  'Forest Green': {
    bg: '#1C3B2B', border: '#D4AF37', accent: '#D4AF37',
    rule: '#D4AF37', chip: '#D4AF37', chipText: '#1C3B2B',
    softBar: 'rgba(212,175,55,0.25)', ink: '#F5F0DC',
    monogram: '\u273F',
  },
  'Sage Garden': {
    bg: '#9CAF88', border: '#1C3B2B', accent: '#0D1A0D',
    rule: '#1C3B2B', chip: '#1C3B2B', chipText: '#9CAF88',
    softBar: 'rgba(13,26,13,0.15)', ink: '#0D1A0D',
    monogram: '\u2740',
  },
  'Terracotta': {
    bg: '#C86D51', border: '#FFF5E6', accent: '#FFFFFF',
    rule: '#FFF5E6', chip: '#A04D35', chipText: '#FFFFFF',
    softBar: 'rgba(255,255,255,0.2)', ink: '#FFFFFF',
    monogram: '\u2739',
  },
  'Peach Blush': {
    bg: '#DCAE96', border: '#5B1E31', accent: '#2A1008',
    rule: '#5B1E31', chip: '#5B1E31', chipText: '#DCAE96',
    softBar: 'rgba(42,16,8,0.15)', ink: '#2A1008',
    monogram: '\u2767',
  },
}

export default function TemplateCard({ name, sample }) {
  const d = designs[name]
  if (!d) return null
  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition hover:shadow-md hover:-translate-y-0.5">
      {/* Mini biodata preview */}
      <div
        className="aspect-[3/4] rounded-md p-4 flex flex-col"
        style={{ background: d.bg, border: `1.5px solid ${d.border}` }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[8px] uppercase tracking-[0.25em] font-bold" style={{ color: d.accent }}>
            Marriage Biodata
          </span>
          <span
            className="h-5 w-5 rounded-sm grid place-items-center text-[10px] font-serif"
            style={{ background: d.chip, color: d.chipText }}
          >
            {d.monogram}
          </span>
        </div>

        <div className="my-2 h-px" style={{ background: d.rule, opacity: 0.6 }} />

        <p className="text-center font-serif text-[13px] leading-tight mt-1" style={{ color: d.ink }}>
          {sample.name}
        </p>
        <p className="text-center text-[8px] mt-0.5" style={{ color: d.ink, opacity: 0.7 }}>
          {sample.role} &middot; {sample.age} &middot; {sample.city}
        </p>

        <div className="my-2 h-px" style={{ background: d.rule, opacity: 0.6 }} />

        <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 text-[7px]">
          <span style={{ color: d.ink, opacity: 0.65 }}>Height</span>
          <span className="col-span-2 truncate" style={{ color: d.ink }}>{sample.height}</span>
          <span style={{ color: d.ink, opacity: 0.65 }}>Religion</span>
          <span className="col-span-2 truncate" style={{ color: d.ink }}>{sample.religion}</span>
          <span style={{ color: d.ink, opacity: 0.65 }}>Education</span>
          <span className="col-span-2 truncate" style={{ color: d.ink }}>{sample.education}</span>
          <span style={{ color: d.ink, opacity: 0.65 }}>Family</span>
          <span className="col-span-2 truncate" style={{ color: d.ink }}>{sample.family}</span>
        </div>

        <div className="mt-3 space-y-1">
          <div className="h-1 rounded" style={{ background: d.softBar }} />
          <div className="h-1 rounded w-5/6" style={{ background: d.softBar }} />
          <div className="h-1 rounded w-2/3" style={{ background: d.softBar }} />
        </div>

        <div className="mt-auto pt-2">
          <div className="h-px" style={{ background: d.rule, opacity: 0.5 }} />
          <p className="mt-1.5 text-center text-[7px] uppercase tracking-[0.25em] font-semibold" style={{ color: d.accent }}>
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
        <span
          className="h-3.5 w-3.5 rounded-full border border-white shadow-sm"
          style={{ background: d.bg }}
        />
      </div>
    </div>
  )
}
