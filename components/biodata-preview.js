'use client'

/* ---------------------------------------------------------------
   Palette metadata for the design picker swatches.
----------------------------------------------------------------*/
export const templates = {
  'Royal Maroon': { bg: '#f8efdd', accent: '#7a1f2b', border: '#c19a3e', monogram: '\u2766' },
  'Elegant Gold': { bg: '#fbf7ee', accent: '#a9812f', border: '#c9a24b', monogram: '\u2726' },
  'Modern Navy': { bg: '#ffffff', accent: '#1e3a6b', border: '#cbd5e1', monogram: '\u25c6' },
  'Rose Premium': { bg: '#fdf2f4', accent: '#7d1f3a', border: '#c08497', monogram: '\u2741' },
  'Classic Green': { bg: '#f7f3e6', accent: '#1f4d2e', border: '#c2a24a', monogram: '\u273f' },
}

const templateOrder = ['Royal Maroon', 'Elegant Gold', 'Modern Navy', 'Rose Premium', 'Classic Green']
export { templateOrder }

/* ---------------------------------------------------------------
   Per-design styling. The LAYOUT is identical for every design
   (title "BIO DATA" + "Label : Value" rows). Only colours, fonts,
   borders and section-heading treatment differ. Adding a new design
   is just a new entry here — the strict format is preserved.
----------------------------------------------------------------*/
const DESIGNS = {
  'Royal Maroon': {
    bg: '#f8efdd', ink: '#3a2a22', heading: '#7a1f2b', rule: '#c19a3e',
    font: 'font-serif', frame: 'double', frameColor: '#c19a3e', headingStyle: 'underline',
  },
  'Elegant Gold': {
    bg: '#fbf7ee', ink: '#4a3b28', heading: '#a9812f', rule: '#c9a24b',
    font: 'font-serif', frame: 'none', headingStyle: 'plain',
  },
  'Modern Navy': {
    bg: '#ffffff', ink: '#243244', heading: '#1e3a6b', rule: '#cbd5e1',
    font: 'font-sans', frame: 'none', headingStyle: 'separator',
  },
  'Rose Premium': {
    bg: '#fdf2f4', ink: '#4a2530', heading: '#7d1f3a', rule: '#c08497',
    font: 'font-serif', frame: 'none', headingStyle: 'underline', flourish: true,
  },
  'Classic Green': {
    bg: '#f7f3e6', ink: '#22301f', heading: '#1f4d2e', rule: '#c2a24a',
    font: 'font-serif', frame: 'double', frameColor: '#c2a24a', headingStyle: 'bar',
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
          <span className="font-medium">{it.label}</span>
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
          className="px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: '#fff', background: d.heading }}
        >
          {title}
        </div>
      ) : (
        <>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.24em]" style={{ color: d.heading }}>
            {title}
          </h2>
          {d.headingStyle === 'underline' && (
            <div className="mt-1 h-px w-full" style={{ background: d.rule, opacity: 0.6 }} />
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
        <div className="mt-4 h-px w-full" style={{ background: d.rule }} />
      )}
    </div>
  )
}

function Frame({ d, children }) {
  if (d.frame === 'double') {
    return (
      <div className="m-3 h-full" style={{ border: `1px solid ${d.frameColor}` }}>
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
export default function BiodataPreview({ data, design = 'Royal Maroon' }) {
  const v = buildView(data)
  const d = DESIGNS[design] || DESIGNS['Royal Maroon']

  return (
    <Page style={{ background: d.bg, color: d.ink }} className={d.font}>
      <Frame d={d}>
        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]" style={{ color: d.heading }}>
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
