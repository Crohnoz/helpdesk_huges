/* src/App.jsx — core app container */
import React from 'react'
import TopBar from './components/TopBar'
import JobsBoard from './components/JobsBoard'
import ToolsChecklist from './components/ToolsChecklist'
import Templates from './components/Templates'
import SettingsPane from './components/SettingsPane'
import { defaultTools, LS_KEYS } from './data/defaults'
import { useLocalState } from './lib/storage'

function useFilters() {
  const [query, setQuery] = React.useState('')
  const [priorityFilter, setPriorityFilter] = React.useState('All')
  const [statusFilter, setStatusFilter] = React.useState('All')
  return { query, setQuery, priorityFilter, setPriorityFilter, statusFilter, setStatusFilter }
}

export default function App() {
  const [tab, setTab] = React.useState('jobs')
  const [jobs, setJobs] = useLocalState(LS_KEYS.jobs, [])
  const [tools, setTools] = useLocalState(
    LS_KEYS.tools,
    defaultTools.map(t => ({ ...t, have: true }))
  )
  const [settings, setSettings] = useLocalState(LS_KEYS.settings, {
    orgName: 'John Hughes — Service',
    userName: 'Matthew',
    phoneMask: '+61 ',
    defaultDueDays: 2,
    branch: 'Victoria Park',
    serviceTypes: ['Logbook', 'Brakes', 'Tyres', 'Battery', 'Diagnosis'],
    whatsappCountryCode: '61', // AU
  })
  const filters = useFilters()

  const filteredJobs = React.useMemo(
    () =>
      jobs.filter(j => {
        const q = filters.query.toLowerCase()
        const matchesText =
          !q ||
          [j.customerName, j.vehicle, j.rego, j.vin, j.issue]
            .join(' ')
            .toLowerCase()
            .includes(q)
        const matchesPriority =
          filters.priorityFilter === 'All' || j.priority === filters.priorityFilter
        const matchesStatus =
          filters.statusFilter === 'All' || j.status === filters.statusFilter
        return matchesText && matchesPriority && matchesStatus
      }),
    [jobs, filters]
  )

  function addJob(job) {
    setJobs(prev => [
      {
        id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        ...job,
      },
      ...prev,
    ])
  }
  function updateJob(id, patch) {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, ...patch } : j)))
  }
  function removeJob(id) {
    setJobs(prev => prev.filter(j => j.id !== id))
  }
  function clearAllJobs() {
    if (confirm('Clear ALL jobs?')) setJobs([])
  }

  // ---------- CSV helpers ----------
  function exportCSV() {
    const header = [
      'createdAt',
      'customerName',
      'phone',
      'vehicle',
      'rego',
      'vin',
      'odometer',
      'issue',
      'priority',
      'dueDate',
      'parts',
      'status',
      'notes',
    ]
    const rows = jobs.map(j => header.map(h => JSON.stringify(j[h] ?? '')))
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hughes-helper-jobs.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  function importCSV(file) {
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target.result
      const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean)
      const headers = headerLine.split(',').map(h => h.trim())
      const mapped = lines.map(line => {
        const cols = splitCSV(line)
        const obj = {
          id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
          createdAt: new Date().toISOString(),
        }
        headers.forEach((h, i) => (obj[h] = stripQuotes(cols[i])))
        obj.parts = obj.parts || ''
        obj.status = obj.status || 'New'
        obj.priority = obj.priority || 'Medium'
        return obj
      })
      setJobs(prev => [...mapped, ...prev])
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

  // ---------- WhatsApp helpers ----------
  function toWaNumber(raw, cc = settings.whatsappCountryCode) {
    if (!raw) return ''
    const digits = String(raw).replace(/\D/g, '')
    if (digits.startsWith(cc)) return digits
    return cc + digits.replace(/^0+/, '')
  }
  function makeWaMessage(job) {
    const partsList = (job.parts || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .join(', ')
    const lines = [
      `Hi ${job.customerName || ''}, quick update from ${settings.orgName}.`,
      `${job.vehicle || 'Vehicle'} (${job.rego || 'Rego —'})`,
      job.issue ? `Issue: ${job.issue}` : null,
      `Status: ${job.status || 'New'}`,
      job.dueDate ? `ETA: ${job.dueDate}` : null,
      partsList ? `Parts: ${partsList}` : null,
      `— ${settings.userName} (${settings.branch})`,
    ].filter(Boolean)
    return lines.join('\n')
  }
  function openWhatsApp(job) {
    const msg = encodeURIComponent(makeWaMessage(job))
    const number = toWaNumber(job.phone)
    const url = number ? `https://wa.me/${number}?text=${msg}` : `https://wa.me/?text=${msg}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const missingTools = tools.filter(t => !t.have)

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      <TopBar settings={settings} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-2 my-4 flex-wrap">
          {[
            { id: 'jobs', label: 'Jobs' },
            { id: 'tools', label: `Tools (${missingTools.length ? `${missingTools.length} missing` : 'OK'})` },
            { id: 'templates', label: 'Templates' },
            { id: 'settings', label: 'Settings' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition border ${
                tab === t.id ? 'bg-black text-white border-black' : 'bg-white hover:bg-neutral-100 border-neutral-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'jobs' && (
          <JobsBoard
            jobs={filteredJobs}
            onAdd={addJob}
            onUpdate={updateJob}
            onRemove={removeJob}
            onClearAll={clearAllJobs}
            query={filters.query}
            setQuery={filters.setQuery}
            priorityFilter={filters.priorityFilter}
            setPriorityFilter={filters.setPriorityFilter}
            statusFilter={filters.statusFilter}
            setStatusFilter={filters.setStatusFilter}
            onExportCSV={exportCSV}
            onImportCSV={importCSV}
            /* New helpers for WhatsApp (UI se agrega en JobCard.jsx en el siguiente paso) */
            makeWhatsAppMessage={makeWaMessage}
            openWhatsApp={openWhatsApp}
          />
        )}

        {tab === 'tools' && <ToolsChecklist tools={tools} setTools={setTools} />}
        {tab === 'templates' && <Templates settings={settings} />}
        {tab === 'settings' && <SettingsPane settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  )
}
