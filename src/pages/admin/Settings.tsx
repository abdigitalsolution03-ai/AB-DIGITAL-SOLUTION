import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface SiteSettings {
  general: { siteName: string; tagline: string; logoUrl: string; faviconUrl: string; footerCopyright: string }
  contact: { email: string; phone: string; address: string; googleMapsKey: string }
  social: { facebook: string; instagram: string; linkedin: string; twitter: string; youtube: string }
  theme: { primaryColor: string; accentColor: string; borderRadius: number; fontFamily: string }
  analytics: { googleAnalyticsId: string; facebookPixelId: string; customHeadCode: string }
}

const defaultSettings: SiteSettings = {
  general: { siteName: 'AB DIGITAL', tagline: 'Digital Solutions Agency', logoUrl: '', faviconUrl: '', footerCopyright: '© 2026 AB DIGITAL SOLUTION. All rights reserved.' },
  contact: { email: '', phone: '', address: '', googleMapsKey: '' },
  social: { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' },
  theme: { primaryColor: '#111111', accentColor: '#FFD400', borderRadius: 20, fontFamily: 'Poppins' },
  analytics: { googleAnalyticsId: '', facebookPixelId: '', customHeadCode: '' },
}

const fontOptions = ['Poppins', 'Inter', 'Space Grotesk', 'DM Sans', 'Plus Jakarta Sans', 'Lexend']

const tabs = ['General', 'Contact', 'Social', 'Theme', 'Analytics']

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('adminSettings') || 'null')
    if (saved) setSettings(saved)
  }, [])

  const saveSettings = (updated: SiteSettings, section: string) => {
    localStorage.setItem('adminSettings', JSON.stringify(updated))
    setSettings(updated)
    setToast(`${section} settings saved successfully!`)
    setTimeout(() => setToast(''), 2500)
  }

  const updateGeneral = (field: string, value: string) => {
    setSettings({ ...settings, general: { ...settings.general, [field]: value } })
  }

  const updateContact = (field: string, value: string) => {
    setSettings({ ...settings, contact: { ...settings.contact, [field]: value } })
  }

  const updateSocial = (field: string, value: string) => {
    setSettings({ ...settings, social: { ...settings.social, [field]: value } })
  }

  const updateTheme = (field: string, value: string | number) => {
    setSettings({ ...settings, theme: { ...settings.theme, [field]: value } })
  }

  const updateAnalytics = (field: string, value: string) => {
    setSettings({ ...settings, analytics: { ...settings.analytics, [field]: value } })
  }

  const inputClass = "w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm"
  const labelClass = "block text-sm font-bold text-[#111]/60 mb-2"

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#111]">Site Settings</h1>
        <p className="text-[#111]/60 text-sm mt-1">Configure your site preferences</p>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2.5 text-sm font-bold transition-all border-3 border-[#111] whitespace-nowrap ${
              activeTab === i ? 'bg-[#FFD400] text-[#111]' : 'bg-white text-[#111]/60 hover:bg-[#FFD400]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="doodle-card p-6 md:p-8">
            {activeTab === 0 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-lg font-black text-[#111] mb-6">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Site Name</label>
                    <input type="text" value={settings.general.siteName} onChange={(e) => updateGeneral('siteName', e.target.value)} className={inputClass} placeholder="AB DIGITAL" />
                  </div>
                  <div>
                    <label className={labelClass}>Tagline</label>
                    <input type="text" value={settings.general.tagline} onChange={(e) => updateGeneral('tagline', e.target.value)} className={inputClass} placeholder="Digital Solutions Agency" />
                  </div>
                  <div>
                    <label className={labelClass}>Logo URL</label>
                    <input type="url" value={settings.general.logoUrl} onChange={(e) => updateGeneral('logoUrl', e.target.value)} className={inputClass} placeholder="https://example.com/logo.png" />
                  </div>
                  <div>
                    <label className={labelClass}>Favicon URL</label>
                    <input type="url" value={settings.general.faviconUrl} onChange={(e) => updateGeneral('faviconUrl', e.target.value)} className={inputClass} placeholder="https://example.com/favicon.ico" />
                  </div>
                  <div>
                    <label className={labelClass}>Footer Copyright Text</label>
                    <input type="text" value={settings.general.footerCopyright} onChange={(e) => updateGeneral('footerCopyright', e.target.value)} className={inputClass} placeholder="© 2026 AB DIGITAL SOLUTION. All rights reserved." />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => saveSettings(settings, 'General')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save General</button>
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-lg font-black text-[#111] mb-6">Contact Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" value={settings.contact.email} onChange={(e) => updateContact('email', e.target.value)} className={inputClass} placeholder="info@abdigital.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="text" value={settings.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} className={inputClass} placeholder="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <textarea value={settings.contact.address} onChange={(e) => updateContact('address', e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="123 Business Ave, Suite 100" />
                  </div>
                  <div>
                    <label className={labelClass}>Google Maps API Key</label>
                    <input type="text" value={settings.contact.googleMapsKey} onChange={(e) => updateContact('googleMapsKey', e.target.value)} className={inputClass} placeholder="AIzaSy..." />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => saveSettings(settings, 'Contact')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Contact</button>
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-lg font-black text-[#111] mb-6">Social Media Links</h2>
                <div className="space-y-4">
                  {([['facebook', 'Facebook'], ['instagram', 'Instagram'], ['linkedin', 'LinkedIn'], ['twitter', 'Twitter'], ['youtube', 'YouTube']] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className={labelClass}>{label} URL</label>
                      <input type="url" value={(settings.social as any)[key]} onChange={(e) => updateSocial(key, e.target.value)} className={inputClass} placeholder={`https://${label.toLowerCase()}.com/...`} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => saveSettings(settings, 'Social')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Social</button>
                </div>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-lg font-black text-[#111] mb-6">Theme Settings</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={settings.theme.primaryColor} onChange={(e) => updateTheme('primaryColor', e.target.value)} className="w-10 h-10 border-3 border-[#111] cursor-pointer p-0.5" />
                        <input type="text" value={settings.theme.primaryColor} onChange={(e) => updateTheme('primaryColor', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={settings.theme.accentColor} onChange={(e) => updateTheme('accentColor', e.target.value)} className="w-10 h-10 border-3 border-[#111] cursor-pointer p-0.5" />
                        <input type="text" value={settings.theme.accentColor} onChange={(e) => updateTheme('accentColor', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Border Radius: {settings.theme.borderRadius}px</label>
                    <input type="range" min="0" max="40" value={settings.theme.borderRadius} onChange={(e) => updateTheme('borderRadius', parseInt(e.target.value))} className="w-full accent-[#FFD400] cursor-pointer" />
                  </div>
                  <div>
                    <label className={labelClass}>Font Family</label>
                    <select value={settings.theme.fontFamily} onChange={(e) => updateTheme('fontFamily', e.target.value)} className={inputClass}>
                      {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => saveSettings(settings, 'Theme')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Theme</button>
                </div>
              </motion.div>
            )}

            {activeTab === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-lg font-black text-[#111] mb-6">Analytics Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Google Analytics ID</label>
                    <input type="text" value={settings.analytics.googleAnalyticsId} onChange={(e) => updateAnalytics('googleAnalyticsId', e.target.value)} className={inputClass} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div>
                    <label className={labelClass}>Facebook Pixel ID</label>
                    <input type="text" value={settings.analytics.facebookPixelId} onChange={(e) => updateAnalytics('facebookPixelId', e.target.value)} className={inputClass} placeholder="1234567890" />
                  </div>
                  <div>
                    <label className={labelClass}>Custom Head Code</label>
                    <textarea value={settings.analytics.customHeadCode} onChange={(e) => updateAnalytics('customHeadCode', e.target.value)} rows={6} className={`${inputClass} resize-none font-mono text-xs`} placeholder="<!-- Custom scripts, meta tags, etc. -->" />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => saveSettings(settings, 'Analytics')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Analytics</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div>
          <div className="doodle-card p-6">
            <h2 className="text-lg font-black text-[#111] mb-4">Current Preview</h2>
            <div className="space-y-4 text-sm">
              {activeTab === 0 && (
                <div>
                  <p className="text-[#111]/40 text-xs uppercase font-bold mb-2">Site Identity</p>
                  <div className="bg-white border-3 border-[#111] p-4">
                    <p className="font-black text-lg">{settings.general.siteName || 'AB DIGITAL'}</p>
                    <p className="text-[#111]/60 text-xs mt-0.5">{settings.general.tagline}</p>
                  </div>
                  <p className="text-[#111]/40 text-[10px] mt-3">{settings.general.footerCopyright}</p>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <p className="text-[#111]/40 text-xs uppercase font-bold mb-2">Contact Info</p>
                  <div className="space-y-2 bg-white border-3 border-[#111] p-4">
                    {settings.contact.email && <p className="text-[#111]">📧 {settings.contact.email}</p>}
                    {settings.contact.phone && <p className="text-[#111]">📞 {settings.contact.phone}</p>}
                    {settings.contact.address && <p className="text-[#111] text-xs">{settings.contact.address}</p>}
                    {!settings.contact.email && !settings.contact.phone && <p className="text-[#111]/40 text-xs">No contact info set</p>}
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <p className="text-[#111]/40 text-xs uppercase font-bold mb-2">Social Links</p>
                  <div className="bg-white border-3 border-[#111] p-4">
                    {(['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'] as const).map((key) => (
                      <div key={key} className="flex items-center gap-2 py-1">
                        <div className={`w-2 h-2 ${(settings.social as any)[key] ? 'bg-[#4D7AFF]' : 'bg-[#111]/20'}`} />
                        <span className="text-xs capitalize text-[#111]">{key}</span>
                        <span className="text-[10px] text-[#111]/40 ml-auto">{(settings.social as any)[key] ? 'Set' : 'Not set'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 3 && (
                <div>
                  <p className="text-[#111]/40 text-xs uppercase font-bold mb-2">Theme Preview</p>
                  <div className="bg-white border-3 border-[#111] p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 border-3 border-[#111]" style={{ backgroundColor: settings.theme.primaryColor }} />
                      <div className="w-8 h-8 border-3 border-[#111]" style={{ backgroundColor: settings.theme.accentColor }} />
                    </div>
                    <div className="h-2 border-2 border-[#111]" style={{ borderRadius: settings.theme.borderRadius, backgroundColor: settings.theme.accentColor }} />
                    <p className="text-xs text-[#111]" style={{ fontFamily: settings.theme.fontFamily }}>Font: {settings.theme.fontFamily}</p>
                  </div>
                </div>
              )}
              {activeTab === 4 && (
                <div>
                  <p className="text-[#111]/40 text-xs uppercase font-bold mb-2">Tracking</p>
                  <div className="bg-white border-3 border-[#111] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#111]">GA ID</span>
                      <span className={`text-[10px] ${settings.analytics.googleAnalyticsId ? 'text-green-600' : 'text-[#111]/40'}`}>{settings.analytics.googleAnalyticsId || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#111]">Pixel ID</span>
                      <span className={`text-[10px] ${settings.analytics.facebookPixelId ? 'text-green-600' : 'text-[#111]/40'}`}>{settings.analytics.facebookPixelId || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#111]">Custom Code</span>
                      <span className={`text-[10px] ${settings.analytics.customHeadCode ? 'text-green-600' : 'text-[#111]/40'}`}>{settings.analytics.customHeadCode ? `${settings.analytics.customHeadCode.length} chars` : 'Not set'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 doodle-btn-accent px-6 py-3 text-sm font-bold shadow-[4px_4px_0_#111] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
