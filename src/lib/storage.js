import React from 'react'
export const uid = (p='id') => `${p}_${Math.random().toString(36).slice(2,9)}`
export function readLS(key, fallback){
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
export function writeLS(key, val){ try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }
export function useLocalState(key, initial){
  const [state, setState] = React.useState(() => readLS(key, initial))
  React.useEffect(()=>{ writeLS(key, state) }, [key, state])
  return [state, setState]
}
