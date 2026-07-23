export interface Storable {
  id: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 12)
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getCollection<T extends Storable>(name: string): T[] {
  try {
    const data = localStorage.getItem(`ab_${name}`)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCollection<T>(name: string, data: T[]): void {
  localStorage.setItem(`ab_${name}`, JSON.stringify(data))
}

function getById<T extends Storable>(name: string, id: string): T | undefined {
  const items = getCollection<T>(name)
  return items.find(item => item.id === id)
}

function create<T extends Storable>(name: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
  const items = getCollection<T>(name)
  const now = new Date().toISOString()
  const newItem = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  } as unknown as T
  items.push(newItem)
  saveCollection(name, items)
  return newItem
}

function update<T extends Storable>(name: string, id: string, data: Partial<T>): T | undefined {
  const items = getCollection<T>(name)
  const index = items.findIndex(item => item.id === id)
  if (index === -1) return undefined
  items[index] = {
    ...items[index],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  }
  saveCollection(name, items)
  return items[index]
}

function del<T extends Storable>(name: string, id: string): boolean {
  const items = getCollection<T>(name)
  const filtered = items.filter(item => item.id !== id)
  if (filtered.length === items.length) return false
  saveCollection(name, filtered)
  return true
}

function query<T extends Storable>(name: string, predicate: (item: T) => boolean): T[] {
  return getCollection<T>(name).filter(predicate)
}

function hasCollection(name: string): boolean {
  const data = localStorage.getItem(`ab_${name}`)
  if (!data) return false
  try {
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) && parsed.length > 0
  } catch {
    return false
  }
}

const remove = del

export {
  getCollection,
  getById,
  create,
  update,
  del as delete,
  remove,
  query,
  generateId,
  formatDate,
  formatCurrency,
  hasCollection,
}

export const store = {
  getCollection,
  getById,
  create,
  update,
  delete: del,
  query,
  generateId,
  formatDate,
  formatCurrency,
  hasCollection,
}
