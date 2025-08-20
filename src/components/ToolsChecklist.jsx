function splitCSV(line) {
  const res = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQ = !inQ; continue }
    if (ch === ',' && !inQ) { res.push(cur); cur = ''; continue }
    cur += ch
  }
  res.push(cur)
  return res
}

function stripQuotes(s = '') {
  // Quita comillas dobles SOLO si están en los extremos
  return s.replace(/^"|"$/g, '')
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
