import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiChevronDown, FiChevronUp, FiSearch, FiCopy, FiImage } from 'react-icons/fi'
import { getAll, create, update, remove, updateSingle, get, getMediaUrl } from '@/services/cms'
import { schemas, getSchemaDefaults, type SchemaDefinition, type SchemaField } from '@/services/schemas'
import { Card, Modal, Button, Input, EmptyState, ConfirmDialog, Badge } from '@/components/ui'

export default function AdminManager() {
  const [activeSchema, setActiveSchema] = useState<string>('services')
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [activeGroup, setActiveGroup] = useState<string>('')
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaPickerTarget, setMediaPickerTarget] = useState('')

  const schema = schemas[activeSchema]
  const isSingle = schema?.single
  const mediaItems = getAll('media')

  useEffect(() => {
    loadItems()
  }, [activeSchema])

  const loadItems = () => {
    if (isSingle) {
      setItems(get(activeSchema) ? [get(activeSchema)] : [])
      return
    }
    setItems(getAll(activeSchema))
  }

  const openCreate = () => {
    setEditingItem(null)
    setFormData(getSchemaDefaults(activeSchema))
    setActiveGroup('')
    setShowForm(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setFormData({ ...item })
    setActiveGroup('')
    setShowForm(true)
  }

  const handleSave = () => {
    if (isSingle) {
      updateSingle(activeSchema, formData)
    } else if (editingItem) {
      update(activeSchema, editingItem.id, formData)
    } else {
      create(activeSchema, formData)
    }
    setShowForm(false)
    loadItems()
  }

  const handleDelete = () => {
    if (deleteId) {
      remove(activeSchema, deleteId)
      setDeleteId(null)
      loadItems()
    }
  }

  const openMediaPicker = (key: string) => {
    setMediaPickerTarget(key)
    setMediaPickerOpen(true)
  }

  const selectMedia = (url: string) => {
    setFormData(prev => ({ ...prev, [mediaPickerTarget]: url }))
    setMediaPickerOpen(false)
  }

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleRepeaterAdd = (key: string, fields?: SchemaField[]) => {
    const item: Record<string, any> = {}
    if (fields) {
      for (const f of fields) {
        if (f.type === 'repeater') item[f.key] = []
        else item[f.key] = f.defaultValue ?? ''
      }
    }
    const current = formData[key] || []
    setFormData(prev => ({ ...prev, [key]: [...current, item] }))
  }

  const handleRepeaterRemove = (key: string, index: number) => {
    const current = formData[key] || []
    setFormData(prev => ({ ...prev, [key]: current.filter((_: any, i: number) => i !== index) }))
  }

  const handleRepeaterFieldChange = (key: string, index: number, subKey: string, value: any) => {
    const items = [...(formData[key] || [])]
    items[index] = { ...items[index], [subKey]: value }
    setFormData(prev => ({ ...prev, [key]: items }))
  }

  const renderField = (field: SchemaField) => {
    const value = formData[field.key]
    const label = <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{field.label}</label>

    switch (field.type) {
      case 'text':
      case 'slug':
      case 'url':
      case 'email':
      case 'tel':
        return (
          <div>
            {label}
            <input
              type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : field.type === 'url' ? 'url' : 'text'}
              value={value ?? ''}
              onChange={e => handleFieldChange(field.key, e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
              placeholder={field.placeholder}
            />
          </div>
        )
      case 'textarea':
        return (
          <div>
            {label}
            <textarea
              value={value ?? ''}
              onChange={e => handleFieldChange(field.key, e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
              placeholder={field.placeholder}
            />
          </div>
        )
      case 'richtext':
        return (
          <div>
            {label}
            <textarea
              value={value ?? ''}
              onChange={e => handleFieldChange(field.key, e.target.value)}
              rows={10}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono"
              placeholder="HTML content"
            />
          </div>
        )
      case 'image':
        return (
          <div>
            {label}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={value ?? ''}
                onChange={e => handleFieldChange(field.key, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
                placeholder="Image URL"
              />
              <button type="button" onClick={() => openMediaPicker(field.key)} className="px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <FiImage size={16} />
              </button>
            </div>
            {value && (
              <img src={getMediaUrl(value)} alt="" className="mt-2 h-20 rounded-xl object-cover border border-[var(--border-primary)]" />
            )}
          </div>
        )
      case 'gallery':
        return (
          <div>
            {label}
            <div className="flex flex-wrap gap-2">
              {(value || []).map((url: string, i: number) => (
                <div key={i} className="relative group">
                  <img src={getMediaUrl(url)} alt="" className="w-20 h-20 rounded-xl object-cover border border-[var(--border-primary)]" />
                  <button type="button" onClick={() => handleFieldChange(field.key, (value || []).filter((_: string, j: number) => j !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">
                    <FiX size={10} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => openMediaPicker(field.key)} className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--border-primary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-blue-500 hover:border-blue-500">
                <FiPlus size={20} />
              </button>
            </div>
          </div>
        )
      case 'color':
        return (
          <div className="flex gap-2 items-center">
            <div>
              {label}
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="color"
                  value={value || '#000000'}
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={value ?? ''}
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        )
      case 'number':
        return (
          <div>
            {label}
            <input
              type="number"
              value={value ?? 0}
              onChange={e => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'boolean':
        return (
          <label className="flex items-center gap-2.5 cursor-pointer py-2">
            <input
              type="checkbox"
              checked={!!value}
              onChange={e => handleFieldChange(field.key, e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-primary)] text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-[var(--text-primary)]">{field.label}</span>
          </label>
        )
      case 'select':
        return (
          <div>
            {label}
            <select
              value={value ?? ''}
              onChange={e => handleFieldChange(field.key, e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm"
            >
              <option value="">Select...</option>
              {field.options?.map((opt: { label: string; value: string }) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )
      case 'multiselect':
        return (
          <div>
            {label}
            <div className="flex flex-wrap gap-2 mt-1.5">
              {(field.options || []).map((opt: { label: string; value: string }) => {
                const selected = (value || []).includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const current = value || []
                      const newVal = selected ? current.filter((v: string) => v !== opt.value) : [...current, opt.value]
                      handleFieldChange(field.key, newVal)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selected ? 'bg-blue-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )
      case 'date':
        return (
          <div>
            {label}
            <input
              type="date"
              value={value ?? ''}
              onChange={e => handleFieldChange(field.key, e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'code':
        return (
          <div>
            {label}
            <textarea
              value={value ?? ''}
              onChange={e => handleFieldChange(field.key, e.target.value)}
              rows={8}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono"
              placeholder={field.placeholder || `<script>...</script>`}
            />
          </div>
        )
      case 'icon':
        return (
          <div>
            {label}
            <div className="flex gap-2">
              <input
                type="text"
                value={value ?? ''}
                onChange={e => handleFieldChange(field.key, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
                placeholder="Emoji or SVG path"
              />
              {value && <span className="text-2xl">{value}</span>}
            </div>
          </div>
        )
      case 'repeater':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">{field.label}</label>
              <button
                type="button"
                onClick={() => handleRepeaterAdd(field.key, field.fields)}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400"
              >
                <FiPlus size={12} /> Add
              </button>
            </div>
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-[var(--text-tertiary)]">Item {idx + 1}</span>
                    <button type="button" onClick={() => handleRepeaterRemove(field.key, idx)} className="text-red-500 hover:text-red-400"><FiTrash2 size={14} /></button>
                  </div>
                  <div className="space-y-3">
                    {field.fields?.map((subField: SchemaField) => (
                      <div key={subField.key}>
                        {renderRepeaterField(field.key, idx, subField, item)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(value || []).length === 0 && (
                <p className="text-xs text-[var(--text-tertiary)]">No items yet.</p>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderRepeaterField = (parentKey: string, index: number, field: SchemaField, item: any) => {
    const val = item[field.key]
    switch (field.type) {
      case 'text':
      case 'url':
      case 'email':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{field.label}</label>
            <input
              type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
              value={val ?? ''}
              onChange={e => handleRepeaterFieldChange(parentKey, index, field.key, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'textarea':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{field.label}</label>
            <textarea
              value={val ?? ''}
              onChange={e => handleRepeaterFieldChange(parentKey, index, field.key, e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'image':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{field.label}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={val ?? ''}
                onChange={e => handleRepeaterFieldChange(parentKey, index, field.key, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
                placeholder="URL"
              />
              <button type="button" onClick={() => { setMediaPickerTarget(`${parentKey}.${index}.${field.key}`); setMediaPickerOpen(true) }} className="px-2 py-2 rounded-lg bg-[var(--bg-tertiary)]"><FiImage size={14} /></button>
            </div>
            {val && <img src={getMediaUrl(val)} alt="" className="mt-1 h-12 rounded-lg object-cover" />}
          </div>
        )
      case 'number':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{field.label}</label>
            <input
              type="number"
              value={val ?? 0}
              onChange={e => handleRepeaterFieldChange(parentKey, index, field.key, parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!val}
              onChange={e => handleRepeaterFieldChange(parentKey, index, field.key, e.target.checked)}
              className="w-3.5 h-3.5 rounded"
            />
            <span className="text-xs text-[var(--text-primary)]">{field.label}</span>
          </label>
        )
      case 'select':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{field.label}</label>
            <select
              value={val ?? ''}
              onChange={e => handleRepeaterFieldChange(parentKey, index, field.key, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm"
            >
              {field.options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )
      default:
        return null
    }
  }

  const sortedSchemaKeys = Object.keys(schemas).sort()
  const filteredItems = items.filter((item: any) =>
    !search || Object.values(item).some((v: any) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  )

  const groups = schema?.groups || []
  const groupedFields = groups.length > 0
    ? groups.map(g => ({
        ...g,
        fields: schema.fields.filter(f => f.group === g.key),
      })).filter(g => g.fields.length > 0)
    : [{ key: 'all', label: 'All Fields', fields: schema?.fields || [] }]

  const currentGroupedFields = activeGroup
    ? groupedFields.find(g => g.key === activeGroup)?.fields || []
    : groupedFields[0]?.fields || []

  const getDisplayName = (item: any) => item.title || item.name || item.question || item.label || item.id || 'Item'
  const getDisplayPreview = (item: any) => item.description || item.content || item.excerpt || item.bio || item.answer || item.email || ''

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      <Card className="w-[220px] shrink-0 overflow-y-auto">
        <div className="p-1 space-y-0.5">
          {sortedSchemaKeys.map(key => {
            const s = schemas[key]
            const count = s.single ? (get(key) ? 1 : 0) : getAll(key).length
            return (
              <button
                key={key}
                onClick={() => setActiveSchema(key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSchema === key
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <span>{s.label}</span>
                  {!s.single && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="flex-1 flex flex-col min-w-0">
        {schema && (
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{schema.label}</h2>
              <p className="text-sm text-[var(--text-tertiary)]">{schema.description}</p>
            </div>
            {!isSingle && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm w-48"
                    placeholder="Search..."
                  />
                </div>
                <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>Add New</Button>
              </div>
            )}
            {isSingle && (
              <Button variant="primary" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(items[0] || {})}>Edit</Button>
            )}
          </div>
        )}

        {isSingle && items.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] p-6">
              <div className="flex flex-wrap gap-1.5 mb-6">
                {groupedFields.map(g => (
                  <button
                    key={g.key}
                    onClick={() => setActiveGroup(g.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      (activeGroup || groupedFields[0]?.key) === g.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <div className="space-y-5">
                {currentGroupedFields.map(field => (
                  <div key={field.key}>{renderField(field)}</div>
                ))}
              </div>
              <div className="flex justify-end mt-6 pt-4 border-t border-[var(--border-primary)]">
                <Button variant="primary" icon={<FiSave />} onClick={handleSave}>Save Settings</Button>
              </div>
            </div>
          </div>
        )}

        {!isSingle && (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {filteredItems.length === 0 && (
                <Card>
                  <EmptyState
                    title={`No ${schema?.label || 'items'} yet`}
                    description={`Create your first ${schema?.label?.toLowerCase() || 'item'}`}
                    action={<Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>Add New</Button>}
                  />
                </Card>
              )}
              {filteredItems.map((item: any, i: number) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-blue-500/30 transition-all group"
                >
                  {item.image && (
                    <img src={getMediaUrl(item.image)} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
                  {item.avatar && (
                    <img src={getMediaUrl(item.avatar)} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  )}
                  {item.logo && (
                    <img src={getMediaUrl(item.logo)} alt="" className="w-10 h-10 rounded-lg object-contain shrink-0" />
                  )}
                  {item.featuredImage && (
                    <img src={getMediaUrl(item.featuredImage)} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{getDisplayName(item)}</p>
                      {item.status && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.status === 'published' || item.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                          item.status === 'draft' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'
                        }`}>{item.status}</span>
                      )}
                      {item.rating && (
                        <span className="text-xs text-yellow-500">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
                      )}
                    </div>
                    {getDisplayPreview(item) && (
                      <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">{getDisplayPreview(item)}</p>
                    )}
                    {(item.category || item.company || item.location) && (
                      <div className="flex gap-2 mt-0.5">
                        {item.category && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{item.category}</span>}
                        {item.company && <span className="text-[10px] text-[var(--text-tertiary)]">{item.company}</span>}
                        {item.location && <span className="text-[10px] text-[var(--text-tertiary)]">{item.location}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(item)} />
                    <Button variant="ghost" size="sm" icon={<FiCopy />} onClick={() => { create(activeSchema, { ...item, id: undefined, createdAt: undefined, updatedAt: undefined }); loadItems() }} />
                    <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(item.id)} className="text-red-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingItem ? `Edit ${schema?.label}` : `New ${schema?.label}`} size="lg">
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          {groupedFields.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {groupedFields.map(g => (
                <button
                  key={g.key}
                  onClick={() => setActiveGroup(g.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    (activeGroup || groupedFields[0]?.key) === g.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
          {(activeGroup ? groupedFields.find(g => g.key === activeGroup)?.fields || [] : groupedFields[0]?.fields || []).map(field => (
            <div key={field.key}>{renderField(field)}</div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-[var(--border-primary)]">
          <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button variant="primary" icon={<FiSave />} onClick={handleSave}>{editingItem ? 'Update' : 'Create'}</Button>
        </div>
      </Modal>

      <Modal isOpen={mediaPickerOpen} onClose={() => setMediaPickerOpen(false)} title="Media Library" size="lg">
        <div className="grid grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto">
          {mediaItems.length === 0 && (
            <div className="col-span-4 text-center py-8">
              <p className="text-sm text-[var(--text-tertiary)]">No media uploaded yet.</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Upload media from the Media Manager.</p>
            </div>
          )}
          {mediaItems.map((m: any) => (
            <button
              key={m.id}
              type="button"
              onClick={() => selectMedia(m.url)}
              className="group p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-blue-500/30 transition-all text-left"
            >
              {(m.type === 'image' || m.type === 'icon') && (
                <img src={getMediaUrl(m.url)} alt={m.alt || m.name} className="w-full h-20 object-cover rounded-lg mb-1" />
              )}
              <p className="text-xs text-[var(--text-primary)] truncate">{m.name}</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">{m.type}</p>
            </button>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        title="Delete Item?"
        message="This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
