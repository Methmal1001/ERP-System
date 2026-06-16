import type { ChatHistoryEntry, ChatMessage } from '~/types/chatbot'

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function useChat() {
  const history = ref<ChatHistoryEntry[]>([])
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let errorTimer: ReturnType<typeof setTimeout> | null = null

  function setError(msg: string) {
    error.value = msg
    if (errorTimer) clearTimeout(errorTimer)
    errorTimer = setTimeout(() => { error.value = null }, 4000)
  }

  function getToken(): string | null {
    try {
      const auth = useAuthStore()
      return auth.accessToken ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null)
    } catch {
      return typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
    }
  }

  async function sendMessage(text: string): Promise<void> {
    const trimmed = text.trim()
    if (!trimmed || isLoading.value) return

    const token = getToken()
    if (!token) {
      messages.value.push({
        id: generateId(),
        role: 'bot',
        content: 'Please log in to use the assistant.',
        timestamp: new Date(),
      })
      return
    }

    messages.value.push({
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    })
    history.value.push({ role: 'user', content: trimmed })

    isLoading.value = true
    error.value = null

    // Send last 20 turns before the current user message
    const historyPayload = history.value.slice(-21, -1)

    try {
      const response = await fetch('/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmed, history: historyPayload }),
      })

      const contentType = response.headers.get('content-type') ?? ''

      if (contentType.includes('text/csv')) {
        const blob = await response.blob()
        const disposition = response.headers.get('content-disposition') ?? ''
        const match = disposition.match(/filename[^;=\n]*=(['"]?)([^;\n'"]+)\1/)
        const fileName = match ? match[2].trim() : 'download.csv'

        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = fileName
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(url)

        const reply = `File downloaded: **${fileName}**`
        messages.value.push({
          id: generateId(),
          role: 'bot',
          content: reply,
          timestamp: new Date(),
          isFile: true,
          fileName,
        })
        history.value.push({ role: 'model', content: `File downloaded: ${fileName}` })

      } else {
        const data = await response.json()

        if (!response.ok || !data.isSuccess) {
          throw new Error(data?.message || `Request failed (${response.status})`)
        }

        const reply: string = data.data?.reply ?? ''
        messages.value.push({
          id: generateId(),
          role: 'bot',
          content: reply,
          timestamp: new Date(),
        })
        history.value.push({ role: 'model', content: reply })
      }
    } catch (err: any) {
      // Remove the user turn from history so it doesn't pollute future sends
      history.value.pop()
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  function clearHistory(): void {
    history.value = []
    messages.value = []
    error.value = null
    if (errorTimer) clearTimeout(errorTimer)
  }

  return { history, messages, isLoading, error, sendMessage, clearHistory }
}
