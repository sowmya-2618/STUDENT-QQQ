/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react'

// Telugu tarvata add chestam. Ippudu English matrame.
const Ctx = createContext(true)

export function LangProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={true}>{children}</Ctx.Provider>
}

export function useLang() {
  return useContext(Ctx)
}

// Paata files lo `useT` import unte build fail avvakunda, simple fallback.
export function useT() {
  return { t: (k: string) => k, lang: 'en' as const }
}