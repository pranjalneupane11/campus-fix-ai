export const EQUIPMENT_TYPES = [
  { value: 'DESKTOP_COMPUTER', label: 'Desktop computer' },
  { value: 'PROJECTOR', label: 'Projector' },
  { value: 'MONITOR', label: 'Monitor' },
  { value: 'PRINTER', label: 'Printer' },
  { value: 'SMARTBOARD', label: 'Smartboard' },
  { value: 'NETWORK_WIFI', label: 'Network / Wi-Fi' },
  { value: 'OTHER', label: 'Other' },
]

export const CATEGORIES = [
  'Hardware',
  'Software',
  'Network',
  'Account/Access',
  'Classroom Technology',
  'Other',
]

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']

export const TICKET_STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']

export const EQUIPMENT_STATUSES = ['OPERATIONAL', 'ISSUE_REPORTED', 'UNDER_REPAIR']

export function formatEnumLabel(value) {
  if (!value) return '—'
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function formatEquipmentType(value) {
  const match = EQUIPMENT_TYPES.find((e) => e.value === value)
  return match ? match.label : formatEnumLabel(value)
}

export function formatDate(isoString) {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
