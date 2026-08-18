'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useBiodata } from '@/lib/biodata-store'
import {
  ArrowRight,
  User,
  Users,
  Phone,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react'

/* ---------- small building blocks ---------- */

function FieldLabel({ htmlFor, children, required, optional }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm text-foreground flex items-center gap-1.5">
      {children}
      {required && <span className="text-destructive">*</span>}
      {optional && (
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Optional</span>
      )}
    </Label>
  )
}

function Section({ icon: Icon, step, title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full border border-border bg-background grid place-items-center shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Section {step}</p>
          <h2 className="mt-1 font-serif text-2xl leading-tight">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}

/* ---------- custom fields UI ---------- */

function CustomFieldsBlock({ items, onChange, sectionLabel }) {
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')

  const addField = () => {
    const trimmed = label.trim()
    if (!trimmed) {
      toast.error('Please enter a field name.')
      return
    }
    const next = [
      ...items,
      { id: `cf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, label: trimmed, value: value.trim() },
    ]
    onChange(next)
    setLabel('')
    setValue('')
    setAdding(false)
    toast.success('Custom field added.')
  }

  const removeField = (id) => {
    onChange(items.filter((f) => f.id !== id))
  }

  const updateField = (id, patch) => {
    onChange(items.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  return (
    <div className="pt-1">
      {items.length > 0 && (
        <div className="space-y-4 mb-4">
          {items.map((f) => (
            <div
              key={f.id}
              className="rounded-lg border border-dashed border-border bg-secondary/30 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Custom field
                </span>
                <button
                  type="button"
                  onClick={() => removeField(f.id)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition"
                  aria-label="Remove custom field"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Field name</Label>
                  <Input
                    value={f.label}
                    onChange={(e) => updateField(f.id, { label: e.target.value })}
                    placeholder="e.g. Manglik, Blood Group, Hobbies"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Value</Label>
                  <Input
                    value={f.value}
                    onChange={(e) => updateField(f.id, { value: e.target.value })}
                    placeholder="Enter value"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Field name</Label>
            <Input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Manglik, Blood Group, Hobbies"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Value</Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addField()
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addField}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Add field
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false)
                setLabel('')
                setValue('')
              }}
              className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-secondary transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Add custom field to {sectionLabel}
        </button>
      )}
    </div>
  )
}

/* ---------- static options ---------- */

const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other']
const rashis = [
  'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
  'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)',
]

/* ---------- main page ---------- */

export default function GeneratorPage() {
  const router = useRouter()
  const { data, update, hydrated } = useBiodata()
  const [errors, setErrors] = useState({})

  const requiredFields = useMemo(() => ({
    fullName: 'Full Name',
    dob: 'Date of Birth',
    gender: 'Gender',
    height: 'Height',
    religion: 'Religion',
    caste: 'Caste / Community',
    rashi: 'Rashi',
    education: 'Education',
    profession: 'Profession',
    income: 'Income',
    fatherName: "Father's Name",
    fatherOccupation: "Father's Occupation",
    motherName: "Mother's Name",
    motherOccupation: "Mother's Occupation",
    brothers: 'Brothers',
    sisters: 'Sisters',
    familyLocation: 'Family Location',
    contactPerson: 'Contact Person',
    phone: 'Phone Number',
    email: 'Email',
    address: 'Address',
  }), [])

  const set = (key) => (e) => {
    const value = typeof e === 'string' ? e : e?.target?.value
    update({ [key]: value })
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!String(data[key] || '').trim()) nextErrors[key] = `${label} is required`
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      nextErrors.email = 'Enter a valid email'
    }
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please complete the required fields to continue.')
      const firstKey = Object.keys(nextErrors)[0]
      const el = document.getElementById(firstKey)
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    toast.success('Details saved. Choose your design next.')
    router.push('/design')
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteNav />
        <div className="container-narrow py-24 text-muted-foreground">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Header */}
        <section className="container-narrow pt-14 pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Step 1 of 3</span>
            <span className="h-px w-8 bg-border" />
            <span>Your details</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Tell us about you</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            Fill in the details below. Required fields are marked with an asterisk (
            <span className="text-destructive">*</span>). You can also add your own custom fields in any section.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="container-narrow pb-24 space-y-8 max-w-2xl" noValidate>
          {/* SECTION 1 — PERSONAL */}
          <Section
            icon={User}
            step="1"
            title="Personal Details"
            description="Basic information about you."
          >
            <div className="space-y-2">
              <FieldLabel htmlFor="fullName" required>Full Name</FieldLabel>
              <Input id="fullName" value={data.fullName} onChange={set('fullName')} placeholder="e.g. Aarav Sharma" aria-invalid={!!errors.fullName} />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="dob" required>Date of Birth</FieldLabel>
              <Input id="dob" type="date" value={data.dob} onChange={set('dob')} aria-invalid={!!errors.dob} />
              {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="timeOfBirth" optional>Time of Birth</FieldLabel>
              <Input id="timeOfBirth" type="time" value={data.timeOfBirth} onChange={set('timeOfBirth')} />
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="placeOfBirth" optional>Place of Birth</FieldLabel>
              <Input id="placeOfBirth" value={data.placeOfBirth} onChange={set('placeOfBirth')} placeholder="City, State" />
            </div>

            <div className="space-y-2">
              <FieldLabel required>Gender</FieldLabel>
              <RadioGroup
                value={data.gender}
                onValueChange={(v) => set('gender')(v)}
                className="flex flex-wrap gap-3"
                id="gender"
              >
                {['Male', 'Female', 'Other'].map((g) => (
                  <label
                    key={g}
                    htmlFor={`g-${g}`}
                    className={`flex items-center gap-2 rounded-md border px-4 py-2 cursor-pointer transition ${
                      data.gender === g
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-secondary'
                    }`}
                  >
                    <RadioGroupItem id={`g-${g}`} value={g} />
                    <span className="text-sm">{g}</span>
                  </label>
                ))}
              </RadioGroup>
              {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="height" required>Height</FieldLabel>
              <Input id="height" value={data.height} onChange={set('height')} placeholder={"e.g. 5'8\" or 173 cm"} aria-invalid={!!errors.height} />
              {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="religion" required>Religion</FieldLabel>
              <Select value={data.religion} onValueChange={(v) => set('religion')(v)}>
                <SelectTrigger id="religion" aria-invalid={!!errors.religion}>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  {religions.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
              {errors.religion && <p className="text-xs text-destructive">{errors.religion}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="caste" required>Caste / Community</FieldLabel>
              <Input id="caste" value={data.caste} onChange={set('caste')} placeholder="e.g. Brahmin, Sunni, Catholic" aria-invalid={!!errors.caste} />
              {errors.caste && <p className="text-xs text-destructive">{errors.caste}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="rashi" required>Rashi</FieldLabel>
              <Select value={data.rashi} onValueChange={(v) => set('rashi')(v)}>
                <SelectTrigger id="rashi" aria-invalid={!!errors.rashi}>
                  <SelectValue placeholder="Select rashi" />
                </SelectTrigger>
                <SelectContent>
                  {rashis.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
              {errors.rashi && <p className="text-xs text-destructive">{errors.rashi}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="nakshatra" optional>Nakshatra</FieldLabel>
              <Input id="nakshatra" value={data.nakshatra} onChange={set('nakshatra')} placeholder="e.g. Rohini" />
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="education" required>Education</FieldLabel>
              <Input id="education" value={data.education} onChange={set('education')} placeholder="e.g. M.Tech, IIT Bombay" aria-invalid={!!errors.education} />
              {errors.education && <p className="text-xs text-destructive">{errors.education}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="profession" required>Profession</FieldLabel>
              <Input id="profession" value={data.profession} onChange={set('profession')} placeholder="e.g. Software Engineer" aria-invalid={!!errors.profession} />
              {errors.profession && <p className="text-xs text-destructive">{errors.profession}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="income" required>Annual Income</FieldLabel>
              <Input id="income" value={data.income} onChange={set('income')} placeholder="e.g. ₹15 LPA" aria-invalid={!!errors.income} />
              {errors.income && <p className="text-xs text-destructive">{errors.income}</p>}
            </div>

            <CustomFieldsBlock
              items={data.customPersonal || []}
              onChange={(next) => update({ customPersonal: next })}
              sectionLabel="Personal Details"
            />
          </Section>

          {/* SECTION 2 — FAMILY */}
          <Section
            icon={Users}
            step="2"
            title="Family Details"
            description="A brief note on your family."
          >
            <div className="space-y-2">
              <FieldLabel htmlFor="fatherName" required>Father&apos;s Name</FieldLabel>
              <Input id="fatherName" value={data.fatherName} onChange={set('fatherName')} placeholder="e.g. Rajesh Sharma" aria-invalid={!!errors.fatherName} />
              {errors.fatherName && <p className="text-xs text-destructive">{errors.fatherName}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="fatherOccupation" required>Father&apos;s Occupation</FieldLabel>
              <Input id="fatherOccupation" value={data.fatherOccupation} onChange={set('fatherOccupation')} placeholder="e.g. Businessman" aria-invalid={!!errors.fatherOccupation} />
              {errors.fatherOccupation && <p className="text-xs text-destructive">{errors.fatherOccupation}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="motherName" required>Mother&apos;s Name</FieldLabel>
              <Input id="motherName" value={data.motherName} onChange={set('motherName')} placeholder="e.g. Sunita Sharma" aria-invalid={!!errors.motherName} />
              {errors.motherName && <p className="text-xs text-destructive">{errors.motherName}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="motherOccupation" required>Mother&apos;s Occupation</FieldLabel>
              <Input id="motherOccupation" value={data.motherOccupation} onChange={set('motherOccupation')} placeholder="e.g. Homemaker" aria-invalid={!!errors.motherOccupation} />
              {errors.motherOccupation && <p className="text-xs text-destructive">{errors.motherOccupation}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="brothers" required>Brothers</FieldLabel>
              <Input id="brothers" value={data.brothers} onChange={set('brothers')} placeholder="e.g. 1 (elder, married)" aria-invalid={!!errors.brothers} />
              {errors.brothers && <p className="text-xs text-destructive">{errors.brothers}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="sisters" required>Sisters</FieldLabel>
              <Input id="sisters" value={data.sisters} onChange={set('sisters')} placeholder="e.g. None" aria-invalid={!!errors.sisters} />
              {errors.sisters && <p className="text-xs text-destructive">{errors.sisters}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="familyLocation" required>Family Location</FieldLabel>
              <Input id="familyLocation" value={data.familyLocation} onChange={set('familyLocation')} placeholder="e.g. Pune, Maharashtra" aria-invalid={!!errors.familyLocation} />
              {errors.familyLocation && <p className="text-xs text-destructive">{errors.familyLocation}</p>}
            </div>

            <CustomFieldsBlock
              items={data.customFamily || []}
              onChange={(next) => update({ customFamily: next })}
              sectionLabel="Family Details"
            />
          </Section>

          {/* SECTION 3 — CONTACT */}
          <Section
            icon={Phone}
            step="3"
            title="Contact Details"
            description="How families can reach out to you."
          >
            <div className="space-y-2">
              <FieldLabel htmlFor="contactPerson" required>Contact Person</FieldLabel>
              <Input id="contactPerson" value={data.contactPerson} onChange={set('contactPerson')} placeholder="e.g. Father — Rajesh Sharma" aria-invalid={!!errors.contactPerson} />
              {errors.contactPerson && <p className="text-xs text-destructive">{errors.contactPerson}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="phone" required>Phone Number</FieldLabel>
              <Input id="phone" type="tel" value={data.phone} onChange={set('phone')} placeholder="e.g. +91 98765 43210" aria-invalid={!!errors.phone} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="email" required>Email</FieldLabel>
              <Input id="email" type="email" value={data.email} onChange={set('email')} placeholder="e.g. aarav@example.com" aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="address" required>Address</FieldLabel>
              <Textarea id="address" value={data.address} onChange={set('address')} placeholder="Full residential address" rows={3} aria-invalid={!!errors.address} />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="aboutMe" optional>
                <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> About Me</span>
              </FieldLabel>
              <Textarea
                id="aboutMe"
                value={data.aboutMe}
                onChange={set('aboutMe')}
                placeholder="A short, warm introduction — your interests, values, and what you're looking for."
                rows={6}
              />
              <p className="text-xs text-muted-foreground">A gentle personal note goes a long way. Keep it honest and warm.</p>
            </div>

            <CustomFieldsBlock
              items={data.customContact || []}
              onChange={(next) => update({ customContact: next })}
              sectionLabel="Contact Details"
            />
          </Section>

          {/* Autosave note + Submit */}
          <div className="rounded-xl border border-border bg-secondary/40 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Your progress is saved automatically on this device.
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary transition"
              >
                Back to Home
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                Continue to Design <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </main>

      <SiteFooter />
    </div>
  )
}
