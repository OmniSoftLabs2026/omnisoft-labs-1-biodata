'use client'

export const templates = {
  'Royal Maroon': {
    bg: '#fdf6f5',
    ink: '#3a1218',
    accent: '#7a1f2b',
    accentSoft: 'rgba(122, 31, 43, 0.10)',
    rule: '#7a1f2b',
    monogram: 'श',
  },
  'Elegant Gold': {
    bg: '#fbf6ea',
    ink: '#3a2e12',
    accent: '#b7902f',
    accentSoft: 'rgba(183, 144, 47, 0.14)',
    rule: '#b7902f',
    monogram: 'ॐ',
  },
  'Modern Navy': {
    bg: '#f2f5fb',
    ink: '#0f1a33',
    accent: '#1e3a6b',
    accentSoft: 'rgba(30, 58, 107, 0.10)',
    rule: '#1e3a6b',
    monogram: 'आ',
  },
  'Rose Premium': {
    bg: '#fdf3f4',
    ink: '#40121e',
    accent: '#c34766',
    accentSoft: 'rgba(195, 71, 102, 0.10)',
    rule: '#c34766',
    monogram: '❁',
  },
  'Classic Green': {
    bg: '#f2f7f2',
    ink: '#122318',
    accent: '#2f5d3b',
    accentSoft: 'rgba(47, 93, 59, 0.10)',
    rule: '#2f5d3b',
    monogram: '卐',
  },
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

function Row({ label, value, accent }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 py-1.5">
      <span className="text-[12px] uppercase tracking-[0.14em]" style={{ color: accent }}>{label}</span>
      <span className="text-[13px] leading-snug">{value}</span>
    </div>
  )
}

function SectionTitle({ title, accent, rule }) {
  return (
    <div className="mt-5 mb-2">
      <div className="flex items-center gap-3">
        <span className="font-serif text-[15px] tracking-[0.28em] uppercase" style={{ color: accent }}>
          {title}
        </span>
        <span className="flex-1 h-px" style={{ background: rule, opacity: 0.35 }} />
      </div>
    </div>
  )
}

/**
 * Full biodata preview. Renders every provided field including custom fields.
 * Designed to feel document-like: white/beige page, thin rules, refined typography.
 */
export default function BiodataPreview({ data, design = 'Royal Maroon' }) {
  const t = templates[design] || templates['Royal Maroon']

  return (
    <div
      className="rounded-lg border border-border shadow-sm mx-auto w-full"
      style={{
        background: t.bg,
        color: t.ink,
        maxWidth: '640px',
      }}
    >
      <div className="p-8 sm:p-10 flex flex-col">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full grid place-items-center font-serif text-lg" style={{ background: t.accent, color: '#fff' }}>
            {t.monogram}
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: t.accent }}>
            Marriage Biodata
          </p>
          <div className="mx-auto my-3 h-px w-24" style={{ background: t.rule, opacity: 0.5 }} />
          <h1 className="font-serif text-3xl leading-tight">{data.fullName || 'Your Name'}</h1>
          <p className="mt-1 text-[12px]" style={{ color: t.accent }}>
            {[data.profession, data.education].filter(Boolean).join(' · ') || 'Profession · Education'}
          </p>
        </div>

        {/* Body */}
        <div className="mt-4 text-[13px]">
          <SectionTitle title="Personal" accent={t.accent} rule={t.rule} />
          <Row label="Date of Birth" value={formatDate(data.dob)} accent={t.accent} />
          <Row label="Time of Birth" value={data.timeOfBirth} accent={t.accent} />
          <Row label="Place of Birth" value={data.placeOfBirth} accent={t.accent} />
          <Row label="Gender" value={data.gender} accent={t.accent} />
          <Row label="Height" value={data.height} accent={t.accent} />
          <Row label="Religion" value={[data.religion, data.caste].filter(Boolean).join(' · ')} accent={t.accent} />
          <Row label="Rashi" value={data.rashi} accent={t.accent} />
          <Row label="Nakshatra" value={data.nakshatra} accent={t.accent} />
          <Row label="Education" value={data.education} accent={t.accent} />
          <Row label="Profession" value={data.profession} accent={t.accent} />
          <Row label="Income" value={data.income} accent={t.accent} />
          {(data.customPersonal || []).map((f) => (
            <Row key={f.id} label={f.label} value={f.value} accent={t.accent} />
          ))}

          {(data.fatherName || data.motherName || data.familyLocation || (data.customFamily || []).length > 0) && (
            <>
              <SectionTitle title="Family" accent={t.accent} rule={t.rule} />
              <Row label="Father" value={[data.fatherName, data.fatherOccupation].filter(Boolean).join(' · ')} accent={t.accent} />
              <Row label="Mother" value={[data.motherName, data.motherOccupation].filter(Boolean).join(' · ')} accent={t.accent} />
              <Row label="Brothers" value={data.brothers} accent={t.accent} />
              <Row label="Sisters" value={data.sisters} accent={t.accent} />
              <Row label="Native" value={data.familyLocation} accent={t.accent} />
              {(data.customFamily || []).map((f) => (
                <Row key={f.id} label={f.label} value={f.value} accent={t.accent} />
              ))}
            </>
          )}

          {(data.contactPerson || data.phone || data.email || data.address || (data.customContact || []).length > 0) && (
            <>
              <SectionTitle title="Contact" accent={t.accent} rule={t.rule} />
              <Row label="Contact" value={data.contactPerson} accent={t.accent} />
              <Row label="Phone" value={data.phone} accent={t.accent} />
              <Row label="Email" value={data.email} accent={t.accent} />
              <Row label="Address" value={data.address} accent={t.accent} />
              {(data.customContact || []).map((f) => (
                <Row key={f.id} label={f.label} value={f.value} accent={t.accent} />
              ))}
            </>
          )}

          {data.aboutMe && (
            <>
              <SectionTitle title="About Me" accent={t.accent} rule={t.rule} />
              <p className="text-[12.5px] leading-relaxed italic whitespace-pre-wrap">
                {data.aboutMe}
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4">
          <div className="mx-auto mb-2 h-px w-24" style={{ background: t.rule, opacity: 0.5 }} />
          <p className="text-center text-[10px] uppercase tracking-[0.4em]" style={{ color: t.accent }}>
            — With warm regards —
          </p>
        </div>
      </div>
    </div>
  )
}
