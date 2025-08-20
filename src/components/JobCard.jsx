// src/components/JobCard.jsx — with WhatsApp action
import React from 'react'
import { priorityColors } from '../data/defaults'
import CopyButton from './ui/CopyButton'
import { classNames } from './ui/Inputs'

export default function JobCard({ job, onUpdate, onRemove, openWhatsApp, makeWhatsAppMessage }){
  const priColor = priorityColors[job.priority] || 'bg-neutral-100'
  const parts = (job.parts || '').split(',').map(s => s.trim()).filter(Boolean)

  function setStatus(status){ onUpdate(job.id, { status }) }

  const statusMsg = `Hi, your ${job.vehicle} (${job.rego}) — ${(job.issue||'').slice(0,80)}… Status: ${job.status}.`

  function previewWhatsApp(){
    try { alert(makeWhatsAppMessage ? makeWhatsAppMessage(job) : statusMsg) } catch {}
  }

  return (
    <div className="border border-neutral-200 rounded-2xl p-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={classNames('px-2 py-0.5 rounded-full text-xs', priColor)}>{job.priority}</span>
          <span className="text-xs text-neutral-500">Due {job.dueDate || '—'}</span>
        </div>
        <button onClick={() => onRemove(job.id)} className="text-neutral-400 hover:text-rose-600" title="Delete">✖</button>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold text-sm">
          {job.customerName}
          <span className="text-neutral-400 font-normal"> · {job.vehicle}</span>
        </h3>
        <p className="text-xs text-neutral-600">
          Rego: <b>{job.rego || '—'}</b> · VIN: <b>{job.vin || '—'}</b> · Odo: <b>{job.odometer || '—'}</b>
        </p>
        <p className="mt-1 text-sm">Issue: {job.issue || '—'}</p>
        {parts.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {parts.map((p, i) => (
              <span key={i} className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">{p}</span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={() => setStatus('In progress')} className="h-10 rounded-xl bg-neutral-900 text-white text-sm">In progress</button>
        <button onClick={() => setStatus('Waiting parts')} className="h-10 rounded-xl bg-neutral-100 text-sm border">Waiting parts</button>
        <button onClick={() => setStatus('Ready')} className="h-10 rounded-xl bg-emerald-600 text-white text-sm">Mark Ready</button>
        <button onClick={() => setStatus('Delivered')} className="h-10 rounded-xl bg-neutral-100 text-sm border">Delivered</button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <CopyButton text={statusMsg} label="Copy status" />
        <button onClick={() => onUpdate(job.id, { notes: prompt('Notes', job.notes || '') || job.notes })} className="h-10 rounded-xl bg-neutral-100 text-sm border">Add note</button>
        <button onClick={() => (openWhatsApp ? openWhatsApp(job) : previewWhatsApp())} className="h-10 rounded-xl bg-[#25D366] text-white text-sm" title="Send WhatsApp message">WhatsApp</button>
      </div>

      <div className="mt-1 text-right">
        <button onClick={previewWhatsApp} className="text-xs text-neutral-500 underline underline-offset-2">Preview message</button>
      </div>
    </div>
  )
}
