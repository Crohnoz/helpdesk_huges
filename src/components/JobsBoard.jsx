// src/components/JobsBoard.jsx — passes WhatsApp helpers to JobCard
import React from 'react'
import { Text, TextArea, Select, SelectSmall } from './ui/Inputs'
import JobCard from './JobCard'

export default function JobsBoard({
  jobs,
  onAdd,
  onUpdate,
  onRemove,
  onClearAll,
  query,
  setQuery,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  onExportCSV,
  onImportCSV,
  openWhatsApp,
  makeWhatsAppMessage,
}) {
  const [draft, setDraft] = React.useState(newJobDraft())
  const [importOpen, setImportOpen] = React.useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!draft.customerName || !draft.vehicle) return alert('Customer & Vehicle are required.')
    onAdd(draft)
    setDraft(newJobDraft())
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Intake form */}
      <section className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-4">
          <h2 className="text-base font-semibold mb-3">New Job</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
            <Text label="Customer name" value={draft.customerName} onChange={v=>setDraft({ ...draft, customerName: v })} />
            <Text label="Phone" value={draft.phone} onChange={v=>setDraft({ ...draft, phone: v })} placeholder="+61 …" />
            <Text label="Vehicle (Make/Model/Year)" value={draft.vehicle} onChange={v=>setDraft({ ...draft, vehicle: v })} placeholder="e.g., Toyota Hilux 2018" />
            <div className="grid grid-cols-2 gap-3">
              <Text label="Rego" value={draft.rego} onChange={v=>setDraft({ ...draft, rego: v })} />
              <Text label="VIN" value={draft.vin} onChange={v=>setDraft({ ...draft, vin: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Text label="Odometer" value={draft.odometer} onChange={v=>setDraft({ ...draft, odometer: v })} placeholder="km" />
              <Select label="Priority" value={draft.priority} onChange={v=>setDraft({ ...draft, priority: v })} options={[ 'Low', 'Medium', 'High' ]} />
            </div>
            <TextArea label="Customer complaint / issue" value={draft.issue} onChange={v=>setDraft({ ...draft, issue: v })} rows={3} />
            <Text label="Parts (comma separated)" value={draft.parts} onChange={v=>setDraft({ ...draft, parts: v })} placeholder="oil filter, brake pads" />
            <Text label="Due date" type="date" value={draft.dueDate} onChange={v=>setDraft({ ...draft, dueDate: v })} />
            <TextArea label="Notes" value={draft.notes} onChange={v=>setDraft({ ...draft, notes: v })} rows={2} />
            <div className="flex gap-2">
              <button className="flex-1 h-11 rounded-2xl bg-black text-white font-semibold hover:opacity-90" type="submit">Add job</button>
              <button className="h-11 px-4 rounded-2xl bg-neutral-100 border border-neutral-200" type="button" onClick={()=>setDraft(newJobDraft())}>Reset</button>
            </div>
          </form>
        </div>
      </section>

      {/* Right: List & filters */}
      <section className="lg:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-4">
          <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <div className="flex-1 flex gap-2">
              <input
                value={query}
                onChange={e=>setQuery(e.target.value)}
                placeholder="Search jobs… (customer, rego, issue)"
                className="flex-1 h-11 rounded-2xl border border-neutral-200 px-4 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex gap-2">
              <SelectSmall label="Priority" value={priorityFilter} onChange={setPriorityFilter} options={[ 'All', 'Low', 'Medium', 'High' ]} />
              <SelectSmall label="Status" value={statusFilter} onChange={setStatusFilter} options={[ 'All', 'New', 'In progress', 'Waiting parts', 'Ready', 'Delivered' ]} />
              <button onClick={onExportCSV} className="h-11 px-4 rounded-2xl bg-neutral-100 border border-neutral-200">Export CSV</button>
              <button onClick={()=>setImportOpen(v=>!v)} className="h-11 px-4 rounded-2xl bg-neutral-100 border border-neutral-200">Import</button>
            </div>
          </div>

          {importOpen && (
            <div className="mt-3 p-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50">
              <label className="text-sm font-medium">Import CSV</label>
              <input type="file" accept=".csv" onChange={e=> e.target.files?.[0] && onImportCSV(e.target.files[0])} className="mt-1" />
              <p className="text-xs text-neutral-500 mt-1">Columns: customerName, phone, vehicle, rego, vin, odometer, issue, priority, dueDate, parts, status, notes</p>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {jobs.length === 0 && <p className="text-neutral-500 text-sm">No jobs yet. Add one on the left.</p>}
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onUpdate={onUpdate}
                onRemove={onRemove}
                openWhatsApp={openWhatsApp}
                makeWhatsAppMessage={makeWhatsAppMessage}
              />
            ))}
          </div>

          {jobs.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button onClick={onClearAll} className="h-11 px-4 rounded-2xl bg-white text-rose-600 border border-rose-200">Clear all jobs</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function newJobDraft(){
  const due = new Date()
  due.setDate(due.getDate() + 2)
  const iso = due.toISOString().slice(0, 10)
  return {
    customerName: '', phone: '', vehicle: '', rego: '', vin: '', odometer: '', issue: '',
    priority: 'Medium', dueDate: iso, parts: '', notes: '', status: 'New'
  }
}
