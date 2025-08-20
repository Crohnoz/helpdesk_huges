export const defaultTools = [
  { id: 'ratchet_set', label: 'Ratchet set' },
  { id: 'torque_wrench', label: 'Torque wrench' },
  { id: 'obd2_scanner', label: 'OBD2 scanner' },
  { id: 'multimeter', label: 'Multimeter' },
  { id: 'impact_driver', label: 'Impact driver' },
  { id: 'jack_stands', label: 'Jack stands' },
  { id: 'oil_filter_wrench', label: 'Oil filter wrench' },
  { id: 'scan_tablet', label: 'Scan tablet' },
  { id: 'battery_tester', label: 'Battery tester' },
  { id: 'brake_bleeder', label: 'Brake bleeder' },
]

export const priorityColors = {
  Low: 'bg-emerald-100 text-emerald-800',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-rose-100 text-rose-800',
}

export const LS_KEYS = {
  jobs: 'hh.jobs.v1',
  tools: 'hh.tools.v1',
  settings: 'hh.settings.v1',
}
