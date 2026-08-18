'use client'

/* ---------------------------------------------------------------
   Template palette metadata — also used by the design picker for
   swatches. Each template below renders a visually distinct layout.
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

// Collect non-empty {label, value} rows from a section, excluding given ids.
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

  const name = getVal(personal, 'fullName')
  const profession = getVal(personal, 'profession')
  const education = getVal(personal, 'education')
  const about = getVal(contact, 'aboutMe')

  return {
    name: name || 'Your Name',
    tagline: [profession, education].filter(Boolean).join('  \u00b7  '),
    initial: (name ? name.trim()[0] : '\u2665').toUpperCase(),
    about,
    sections: [
      { title: 'Personal Details', items: rows(personal, ['fullName']) },
      { title: 'Family Details', items: rows(family, []) },
      { title: 'Contact Details', items: rows(contact, ['aboutMe']) },
    ].filter((s) => s.items.length > 0),
  }
}

// A4-proportion page shell (210 x 297). Grows with content but keeps
// a page-like minimum so it reads as a printable document.
function Page({ children, style, className = '' }) {
  return (
    <div
      className={`mx-auto w-full shadow-sm ${className}`}
      style={{ maxWidth: '640px', aspectRatio: 'auto', minHeight: '860px', ...style }}
    >
      {children}
    </div>
  )
}

/* ===============================================================
   TEMPLATE 1 — ROYAL MAROON
   Cream bg, maroon headings, thin gold borders, serif, circular photo
================================================================*/
function RoyalMaroon({ v }) {
  const maroon = '#7a1f2b'
  const gold = '#c19a3e'
  const ink = '#3a2a22'
  return (
    <Page style={{ background: '#f8efdd', color: ink }} className="font-serif">
      <div className="m-3 h-full" style={{ border: `1px solid ${gold}` }}>
        <div className="m-1.5 h-full p-8 sm:p-10" style={{ border: `1px solid ${gold}` }}>
          {/* Header */}
          <div className="text-center">
            <div
              className="mx-auto grid place-items-center rounded-full text-3xl"
              style={{ height: 104, width: 104, background: '#fff', color: maroon, border: `3px solid ${gold}` }}
            >
              {v.initial}
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.5em]" style={{ color: gold }}>
              Marriage Biodata
            </p>
            <h1 className="mt-2 text-4xl leading-tight" style={{ color: maroon }}>{v.name}</h1>
            {v.tagline && <p className="mt-2 text-[13px]" style={{ color: ink }}>{v.tagline}</p>}
            <div className="mx-auto mt-4 h-px w-40" style={{ background: gold }} />
          </div>

          {/* Sections */}
          <div className="mt-6 space-y-6">
            {v.sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-[13px] uppercase tracking-[0.28em]" style={{ color: maroon }}>{s.title}</h2>
                <div className="mt-1 h-px w-full" style={{ background: gold, opacity: 0.6 }} />
                <div className="mt-3 space-y-2">
                  {s.items.map((it, i) => (
                    <div key={i} className="grid grid-cols-[150px_1fr] gap-3 text-[13px]">
                      <span style={{ color: maroon }}>{it.label}</span>
                      <span>{it.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {v.about && (
              <div>
                <h2 className="text-[13px] uppercase tracking-[0.28em]" style={{ color: maroon }}>About</h2>
                <div className="mt-1 h-px w-full" style={{ background: gold, opacity: 0.6 }} />
                <p className="mt-3 text-[13px] italic leading-relaxed whitespace-pre-wrap">{v.about}</p>
              </div>
            )}
          </div>

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.5em]" style={{ color: gold }}>&mdash; with warm regards &mdash;</p>
        </div>
      </div>
    </Page>
  )
}

/* ===============================================================
   TEMPLATE 2 — ELEGANT GOLD
   Ivory bg, dark brown text, gold accents, minimal, large name top
================================================================*/
function ElegantGold({ v }) {
  const brown = '#4a3b28'
  const gold = '#a9812f'
  return (
    <Page style={{ background: '#fbf7ee', color: brown }} className="font-serif">
      <div className="p-10 sm:p-14">
        {/* Large name header, left aligned, minimal */}
        <p className="text-[11px] uppercase tracking-[0.55em]" style={{ color: gold }}>Marriage Biodata</p>
        <h1 className="mt-4 text-5xl leading-[1.05] tracking-tight">{v.name}</h1>
        {v.tagline && <p className="mt-3 text-[14px]" style={{ color: '#6b5a41' }}>{v.tagline}</p>}
        <div className="mt-6 h-[2px] w-24" style={{ background: gold }} />

        <div className="mt-10 space-y-9">
          {v.sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[12px] uppercase tracking-[0.32em]" style={{ color: gold }}>{s.title}</h2>
              <div className="mt-4 space-y-2.5">
                {s.items.map((it, i) => (
                  <div key={i} className="flex items-baseline gap-4 text-[13.5px]">
                    <span className="w-40 shrink-0" style={{ color: '#8a7454' }}>{it.label}</span>
                    <span className="flex-1">{it.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {v.about && (
            <div>
              <h2 className="text-[12px] uppercase tracking-[0.32em]" style={{ color: gold }}>About</h2>
              <p className="mt-4 text-[13.5px] leading-relaxed whitespace-pre-wrap">{v.about}</p>
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

/* ===============================================================
   TEMPLATE 3 — MODERN NAVY
   White bg, navy headings, grey separators, modern sans, clean photo
================================================================*/
function ModernNavy({ v }) {
  const navy = '#1e3a6b'
  const grey = '#cbd5e1'
  const ink = '#243244'
  return (
    <Page style={{ background: '#ffffff', color: ink }} className="font-sans">
      <div className="p-9 sm:p-11">
        {/* Header: photo left, name right */}
        <div className="flex items-center gap-5">
          <div
            className="grid place-items-center rounded-xl text-2xl font-semibold shrink-0"
            style={{ height: 88, width: 88, background: '#eef2f9', color: navy, border: `1px solid ${grey}` }}
          >
            {v.initial}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em]" style={{ color: navy }}>Marriage Biodata</p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight tracking-tight" style={{ color: navy }}>{v.name}</h1>
            {v.tagline && <p className="mt-1 text-[13px] text-slate-500">{v.tagline}</p>}
          </div>
        </div>

        <div className="mt-6 h-px w-full" style={{ background: grey }} />

        <div className="mt-6 space-y-7">
          {v.sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em]" style={{ color: navy }}>{s.title}</h2>
              <div className="mt-3 grid grid-cols-1 gap-y-2">
                {s.items.map((it, i) => (
                  <div key={i} className="grid grid-cols-[150px_1fr] gap-3 text-[13px]">
                    <span className="text-slate-500">{it.label}</span>
                    <span className="font-medium text-slate-800">{it.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-px w-full" style={{ background: grey, opacity: 0.7 }} />
            </div>
          ))}

          {v.about && (
            <div>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em]" style={{ color: navy }}>About</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">{v.about}</p>
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

/* ===============================================================
   TEMPLATE 4 — ROSE PREMIUM
   Very light pink bg, burgundy headings, rose-gold accents, floral line
================================================================*/
function Floral({ color }) {
  return (
    <div className="flex items-center justify-center gap-3 my-1" style={{ color }}>
      <span className="h-px w-16" style={{ background: color, opacity: 0.5 }} />
      <span className="text-sm">&#10087;</span>
      <span className="h-px w-16" style={{ background: color, opacity: 0.5 }} />
    </div>
  )
}

function RosePremium({ v }) {
  const burgundy = '#7d1f3a'
  const roseGold = '#c08497'
  const ink = '#4a2530'
  return (
    <Page style={{ background: '#fdf2f4', color: ink }} className="font-serif">
      <div className="p-9 sm:p-12">
        <div className="text-center">
          <div
            className="mx-auto grid place-items-center rounded-full text-3xl"
            style={{ height: 96, width: 96, background: '#fff', color: burgundy, border: `2px solid ${roseGold}` }}
          >
            {v.initial}
          </div>
          <div className="mt-4"><Floral color={roseGold} /></div>
          <h1 className="mt-1 text-4xl leading-tight" style={{ color: burgundy }}>{v.name}</h1>
          {v.tagline && <p className="mt-2 text-[13px]" style={{ color: '#8a5563' }}>{v.tagline}</p>}
          <div className="mt-2"><Floral color={roseGold} /></div>
        </div>

        <div className="mt-6 space-y-6">
          {v.sections.map((s) => (
            <div key={s.title}>
              <div className="flex items-center justify-center gap-3">
                <span className="h-px flex-1" style={{ background: roseGold, opacity: 0.4 }} />
                <h2 className="text-[12px] uppercase tracking-[0.3em]" style={{ color: burgundy }}>{s.title}</h2>
                <span className="h-px flex-1" style={{ background: roseGold, opacity: 0.4 }} />
              </div>
              <div className="mt-3 space-y-2">
                {s.items.map((it, i) => (
                  <div key={i} className="grid grid-cols-[150px_1fr] gap-3 text-[13px]">
                    <span style={{ color: roseGold }}>{it.label}</span>
                    <span style={{ color: ink }}>{it.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {v.about && (
            <div>
              <div className="flex items-center justify-center gap-3">
                <span className="h-px flex-1" style={{ background: roseGold, opacity: 0.4 }} />
                <h2 className="text-[12px] uppercase tracking-[0.3em]" style={{ color: burgundy }}>About</h2>
                <span className="h-px flex-1" style={{ background: roseGold, opacity: 0.4 }} />
              </div>
              <p className="mt-3 text-center text-[13px] italic leading-relaxed whitespace-pre-wrap">{v.about}</p>
            </div>
          )}
        </div>

        <div className="mt-8"><Floral color={roseGold} /></div>
      </div>
    </Page>
  )
}

/* ===============================================================
   TEMPLATE 5 — CLASSIC GREEN
   Ivory bg, dark green headings, gold borders, traditional-modern
================================================================*/
function ClassicGreen({ v }) {
  const green = '#1f4d2e'
  const gold = '#c2a24a'
  const ink = '#22301f'
  return (
    <Page style={{ background: '#f7f3e6', color: ink }} className="font-serif">
      <div className="p-3 h-full" style={{ border: `3px double ${gold}` }}>
        <div className="p-8 sm:p-10">
          <div className="text-center">
            <div
              className="mx-auto grid place-items-center rounded-full text-3xl"
              style={{ height: 100, width: 100, background: '#fff', color: green, border: `2px solid ${gold}` }}
            >
              {v.initial}
            </div>
            <h1 className="mt-4 text-4xl leading-tight" style={{ color: green }}>{v.name}</h1>
            {v.tagline && <p className="mt-2 text-[13px]" style={{ color: '#4a5c42' }}>{v.tagline}</p>}
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <span className="h-px w-16" style={{ background: gold }} />
              <span style={{ color: gold }}>&#10086;</span>
              <span className="h-px w-16" style={{ background: gold }} />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {v.sections.map((s) => (
              <div key={s.title}>
                <div
                  className="px-3 py-1.5 text-[12px] uppercase tracking-[0.28em]"
                  style={{ color: '#fff', background: green }}
                >
                  {s.title}
                </div>
                <div className="mt-3 space-y-2 px-1">
                  {s.items.map((it, i) => (
                    <div key={i} className="grid grid-cols-[150px_1fr] gap-3 text-[13px]">
                      <span style={{ color: green }}>{it.label}</span>
                      <span>{it.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {v.about && (
              <div>
                <div
                  className="px-3 py-1.5 text-[12px] uppercase tracking-[0.28em]"
                  style={{ color: '#fff', background: green }}
                >
                  About
                </div>
                <p className="mt-3 px-1 text-[13px] italic leading-relaxed whitespace-pre-wrap">{v.about}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ---------------------------------------------------------------
   Public component
----------------------------------------------------------------*/
const RENDERERS = {
  'Royal Maroon': RoyalMaroon,
  'Elegant Gold': ElegantGold,
  'Modern Navy': ModernNavy,
  'Rose Premium': RosePremium,
  'Classic Green': ClassicGreen,
}

export default function BiodataPreview({ data, design = 'Royal Maroon' }) {
  const v = buildView(data)
  const Renderer = RENDERERS[design] || RoyalMaroon
  return <Renderer v={v} />
}
