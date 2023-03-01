import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './en'
import es from './es'

export const defaultNS = 'home'
export const resources = {
  en,
  es,
} as const

const namespaces = [
  'home',
  'common',
  'claimForm',
  'whoAmI',
  'redirect',
  'screener',
  'privacy',
  'ssn',
  'betaSuccess',
] as const

i18n.use(LanguageDetector).use(initReactI18next).init({
  lng: 'en', // Remove this line to enable language detection.
  fallbackLng: 'en',
  ns: namespaces,
  defaultNS,
  resources,
})

export const i18n_home = i18n

export const i18n_common = i18n.cloneInstance({
  defaultNS: 'common',
})

export const i18n_claimForm = i18n.cloneInstance({
  defaultNS: 'claimForm',
})

export const i18n_screener = i18n.cloneInstance({
  defaultNS: 'screener',
})

export const i18n_privacy = i18n.cloneInstance({
  defaultNS: 'privacy',
})

export const i18n_ssn = i18n.cloneInstance({
  defaultNS: 'ssn',
})
export const i18n_betaSuccess = i18n.cloneInstance({
  defaultNS: 'betaSuccess',
})
