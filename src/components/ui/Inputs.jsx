// src/components/ui/Inputs.jsx — robust inputs set
import React from 'react'

/** Utility to join class names */
export function classNames(...xs) { return xs.filter(Boolean).join(' ') }

/** Normalize options: accepts ["A","B"] or [{value:"A", label:"Alpha"}] */
function normalizeOptions(options = []) {
  return options.map(o => (typeof o === 'string' ? { value: o, label: o } : o))
}

export function Text({
  label,
  value = '',
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  disabled = false,
  autoComplete,
  inputMode,
}) {
  return (
    <label className="grid gap-1">
      {label && (
        <span className="text-xs font-medium text-neutral-600">
          {label}{required && <span className="text-rose-600"> *</span>}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="h-11 rounded-2xl border border-neutral-200 px-4 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </label>
  )
}

export function Number({ label, value, onChange, placeholder = '', required = false, disabled = false, min, max, step }) {
  function handle(e) {
    const raw = e.target.value
    // Keep empty string as empty, otherwise parse int
    if (raw === '') return onChange?.(0)
    const n = parseInt(raw, 10)
    onChange?.(Number.isNaN(n) ? 0 : n)
  }
  return (
    <label className="grid gap-1">
      {label && (
        <span className="text-xs font-medium text-neutral-600">
          {label}{required && <span className="text-rose-600"> *</span>}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={handle}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="h-11 rounded-2xl border border-neutral-200 px-4 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </label>
  )
}

export function Select({ label, value, onChange, options = [], required = false, disabled = false }) {
  const opts = normalizeOptions(options)
  return (
    <label className="grid gap-1">
      {label && (
        <span className="text-xs font-medium text-neutral-600">
          {label}{required && <span className="text-rose-600"> *</span>}
        </span>
      )}
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        className="h-11 rounded-2xl border border-neutral-200 px-4 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {opts.map(o => (
          <option key={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

export function SelectSmall({ label, value, onChange, options = [], required = false, disabled = false }) {
  const opts = normalizeOptions(options)
  return (
    <label className="grid gap-1 text-xs">
      {label && (
        <span className="text-[10px] font-medium text-neutral-600">
          {label}{required && <span className="text-rose-600"> *</span>}
        </span>
      )}
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        className="h-11 rounded-2xl border border-neutral-200 px-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-xs disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {opts.map(o => (
          <option key={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

export function TextArea({ label, value = '', onChange, rows = 4, placeholder = '', required = false, disabled = false, maxLength }) {
  return (
    <label className="grid gap-1">
      {label && (
        <span className="text-xs font-medium text-neutral-600">
          {label}{required && <span className="text-rose-600"> *</span>}
        </span>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className="rounded-2xl border border-neutral-200 px-4 py-2 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black resize-y min-h-[2.75rem] disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </label>
  )
}
