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
} from 'lucide-react'

/* ---------- small building blocks ---------- */

function FieldLabel({ htmlFor, children, required, optional }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm text-foreground flex items-center gap-1.5">
      {children}
      {required && <span className="text-destructive">*</span>}
      {optional && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Optional</span>}
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
        {children}
      </div>
    </section>
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
            <span className="text-destructive">*</span>). Your information is saved automatically as you type.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="container-narrow pb-24 space-y-8" noValidate>
          {/* SECTION 1 — PERSONAL */}
          <Section
            icon={User}
            step="1"
            title="Personal Details"
            description="Basic information about you."
          >
            {/* Full Name */}
            <div className="sm:col-span-2 space-y-2">
              <FieldLabel htmlFor="fullName" required>Full Name</FieldLabel>
              <Input
                id="fullName"
                value={data.fullName}
                onChange={set('fullName')}
                placeholder="e.g. Aarav Sharma"
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <FieldLabel htmlFor="dob" required>Date of Birth</FieldLabel>
              <Input id="dob" type="date" value={data.dob} onChange={set('dob')} aria-invalid={!!errors.dob} />
              {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
            </div>

            {/* Time of Birth */}
            <div className="space-y-2">
              <FieldLabel htmlFor="timeOfBirth" optional>Time of Birth</FieldLabel>
              <Input id="timeOfBirth" type="time" value={data.timeOfBirth} onChange={set('timeOfBirth')} />
            </div>

            {/* Place of Birth */}
            <div className="sm:col-span-2 space-y-2">
              <FieldLabel htmlFor="placeOfBirth" optional>Place of Birth</FieldLabel>
              <Input
                id="placeOfBirth"
                value={data.placeOfBirth}
                onChange={set('placeOfBirth')}
                placeholder="City, State"
              />
            </div>

            {/* Gender */}
            <div className="sm:col-span-2 space-y-2">
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

            {/* Height */}
            <div className="space-y-2">
              <FieldLabel htmlFor="height" required>Height</FieldLabel>
              <Input
                id="height"
                value={data.height}
                onChange={set('height')}
                placeholder={"e.g. 5'8\" or 173 cm"}
                aria-invalid={!!errors.height}
              />
              {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
            </div>

            {/* Religion */}
            <div className="space-y-2">
              <FieldLabel htmlFor="religion" required>Religion</FieldLabel>
              <Select value={data.religion} onValueChange={(v) => set('religion')(v)}>
                <SelectTrigger id="religion" aria-invalid={!!errors.religion}>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  {religions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.religion && <p className="text-xs text-destructive">{errors.religion}</p>}
            </div>

            {/* Caste */}
            <div className="space-y-2">
              <FieldLabel htmlFor="caste" required>Caste / Community</FieldLabel>
              <Input
                id="caste"
                value={data.caste}
                onChange={set('caste')}
                placeholder="e.g. Brahmin, Sunni, Catholic"
                aria-invalid={!!errors.caste}
              />
              {errors.caste && <p className="text-xs text-destructive">{errors.caste}</p>}
            </div>

            {/* Rashi */}
            <div className="space-y-2">
              <FieldLabel htmlFor="rashi" required>Rashi</FieldLabel>
              <Select value={data.rashi} onValueChange={(v) => set('rashi')(v)}>
                <SelectTrigger id="rashi" aria-invalid={!!errors.rashi}>
                  <SelectValue placeholder="Select rashi" />
                </SelectTrigger>
                <SelectContent>
                  {rashis.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rashi && <p className="text-xs text-destructive">{errors.rashi}</p>}
            </div>

            {/* Nakshatra */}
            <div className="space-y-2">
              <FieldLabel htmlFor="nakshatra" optional>Nakshatra</FieldLabel>
              <Input
                id="nakshatra"
                value={data.nakshatra}
                onChange={set('nakshatra')}
                placeholder="e.g. Rohini"
              />
            </div>

            {/* Education */}
            <div className="sm:col-span-2 space-y-2">
              <FieldLabel htmlFor="education" required>Education</FieldLabel>
              <Input
                id="education"
                value={data.education}
                onChange={set('education')}
                placeholder="e.g. M.Tech, IIT Bombay"
                aria-invalid={!!errors.education}
              />
              {errors.education && <p className="text-xs text-destructive">{errors.education}</p>}
            </div>

            {/* Profession */}
            <div className="space-y-2">
              <FieldLabel htmlFor="profession" required>Profession</FieldLabel>
              <Input
                id="profession"
                value={data.profession}
                onChange={set('profession')}
                placeholder="e.g. Software Engineer"
                aria-invalid={!!errors.profession}
              />
              {errors.profession && <p className="text-xs text-destructive">{errors.profession}</p>}
            </div>

            {/* Income */}
            <div className="space-y-2">
              <FieldLabel htmlFor="income" required>Annual Income</FieldLabel>
              <Input
                id="income"
                value={data.income}
                onChange={set('income')}
                placeholder="e.g. ₹15 LPA"
                aria-invalid={!!errors.income}
              />
              {errors.income && <p className="text-xs text-destructive">{errors.income}</p>}
            </div>
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

            <div className="sm:col-span-2 space-y-2">
              <FieldLabel htmlFor="familyLocation" required>Family Location</FieldLabel>
              <Input id="familyLocation" value={data.familyLocation} onChange={set('familyLocation')} placeholder="e.g. Pune, Maharashtra" aria-invalid={!!errors.familyLocation} />
              {errors.familyLocation && <p className="text-xs text-destructive">{errors.familyLocation}</p>}
            </div>
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

            <div className="sm:col-span-2 space-y-2">
              <FieldLabel htmlFor="email" required>Email</FieldLabel>
              <Input id="email" type="email" value={data.email} onChange={set('email')} placeholder="e.g. aarav@example.com" aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2 space-y-2">
              <FieldLabel htmlFor="address" required>Address</FieldLabel>
              <Textarea
                id="address"
                value={data.address}
                onChange={set('address')}
                placeholder="Full residential address"
                rows={3}
                aria-invalid={!!errors.address}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            <div className="sm:col-span-2 space-y-2">
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
