export const useFormat = () => {
  const currency = (value?: number | null) => {
    const amount = value ?? 0
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const number = (value?: number | null) => {
    return new Intl.NumberFormat('en-US').format(value ?? 0)
  }

  const date = (value?: string | null) => {
    if (!value) return '-'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const dateTime = (value?: string | null) => {
    if (!value) return '-'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const time = (value?: string | null) => {
    if (!value) return '-'
    const d = value.includes('T') || value.includes('-') ? new Date(value) : new Date(`1970-01-01T${value}`)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return { currency, number, date, dateTime, time }
}
