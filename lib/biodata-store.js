'use client'

import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'biodatacraft:data'

export const emptyBiodata = {
  // Personal
  fullName: '',
  dob: '',
  timeOfBirth: '',
  placeOfBirth: '',
  gender: '',
  height: '',
  religion: '',
  caste: '',
  rashi: '',
  nakshatra: '',
  education: '',
  profession: '',
  income: '',
  // Family
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  brothers: '',
  sisters: '',
  familyLocation: '',
  // Contact
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  aboutMe: '',
  // Meta
  template: 'Royal Maroon',
}

export function useBiodata() {
  const [data, setData] = useState(emptyBiodata)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setData({ ...emptyBiodata, ...parsed })
      }
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

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setData(emptyBiodata)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {}
  }, [])

  return { data, update, reset, hydrated }
}
