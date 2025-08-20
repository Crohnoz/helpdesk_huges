// src/components/TopBar.jsx — shows org + branch + env badge
import React from 'react'

export default function TopBar({ settings }) {
  const branch = settings?.branch ? ` · ${settings.branch}` : ''
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-2xl bg-black text-white grid place-items-center text-lg font-bold">HH</span>
          <div className="leading-tight">
            <h1 className="text-base md:text-lg font-bold">
              {settings?.orgName || 'Hughes Helper'}
              <span className="text-neutral-400 font-medium">{branch}</span>
            </h1>
            <p className="text-xs text-neutral-500">Hughes Helper — ultra simple desk tools</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <EnvBadge />
          <div className="hidden sm:block text-xs md:text-sm text-neutral-600">
            Signed in as <b>{settings?.userName || 'User'}</b>
          </div>
        </div>
      </div>
    </header>
  )
}

function EnvBadge(){
  if (import.meta.env.PROD) {
    return <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Live</span>
  }
  return <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Dev</span>
}
