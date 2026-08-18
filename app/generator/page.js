'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useRef } from 'react'
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
  GripVertical,
} from 'lucide-react'

/* ---------- section shell ---------- */

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
      <div className="mt-6">{children}</div>
    </section>
  )
}

/* ---------- control renderer ---------- */

function FieldControl({ field, onChange, invalid }) {
  const { id, type, value, placeholder, options, rows } = field

  if (type === 'textarea') {
    return (
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows || 3}
        aria-invalid={invalid}
      />
    )
  }

  if (type === 'select') {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-invalid={invalid}>
          <SelectValue placeholder={placeholder || `Select ${field.label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {(options || []).map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (type === 'radio') {
    return (
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-3" id={id}>
        {(options || []).map((o) => (
          <label
            key={o}
            htmlFor={`${id}-${o}`}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 cursor-pointer transition ${
              value === o ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary'
            }`}
          >
            <RadioGroupItem id={`${id}-${o}`} value={o} />
            <span className="text-sm">{o}</span>
          </label>
        ))}
      </RadioGroup>
    )
  }

  return (
    <Input
      id={id}
      type={type === 'date' || type === 'time' || type === 'tel' || type === 'email' ? type : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-invalid={invalid}
    />
  )
}

/* ---------- draggable field row ---------- */

function FieldRow({
  field,
  index,
  error,
  isDragging,
  isOver,
  onChange,
  onLabelChange,
  onRemove,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => onDragEnter(index)}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(index)
      }}
      className={`rounded-lg border bg-background p-3 sm:p-4 flex items-start gap-2 transition ${
        isDragging ? 'opacity-40' : ''
      } ${isOver ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
    >
      {/* drag handle (desktop) */}
      <span
        draggable
        onDragStart={() => onDragStart(index)}
        onDragEnd={onDragEnd}
        title="Drag to reorder"
        className="mt-2 hidden sm:flex cursor-grab active:cursor-grabbing text-muted-foreground/70 hover:text-foreground shrink-0 select-none"
      >
        <GripVertical className="h-4 w-4" />
      </span>

      <div className="flex-1 min-w-0 space-y-2">
        {field.custom ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">Custom</span>
            <Input
              value={field.label}
              onChange={(e) => onLabelChange(e.target.value)}
              placeholder="Field name"
              className="h-8 text-xs font-medium"
            />
          </div>
        ) : (
          <Label htmlFor={field.id} className="text-sm text-foreground flex items-center gap-1.5">
            {field.label}
            {field.required ? (
              <span className="text-destructive">*</span>
            ) : (
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Optional</span>
            )}
          </Label>
        )}

        <FieldControl field={field} onChange={onChange} invalid={!!error} />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {/* delete on the right */}
      <button
        type="button"
        onClick={onRemove}
        title="Delete field"
        aria-label="Delete field"
        className="mt-1.5 shrink-0 grid place-items-center h-8 w-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ---------- one section of the form ---------- */

function SectionForm({ icon, step, title, description, sectionKey, fields, errors, actions }) {
  const dragFrom = useRef(null)
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const handleDrop = (to) => {
    const from = dragFrom.current
    if (from !== null && from !== to) actions.reorder(sectionKey, from, to)
    dragFrom.current = null
    setDraggingIndex(null)
    setOverIndex(null)
  }

  const addCustom = () => {
    actions.addField(sectionKey, { label: '', placeholder: 'Enter value' })
    toast.success('Custom field added — name it and drag to position.')
  }

  return (
    <Section icon={icon} step={step} title={title} description={description}>
      <div className="space-y-3">
        {fields.map((f, i) => (
          <FieldRow
            key={f.id}
            field={f}
            index={i}
            error={errors[f.id]}
            isDragging={draggingIndex === i}
            isOver={overIndex === i && draggingIndex !== i}
            onChange={(val) => actions.updateField(sectionKey, f.id, { value: val })}
            onLabelChange={(label) => actions.updateField(sectionKey, f.id, { label })}
            onRemove={() => {
              actions.removeField(sectionKey, f.id)
              toast('Field removed', { description: f.label || 'Custom field' })
            }}
            onDragStart={(idx) => {
              dragFrom.current = idx
              setDraggingIndex(idx)
            }}
            onDragEnter={(idx) => setOverIndex(idx)}
            onDragEnd={() => {
              dragFrom.current = null
              setDraggingIndex(null)
              setOverIndex(null)
            }}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addCustom}
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition w-full sm:w-auto justify-center"
      >
        <Plus className="h-4 w-4" /> Add custom field to {title}
      </button>
    </Section>
  )
}

/* ---------- main page ---------- */

export default function GeneratorPage() {
  const router = useRouter()
  const { data, hydrated, updateField, addField, removeField, reorder } = useBiodata()
  const [errors, setErrors] = useState({})

  const actions = useMemo(
    () => ({ updateField, addField, removeField, reorder }),
    [updateField, addField, removeField, reorder]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    const allFields = [...(data.personal || []), ...(data.family || []), ...(data.contact || [])]

    for (const f of allFields) {
      if (f.required && !String(f.value || '').trim()) {
        nextErrors[f.id] = `${f.label || 'This field'} is required`
      }
      if (f.id === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
        nextErrors.email = 'Enter a valid email'
      }
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
        <section className="container-narrow pt-14 pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Step 1 of 3</span>
            <span className="h-px w-8 bg-border" />
            <span>Your details</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Tell us about you</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            Fill in the details below. Drag the{' '}
            <GripVertical className="inline h-3.5 w-3.5 align-text-bottom" /> handle to reorder any field, and use the{' '}
            <Trash2 className="inline h-3.5 w-3.5 align-text-bottom" /> icon to remove fields you don't need. Required fields are marked with an asterisk (
            <span className="text-destructive">*</span>).
          </p>
        </section>

        <form onSubmit={handleSubmit} className="container-narrow pb-24 space-y-8 max-w-2xl" noValidate>
          <SectionForm
            icon={User}
            step="1"
            title="Personal Details"
            description="Basic information about you."
            sectionKey="personal"
            fields={data.personal || []}
            errors={errors}
            actions={actions}
          />

          <SectionForm
            icon={Users}
            step="2"
            title="Family Details"
            description="A brief note on your family."
            sectionKey="family"
            fields={data.family || []}
            errors={errors}
            actions={actions}
          />

          <SectionForm
            icon={Phone}
            step="3"
            title="Contact Details"
            description="How families can reach out to you."
            sectionKey="contact"
            fields={data.contact || []}
            errors={errors}
            actions={actions}
          />

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
