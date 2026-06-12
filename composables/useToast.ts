export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

export const useToast = () => {
  const toasts = useState<ToastItem[]>('app-toasts', () => [])

  const push = (message: string, type: ToastType = 'success', timeout = 3500) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), timeout)
  }

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    success: (msg: string) => push(msg, 'success'),
    error: (msg: string) => push(msg, 'error'),
    info: (msg: string) => push(msg, 'info'),
    warning: (msg: string) => push(msg, 'warning'),
    dismiss,
  }
}
