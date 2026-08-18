// Small biodata preview card used on the homepage template gallery.
// Matches the actual simple layout: BIODATA title + section headers + Label : Value rows.

const designs = {
  'Ivory Cream': {
    bg: '#FAF8F5', border: '#5B1E31', accent: '#5B1E31',
    rule: '#5B1E31', ink: '#1A1412',
  },
  'Warm Taupe': {
    bg: '#9A8C80', border: '#D4AF37', accent: '#FFF8E7',
    rule: '#D4AF37', ink: '#FFFFFF',
  },
  'Royal Gold': {
    bg: '#D4AF37', border: '#5B1E31', accent: '#3A2205',
    rule: '#5B1E31', ink: '#1A1005',
  },
  'Deep Burgundy': {
    bg: '#5B1E31', border: '#D4AF37', accent: '#D4AF37',
    rule: '#D4AF37', ink: '#FFF5E6',
  },
  'Forest Green': {
    bg: '#1C3B2B', border: '#D4AF37', accent: '#D4AF37',
    rule: '#D4AF37', ink: '#F5F0DC',
  },
  'Sage Garden': {
    bg: '#9CAF88', border: '#1C3B2B', accent: '#1C3B2B',
    rule: '#1C3B2B', ink: '#0D1A0D',
  },
  'Terracotta': {
    bg: '#C86D51', border: '#FFF5E6', accent: '#FFF5E6',
    rule: '#FFF5E6', ink: '#FFFFFF',
  },
  'Peach Blush': {
    bg: '#DCAE96', border: '#5B1E31', accent: '#5B1E31',
    rule: '#5B1E31', ink: '#2A1008',
  },
}

export default function TemplateCard({ name, sample }) {
  const d = designs[name]
  if (!d) return null

  const rows = [
    ['Name', sample.name],
    ['Height', sample.height],
    ['Religion', sample.religion],
    ['Education', sample.education],
  ]

  const familyRows = [
    ['Family', sample.family],
  ]

  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition hover:shadow-md hover:-translate-y-0.5">
      {/* Mini biodata preview matching actual layout */}
      <div
        className="aspect-[3/4] rounded-md p-4 flex flex-col overflow-hidden"
        style={{ background: d.bg, border: `1.5px solid ${d.border}` }}
      >
        {/* Title centered */}
        <p
          className="text-center text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ color: d.accent }}
        >
          Biodata
        </p>
        <div className="mx-auto mt-1 h-px w-10" style={{ background: d.rule, opacity: 0.5 }} />

        {/* Personal Details section */}
        <p
          className="mt-3 text-[7px] font-bold uppercase tracking-[0.18em]"
          style={{ color: d.accent }}
        >
          Personal Details
        </p>
        <div className="mt-0.5 h-px w-full" style={{ background: d.rule, opacity: 0.35 }} />

        <div className="mt-1.5 space-y-[3px]">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[1fr_6px_1.4fr] text-[6.5px] leading-tight">
              <span className="font-semibold" style={{ color: d.ink }}>{label}</span>
              <span style={{ color: d.ink }}>:</span>
              <span className="truncate" style={{ color: d.ink }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Family Details section */}
        <p
          className="mt-3 text-[7px] font-bold uppercase tracking-[0.18em]"
          style={{ color: d.accent }}
        >
          Family Details
        </p>
        <div className="mt-0.5 h-px w-full" style={{ background: d.rule, opacity: 0.35 }} />

        <div className="mt-1.5 space-y-[3px]">
          {familyRows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[1fr_6px_1.4fr] text-[6.5px] leading-tight">
              <span className="font-semibold" style={{ color: d.ink }}>{label}</span>
              <span style={{ color: d.ink }}>:</span>
              <span className="truncate" style={{ color: d.ink }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Placeholder lines */}
        <div className="mt-2 space-y-1">
          <div className="h-[2px] rounded" style={{ background: d.ink, opacity: 0.08 }} />
          <div className="h-[2px] rounded w-4/5" style={{ background: d.ink, opacity: 0.08 }} />
          <div className="h-[2px] rounded w-3/5" style={{ background: d.ink, opacity: 0.08 }} />
        </div>

        {/* Contact section */}
        <p
          className="mt-auto text-[7px] font-bold uppercase tracking-[0.18em]"
          style={{ color: d.accent }}
        >
          Contact Details
        </p>
        <div className="mt-0.5 h-px w-full" style={{ background: d.rule, opacity: 0.35 }} />
        <div className="mt-1 space-y-[2px]">
          <div className="h-[2px] rounded w-full" style={{ background: d.ink, opacity: 0.08 }} />
          <div className="h-[2px] rounded w-3/4" style={{ background: d.ink, opacity: 0.08 }} />
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
