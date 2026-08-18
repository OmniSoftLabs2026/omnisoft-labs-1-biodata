'use client'

import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'biodatacraft:data'

export const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other']
export const rashis = [
  'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
  'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)',
]

export const uid = (p = 'cf') => `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

/* Build the default ordered field lists for each section. */
export function defaultSections() {
  return {
    personal: [
      { id: 'fullName', label: 'Full Name', type: 'text', value: '', required: true, placeholder: 'e.g. Aarav Sharma' },
      { id: 'dob', label: 'Date of Birth', type: 'date', value: '', required: true },
      { id: 'timeOfBirth', label: 'Time of Birth', type: 'time', value: '' },
      { id: 'placeOfBirth', label: 'Place of Birth', type: 'text', value: '', placeholder: 'City, State' },
      { id: 'gender', label: 'Gender', type: 'radio', value: '', required: true, options: ['Male', 'Female', 'Other'] },
      { id: 'height', label: 'Height', type: 'text', value: '', required: true, placeholder: `e.g. 5'8\" or 173 cm` },
      { id: 'religion', label: 'Religion', type: 'select', value: '', required: true, options: religions },
      { id: 'caste', label: 'Caste / Community', type: 'text', value: '', required: true, placeholder: 'e.g. Brahmin, Sunni, Catholic' },
      { id: 'rashi', label: 'Rashi', type: 'select', value: '', required: true, options: rashis },
      { id: 'nakshatra', label: 'Nakshatra', type: 'text', value: '', placeholder: 'e.g. Rohini' },
      { id: 'education', label: 'Education', type: 'text', value: '', required: true, placeholder: 'e.g. M.Tech, IIT Bombay' },
      { id: 'profession', label: 'Profession', type: 'text', value: '', required: true, placeholder: 'e.g. Software Engineer' },
      { id: 'income', label: 'Annual Income', type: 'text', value: '', required: true, placeholder: 'e.g. ₹15 LPA' },
    ],
    family: [
      { id: 'fatherName', label: "Father's Name", type: 'text', value: '', required: true, placeholder: 'e.g. Rajesh Sharma' },
      { id: 'fatherOccupation', label: "Father's Occupation", type: 'text', value: '', required: true, placeholder: 'e.g. Businessman' },
      { id: 'motherName', label: "Mother's Name", type: 'text', value: '', required: true, placeholder: 'e.g. Sunita Sharma' },
      { id: 'motherOccupation', label: "Mother's Occupation", type: 'text', value: '', required: true, placeholder: 'e.g. Homemaker' },
      { id: 'brothers', label: 'Brothers', type: 'text', value: '', required: true, placeholder: 'e.g. 1 (elder, married)' },
      { id: 'sisters', label: 'Sisters', type: 'text', value: '', required: true, placeholder: 'e.g. None' },
      { id: 'familyLocation', label: 'Family Location', type: 'text', value: '', required: true, placeholder: 'e.g. Pune, Maharashtra' },
    ],
    contact: [
      { id: 'contactPerson', label: 'Contact Person', type: 'text', value: '', required: true, placeholder: 'e.g. Father — Rajesh Sharma' },
      { id: 'phone', label: 'Phone Number', type: 'tel', value: '', required: true, placeholder: 'e.g. +91 98765 43210' },
      { id: 'email', label: 'Email', type: 'email', value: '', required: true, placeholder: 'e.g. aarav@example.com' },
      { id: 'address', label: 'Address', type: 'textarea', value: '', required: true, rows: 3, placeholder: 'Full residential address' },
      { id: 'aboutMe', label: 'About Me', type: 'textarea', value: '', rows: 6, placeholder: "A short, warm introduction — your interests, values, and what you're looking for." },
    ],
  }
}

export function emptyBiodata() {
  return { ...defaultSections(), template: 'Royal Maroon' }
}

/* Migrate the older flat data shape (v1) into the new ordered-field shape. */
function migrate(parsed) {
  if (!parsed || typeof parsed !== 'object') return emptyBiodata()

  // Already new shape
  if (Array.isArray(parsed.personal) && Array.isArray(parsed.family) && Array.isArray(parsed.contact)) {
    return {
      personal: parsed.personal,
      family: parsed.family,
      contact: parsed.contact,
      template: parsed.template || 'Royal Maroon',
    }
  }

  // Old flat shape -> map values into defaults, then append custom fields
  const base = defaultSections()
  const applyValues = (fields) =>
    fields.map((f) => (parsed[f.id] !== undefined ? { ...f, value: parsed[f.id] } : f))

  base.personal = applyValues(base.personal)
  base.family = applyValues(base.family)
  base.contact = applyValues(base.contact)

  const asCustom = (arr) =>
    (Array.isArray(arr) ? arr : []).map((c) => ({
      id: c.id || uid(),
      label: c.label || 'Custom Field',
      type: 'text',
      value: c.value || '',
      custom: true,
    }))

  base.personal = [...base.personal, ...asCustom(parsed.customPersonal)]
  base.family = [...base.family, ...asCustom(parsed.customFamily)]
  base.contact = [...base.contact, ...asCustom(parsed.customContact)]

  return { ...base, template: parsed.template || 'Royal Maroon' }
}

export function useBiodata() {
  const [data, setData] = useState(emptyBiodata)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setData(migrate(JSON.parse(raw)))
    } catch (e) {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      // ignore
    }
  }, [data, hydrated])

  const updateField = useCallback((section, id, patch) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }))
  }, [])

  const addField = useCallback((section, field) => {
    const newField = {
      id: uid(),
      label: field?.label || 'New Field',
      type: field?.type || 'text',
      value: field?.value || '',
      placeholder: field?.placeholder || 'Enter value',
      custom: true,
    }
    setData((prev) => ({ ...prev, [section]: [...(prev[section] || []), newField] }))
    return newField.id
  }, [])

  const removeField = useCallback((section, id) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((f) => f.id !== id),
    }))
  }, [])

  const reorder = useCallback((section, from, to) => {
    setData((prev) => {
      const list = [...(prev[section] || [])]
      if (from < 0 || from >= list.length || to < 0 || to >= list.length) return prev
      const [moved] = list.splice(from, 1)
      list.splice(to, 0, moved)
      return { ...prev, [section]: list }
    })
  }, [])

  const setTemplate = useCallback((name) => {
    setData((prev) => ({ ...prev, template: name }))
  }, [])

  const reset = useCallback(() => {
    setData(emptyBiodata())
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {}
  }, [])

  return { data, hydrated, updateField, addField, removeField, reorder, setTemplate, reset }
}
