// src/components/Templates.jsx — message templates + WhatsApp send
import React from 'react'
import CopyButton from './ui/CopyButton'
import { Text } from './ui/Inputs'

function toWaNumber(raw, cc) {
  if (!raw) return ''
  const digits = String(raw).replace(/\D/g, '')
  if (!cc) return digits
  return digits.startsWith(cc) ? digits : cc + digits.replace(/^0+/, '')
}

export default function Templates({ settings }) {
  const [kind, setKind] = React.useState('status')
  const [vars, setVars] = React.useState({
    name: '',
    vehicle: '',
    rego: '',
    eta: 'today 4pm',
    phone: '',
  })

  const text = React.useMemo(() => {
    if (kind === 'status') {
      return `Hi ${vars.name || 'there'}, quick update from ${settings.orgName}. Your ${vars.vehicle} (${vars.rego}) is on track. ETA ${vars.eta}. — ${settings.userName}`
    }
    if (kind === 'ready') {
      return `Good news ${vars.name}! Your ${vars.vehicle} (${vars.rego}) is ready for pickup. — ${settings.userName}, ${settings.orgName}`
    }
    return `Hi ${vars.name}, we need authorisation to proceed on your ${vars.vehicle} (${vars.rego}). Reply YES to approve. — ${settings.userName}, ${settings.orgName}`
  }, [kind, vars, settings])

  function openWhatsApp() {
    const cc = settings?.whatsappCountryCode || '61'
    const number = toWaNumber(vars.phone, cc)
    const url = number
      ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function reset() {
    setVars({ name: '', vehicle: '', rego: '', eta: 'today 4pm', phone: '' })
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-4">
      <h2 className="text-base font-semibold">Customer message templates</h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { id: 'status', label: 'Status update' },
          { id: 'ready', label: 'Ready for pickup' },
          { id: 'approve', label: 'Approval request' },
        ].map(o => (
          <button
            key={o.id}
            onClick={() => setKind(o.id)}
            className={`h-10 px-4 rounded-2xl border ${
              kind === o.id ? 'bg-black text-white border-black' : 'bg-neutral-100'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <Text label="Customer name" value={vars.name} onChange={v => setVars({ ...vars, name: v })} />
        <Text label="Vehicle" value={vars.vehicle} onChange={v => setVars({ ...vars, vehicle: v })} />
        <Text label="Rego" value={vars.rego} onChange={v => setVars({ ...vars, rego: v })} />
        <Text label="ETA" value={vars.eta} onChange={v => setVars({ ...vars, eta: v })} />
        <Text
          label="Phone (WhatsApp)"
          value={vars.phone}
          onChange={v => setVars({ ...vars, phone: v })}
          placeholder={settings?.phoneMask || '+61 '}
        />
      </div>

      <div className="mt-3 p-3 rounded-2xl border bg-neutral-50">
        <p className="text-sm whitespace-pre-wrap">{text}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton text={text} label="Copy" />
        <button
          onClick={openWhatsApp}
          className="h-10 rounded-xl bg-[#25D366] text-white text-sm px-4"
        >
          Send via WhatsApp
        </button>
        <button onClick={reset} className="h-10 rounded-xl bg-neutral-100 text-sm px-4 border">
          Reset
        </button>
      </div>

      <p className="text-xs text-neutral-500 mt-2">
        Tip: Ajusta el código de país en Settings → WhatsApp country code.
      </p>
    </div>
  )
}
