import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'te'

const dict = {
  en: {
    brand: 'StudentIQ',
    nav_dashboard: 'Dashboard',
    nav_students: 'Students',
    nav_talent: 'Hidden Talent',
    nav_opportunities: 'Opportunities',
    nav_action: 'Action Plan',
    nav_simulator: 'What-If',
    nav_upload: 'Upload CSV',
    sample_note: 'Sample data: fictional students',
    dash_title: 'StudentIQ Dashboard',
    department: 'Department',
    academic_risk: 'Academic risk',
    total_students: 'Total students',
    avg_score: 'Avg Success Score',
    need_support: 'Need academic support',
    att_concerns: 'Attendance concerns (<75%)',
    placement_risk: 'Placement risk',
    hidden_talent: 'Hidden talent',
    students_title: 'Students',
    search_ph: 'Search by name or ID',
    all: 'All',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
  te: {
    brand: 'StudentIQ',
    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_students: 'విద్యార్థులు',
    nav_talent: 'దాగిన ప్రతిభ',
    nav_opportunities: 'అవకాశాలు',
    nav_action: 'కార్యాచరణ ప్రణాళిక',
    nav_simulator: 'ఏమైతే-అయితే',
    nav_upload: 'CSV అప్‌లోడ్',
    sample_note: 'నమూనా డేటా: కల్పిత విద్యార్థులు',
    dash_title: 'StudentIQ డాష్‌బోర్డ్',
    department: 'విభాగం',
    academic_risk: 'విద్యా ప్రమాదం',
    total_students: 'మొత్తం విద్యార్థులు',
    avg_score: 'సగటు విజయ స్కోరు',
    need_support: 'విద్యా సహాయం అవసరం',
    att_concerns: 'హాజరు సమస్యలు (<75%)',
    placement_risk: 'ప్లేస్‌మెంట్ ప్రమాదం',
    hidden_talent: 'దాగిన ప్రతిభ',
    students_title: 'విద్యార్థులు',
    search_ph: 'పేరు లేదా ID తో వెతకండి',
    all: 'అన్నీ',
    high: 'అధికం',
    medium: 'మధ్యస్థం',
    low: 'తక్కువ',
  },
} as const

export type TKey = keyof (typeof dict)['en']

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }
const I18n = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (k: TKey): string => dict[lang][k] ?? dict.en[k]
  return <I18n.Provider value={{ lang, setLang, t }}>{children}</I18n.Provider>
}

export function useT(): Ctx {
  const c = useContext(I18n)
  if (!c) throw new Error('useT must be used inside LangProvider')
  return c
}