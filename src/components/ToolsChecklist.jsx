// src/components/ToolsChecklist.jsx — search, reorder, import/export, copy missing
import React from 'react'
import { uid } from '../lib/storage'
import CopyButton from './ui/CopyButton'

function ToolsChecklist({ tools, setTools }) {
  const [query, setQuery] = React.useState('')
  const [importOpen, setImportOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tools
    return tools.filter(t => t.label.toLowerCase().includes(q))
  }, [tools, query])

  const missing = tools.filter(t => !t.have)

  function toggle(id) {
    setTools(prev => prev.map(t => (t.id === id ? { ...t, have: !t.have } : t)))
  }
  function setAll(v) {
    setTools(prev => prev.map(t => ({ ...t, have: v })))
  }
  function addTool() {
    const name = prompt('Tool name')
    if (!name) return
    setTools(prev => [{ id: uid('tool'), label: name.trim(), have: false }, ...prev])
  }
  function removeTool(id) {
    if (!confirm('Remove this tool?')) return
    setTools(prev => prev.filter(t => t.id !== id))
  }
  function renameTool(id) {
    const t = tools.find(x => x.id === id)
    const name = prompt('Rename tool', t?.label || '')
    if (!name) return
    setTools(prev => prev.map(x => (x.id === id ? { ...x, label: name.trim() } : x)))
  }
  function move(id, dir) {
    setTools(prev => {
      const i = prev.findIndex(t => t.id === id)
      if (i < 0) return prev
      const j = dir === 'up' ? i - 1 : i + 1
      if (j < 0 || j >= prev.length) return prev
      const next = prev.slice()
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function exportCSV() {
    const header = ['label', 'have']
    const rows = tools.map(t => [JSON.stringify(t.label ?? ''), JSON.stringify(Boolean(t.have))])
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hughes-helper-tools.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importCSV(file) {
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target.result
      const lines = String(text).split(/\r?\n/).filter(Boolean)
      if (lines.length === 0) return
      let start = 0
      const header = lines[0].toLowerCase()
      if (header.includes('label')) start = 1
      const parsed = []
      for (let k = start; k < lines.length; k++) {
        const cols = splitCSV(lines[k])
        const label = stripQuotes(cols[0] || '').trim()
        if (!label) continue
        const hv = (cols[1] || '').trim()
        const have = /^(1|true|yes|ok|present)$/i.test(hv)
        parsed.push({ id: uid('tool'), label, have })
      }
      if (parsed.length) setTools(prev => [...parsed, ...prev])
    }
    reader.readAsText(file)
  }

  function splitCSV(line) {
    const res = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        inQ = !inQ
        continue
      }
      if (ch === ',' && !inQ) {
        res.push(cur)
        cur = ''
        continue
      }
      cur += ch
    }
    res.push(cur)
    return res
  }
  function stripQuotes(s = '') {
    return s.replace(/^"|"$/g, '')
  }

  const missingListText = missing.map(m => `• ${m.label}`).join('\n') || 'All tools present.'

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Tools checklist</h2>
        <div className="flex gap-2">
          <button onClick={addTool} className="h-10 px-4 rounded-2xl bg-neutral-100 border">
            Add
          </button>
          <button onClick={() => setAll(true)} className="h-10 px-4 rounded-2xl bg-neutral-100 border">
            All present
          </button>
          <button onClick={() => setAll(false)} className="h-10 px-4 rounded-2xl bg-neutral-100 border">
            Clear
          </button>
          <button onClick={exportCSV} className="h-10 px-4 rounded-2xl bg-neutral-100 border">
            Export
          </button>
          <button onClick={() => setImportOpen(v => !v)} className="h-10 px-4 rounded-2xl bg-neutral-100 border">
            Import
          </button>
        </div>
      </div>
      <p className="mt-1 text-sm text-neutral-600">Quick tap to mark present / missing.</p>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tools…"
          className="flex-1 h-11 rounded-2xl border border-neutral-200 px-4 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
        <CopyButton text={missingListText} label={`Copy Missing (${missing.length})`} />
      </div>

      {importOpen && (
        <div className="mt-3 p-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50">
          <label className="text-sm font-medium">Import CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={e => e.target.files?.[0] && importCSV(e.target.files[0])}
            className="mt-1"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Columns: label, have (true/false or yes/no/1/0). New tools are prepended.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map(t => (
          <div
            key={t.id}
            className={`w-full p-3 rounded-2xl border ${t.have ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-neutral-200'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <button onClick={() => toggle(t.id)} className="text-left flex-1">
                <div className="text-sm font-medium">{t.label}</div>
                <div
                  className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                    t.have ? 'bg-emerald-600 text-white' : 'bg-neutral-100'
                  }`}
                >
                  {t.have ? 'OK' : 'Missing'}
                </div>
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => move(t.id, 'up')} title="Move up" className="text-neutral-400 hover:text-neutral-700">
                  ↑
                </button>
                <button onClick={() => move(t.id, 'down')} title="Move down" className="text-neutral-400 hover:text-neutral-700">
                  ↓
                </button>
                <button onClick={() => renameTool(t.id)} title="Rename" className="text-neutral-400 hover:text-neutral-700">
                  ✎
                </button>
                <button onClick={() => removeTool(t.id)} title="Delete" className="text-neutral-400 hover:text-rose-600">
                  ✖
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold">Missing today ({missing.length})</h3>
        {missing.length === 0 ? (
          <p className="text-sm text-neutral-500">All tools present. Nice.</p>
        ) : (
          <ul className="mt-1 list-disc list-inside text-sm">
            {missing.map(m => (
              <li key={m.id}>{m.label}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ToolsChecklist
