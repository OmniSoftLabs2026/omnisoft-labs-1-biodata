'use client'

/* ---------------------------------------------------------------
   Palette metadata for the design picker swatches.
----------------------------------------------------------------*/
export const templates = {
  'Ivory Cream':    { bg: '#FAF8F5', accent: '#5B1E31', border: '#5B1E31', monogram: '\u2766' },
  'Warm Taupe':     { bg: '#9A8C80', accent: '#FFFFFF', border: '#D4AF37', monogram: '\u2726' },
  'Royal Gold':     { bg: '#D4AF37', accent: '#1A1005', border: '#5B1E31', monogram: '\u2736' },
  'Deep Burgundy':  { bg: '#5B1E31', accent: '#D4AF37', border: '#D4AF37', monogram: '\u2741' },
  'Forest Green':   { bg: '#1C3B2B', accent: '#D4AF37', border: '#D4AF37', monogram: '\u273F' },
  'Sage Garden':    { bg: '#9CAF88', accent: '#0D1A0D', border: '#1C3B2B', monogram: '\u2740' },
  'Terracotta':     { bg: '#C86D51', accent: '#FFFFFF', border: '#FFF5E6', monogram: '\u2739' },
  'Peach Blush':    { bg: '#DCAE96', accent: '#3A1208', border: '#5B1E31', monogram: '\u2767' },
}

const templateOrder = [
  'Ivory Cream', 'Warm Taupe', 'Royal Gold', 'Deep Burgundy',
  'Forest Green', 'Sage Garden', 'Terracotta', 'Peach Blush',
]
export { templateOrder }

/* ---------------------------------------------------------------
   Per-design styling. The LAYOUT is identical for every design
   (title "BIO DATA" + "Label : Value" rows). Only colours, fonts,
   borders and section-heading treatment differ.
----------------------------------------------------------------*/
const DESIGNS = {
  'Ivory Cream': {
    bg: '#FAF8F5', ink: '#1A1412', heading: '#5B1E31', rule: '#5B1E31',
    font: 'font-serif', frame: 'double', frameColor: '#5B1E31', headingStyle: 'underline',
  },
  'Warm Taupe': {
    bg: '#9A8C80', ink: '#FFFFFF', heading: '#FFF8E7', rule: '#D4AF37',
    font: 'font-serif', frame: 'none', headingStyle: 'bar', barBg: '#6B5F55', barText: '#FFF8E7',
  },
  'Royal Gold': {
    bg: '#D4AF37', ink: '#1A1005', heading: '#3A2205', rule: '#5B1E31',
    font: 'font-serif', frame: 'double', frameColor: '#5B1E31', headingStyle: 'underline',
  },
  'Deep Burgundy': {
    bg: '#5B1E31', ink: '#FFF5E6', heading: '#D4AF37', rule: '#D4AF37',
    font: 'font-serif', frame: 'double', frameColor: '#D4AF37', headingStyle: 'underline',
    flourish: true,
  },
  'Forest Green': {
    bg: '#1C3B2B', ink: '#F5F0DC', heading: '#D4AF37', rule: '#D4AF37',
    font: 'font-serif', frame: 'double', frameColor: '#D4AF37', headingStyle: 'underline',
    flourish: true,
  },
  'Sage Garden': {
    bg: '#9CAF88', ink: '#0D1A0D', heading: '#1C3B2B', rule: '#1C3B2B',
    font: 'font-sans', frame: 'none', headingStyle: 'separator',
  },
  'Terracotta': {
    bg: '#C86D51', ink: '#FFFFFF', heading: '#FFF5E6', rule: '#FFF5E6',
    font: 'font-serif', frame: 'none', headingStyle: 'bar', barBg: '#A04D35', barText: '#FFFFFF',
  },
  'Peach Blush': {
    bg: '#DCAE96', ink: '#2A1008', heading: '#5B1E31', rule: '#5B1E31',
    font: 'font-serif', frame: 'none', headingStyle: 'underline',
  },
}

/* ---------------------------------------------------------------
   Data helpers
----------------------------------------------------------------*/
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

function displayValue(field) {
  if (!field) return ''
  const v = String(field.value ?? '').trim()
  if (!v) return ''
  return field.type === 'date' ? formatDate(field.value) : v
}

// Non-empty {label, value} rows from a section, excluding given ids.
function rows(section, exclude = []) {
  return (section || [])
    .filter((f) => !exclude.includes(f.id) && displayValue(f))
    .map((f) => ({ label: f.label, value: displayValue(f) }))
}

function getVal(section, id) {
  const f = (section || []).find((x) => x.id === id)
  return displayValue(f)
}

function buildView(data) {
  const personal = data.personal || []
  const family = data.family || []
  const contact = data.contact || []

  return {
    about: getVal(contact, 'aboutMe'),
    sections: [
      { title: 'Personal Details', items: rows(personal, []) },
      { title: 'Family Details', items: rows(family, []) },
      { title: 'Contact Details', items: rows(contact, ['aboutMe']) },
    ].filter((s) => s.items.length > 0),
  }
}

// A4-proportion page shell.
function Page({ children, style, className = '' }) {
  return (
    <div
      className={`mx-auto w-full shadow-sm ${className}`}
      style={{ maxWidth: '640px', minHeight: '860px', ...style }}
    >
      {children}
    </div>
  )
}

function Flourish({ color }) {
  return (
    <div className="flex items-center gap-3 mt-3 mb-1" style={{ color }}>
      <span className="h-px w-16" style={{ background: color, opacity: 0.55 }} />
      <span className="text-sm leading-none">&#10087;</span>
      <span className="h-px flex-1" style={{ background: color, opacity: 0.3 }} />
    </div>
  )
}

/* The strict "Label : Value" rows shared by every design. */
function Rows({ items, color }) {
  return (
    <div className="space-y-1.5">
      {items.map((it, i) => (
        <div
          key={i}
          className="grid grid-cols-[minmax(120px,180px)_12px_1fr] gap-x-2 text-[13px] leading-snug"
          style={{ color }}
        >
          <span className="font-semibold">{it.label}</span>
          <span>:</span>
          <span>{it.value}</span>
        </div>
      ))}
    </div>
  )
}

function SectionBlock({ d, title, items, about }) {
  const isBar = d.headingStyle === 'bar'
  return (
    <div>
      {isBar ? (
        <div
          className="px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.24em]"
          style={{ color: d.barText || '#fff', background: d.barBg || d.heading }}
        >
          {title}
        </div>
      ) : (
        <>
          <h2 className="text-[13px] font-bold uppercase tracking-[0.24em]" style={{ color: d.heading }}>
            {title}
          </h2>
          {d.headingStyle === 'underline' && (
            <div className="mt-1 h-[1.5px] w-full" style={{ background: d.rule, opacity: 0.7 }} />
          )}
        </>
      )}

      <div className={isBar ? 'mt-3 px-1' : 'mt-3'}>
        {about ? (
          <p className="text-[13px] italic leading-relaxed whitespace-pre-wrap" style={{ color: d.ink }}>
            {about}
          </p>
        ) : (
          <Rows items={items} color={d.ink} />
        )}
      </div>

      {d.headingStyle === 'separator' && (
        <div className="mt-4 h-[1.5px] w-full" style={{ background: d.rule, opacity: 0.7 }} />
      )}
    </div>
  )
}

function Frame({ d, children }) {
  if (d.frame === 'double') {
    return (
      <div className="m-3 h-full" style={{ border: `2px solid ${d.frameColor}` }}>
        <div className="m-1.5 h-full" style={{ border: `1px solid ${d.frameColor}` }}>
          {children}
        </div>
      </div>
    )
  }
  return children
}

/* ---------------------------------------------------------------
   Public component — one layout, styled per design.
----------------------------------------------------------------*/
export default function BiodataPreview({ data, design = 'Ivory Cream' }) {
  const v = buildView(data)
  const d = DESIGNS[design] || DESIGNS['Ivory Cream']

  return (
    <Page style={{ background: d.bg, color: d.ink }} className={d.font}>
      <Frame d={d}>
        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em]" style={{ color: d.heading }}>
            Bio Data
          </h1>
          {d.flourish && <Flourish color={d.rule} />}

          <div className="mt-7 space-y-7">
            {v.sections.map((s) => (
              <SectionBlock key={s.title} d={d} title={s.title} items={s.items} />
            ))}
            {v.about && <SectionBlock d={d} title="About Me" about={v.about} />}
          </div>
        </div>
      </Frame>
    </Page>
  )
}
