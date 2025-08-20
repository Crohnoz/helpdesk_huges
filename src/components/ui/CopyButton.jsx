// src/components/ui/CopyButton.jsx — robust copy with fallback + a11y
import React from 'react'

export default function CopyButton({
  text = '',
  label = 'Copy',
  copiedLabel = 'Copied ✓',
  title = 'Copy to clipboard',
  className = '',
  disabled = false,
  timeout = 1200,
  onCopied,
}) {
  const [copied, setCopied] = React.useState(false)

  async function doCopy() {
    if (disabled) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text || '')
      } else {
        // Fallback for older browsers / insecure context
        const ta = document.createElement('textarea')
        ta.value = text || ''
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      onCopied?.()
      window.setTimeout(() => setCopied(false), timeout)
    } catch (err) {
      console.error('Copy failed:', err)
      alert('Could not copy. Please copy manually.')
    }
  }

  return (
    <button
      type="button"
      onClick={doCopy}
      disabled={disabled}
      title={title}
      aria-live="polite"
      className={`h-10 rounded-xl bg-neutral-900 text-white text-sm px-4 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  )
}
