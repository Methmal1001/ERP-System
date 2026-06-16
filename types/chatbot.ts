export interface ChatHistoryEntry {
  role: 'user' | 'model'
  content: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
  isFile?: boolean
  fileName?: string
}
