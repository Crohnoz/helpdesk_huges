// src/components/SettingsPane.jsx — add Branch & WhatsApp settings
import React from 'react'
import { Text, Number, TextArea } from './ui/Inputs'

export default function SettingsPane({ settings, setSettings }) {
  function setKey(key, value) {
    setSettings({ ...settings, [key]: value })
  }

  function onServicesChange(v) {
    const arr = String(v)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    setKey('serviceTypes', arr)
  }

  const serviceTypesStr = (settings.serviceTypes || []).join(', ')

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-4">
      <h2 className="text-base font-semibold">Settings</h2>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Text label="Organisation name" value={settings.orgName} onChange={v => setKey('orgName', v)} />
        <Text label="Your name" value={settings.userName} onChange={v => setKey('userName', v)} />
        <Text label="Branch" value={settings.branch || ''} onChange={v => setKey('branch', v)} placeholder="e.g., Victoria Park" />
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Text label="Phone mask (display only)" value={settings.phoneMask} onChange={v => setKey('phoneMask', v)} placeholder="+61 " />
        <Text label="WhatsApp country code" value={settings.whatsappCountryCode || ''} onChange={v => setKey('whatsappCountryCode', String(v).replace(/[^0-9]/g, ''))} placeholder="61" />
        <Number label="Default due (days)" value={settings.defaultDueDays} onChange={v => setKey('defaultDueDays', v)} />
      </div>

      <div className="mt-3 grid grid-cols-1">
        <TextArea label="Service types (comma separated)" value={serviceTypesStr} onChange={onServicesChange} rows={2} />
      </div>

      <p className="text-xs text-neutral-500 mt-3">
        All data is stored locally in this browser (LocalStorage). You can export/import CSV from the Jobs tab.
      </p>
    </div>
  )
}
