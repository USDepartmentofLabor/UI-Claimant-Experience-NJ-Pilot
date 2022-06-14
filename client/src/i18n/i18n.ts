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

const namespaces = ['home'] as const

i18n.use(LanguageDetector).use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: namespaces,
  defaultNS,
  resources,
})
