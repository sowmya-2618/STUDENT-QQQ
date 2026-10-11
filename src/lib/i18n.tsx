/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'te'

const en = {
  brand: 'StudentIQ',
  nav_dashboard: 'Dashboard',
  nav_students: 'Students',
  nav_talent: 'Hidden Talent',
  nav_opportunities: 'Opportunities',
  nav_action: 'Action Plan',
  nav_simulator: 'What-If',
  nav_reports: 'Reports',
  nav_upload: 'Upload CSV',
  language: 'Language',
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
  reports_title: 'Reports',
  download_csv: 'Download CSV',
  print_report: 'Print report',
  all: 'All',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export type TKey = keyof typeof en

// Telugu lo en keys anni undali, lekapote TypeScript error chupistundi
const te: Record<TKey, string> = {
  brand: 'StudentIQ',
  nav_dashboard: 'డాష్‌బోర్డ్',
  nav_students: 'విద్యార్థులు',
  nav_talent: 'దాగిన ప్రతిభ',
  nav_opportunities: 'అవకాశాలు',
  nav_action: 'కార్యాచరణ ప్రణాళిక',
  nav_simulator: 'ఏమైతే-అయితే',
  nav_reports: 'నివేదికలు',
  nav_upload: 'CSV అప్‌లోడ్',
  language: 'భాష',