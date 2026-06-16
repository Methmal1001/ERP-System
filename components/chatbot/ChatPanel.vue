<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 flex-shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.594.264M14.25 3.104c.251.023.501.05.75.082M19.5 14.5l-4.091-4.091a2.25 2.25 0 00-1.659-.659H10.25" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-white leading-tight">ERP Assistant</p>
          <span class="inline-block text-[10px] font-medium text-indigo-200 bg-white/15 px-1.5 py-0.5 rounded-full leading-none mt-0.5">Read-only</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button
          @click="$emit('clear')"
          title="Clear conversation"
          class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
        </button>
        <button
          @click="$emit('close')"
          title="Close"
          class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <Transition name="error-banner">
      <div
        v-if="error"
        class="flex items-center gap-2 px-4 py-2.5 bg-red-50 border-b border-red-200 text-red-700 text-xs flex-shrink-0"
      >
        <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ error }}
      </div>
    </Transition>

    <!-- Messages -->
    <div ref="messageListRef" class="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50 min-h-0">
      <!-- Empty state with suggestion chips -->
      <div v-if="messages.length === 0 && !isLoading" class="flex flex-col items-center justify-center h-full text-center pb-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
          <svg class="w-7 h-7 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-700 mb-1">Ask me anything</p>
        <p class="text-xs text-gray-400 mb-5 max-w-[200px]">I have read-only access to employees, leave, payroll, and more.</p>
        <div class="flex flex-col gap-2 w-full max-w-xs">
          <button
            v-for="chip in suggestions"
            :key="chip"
            @click="$emit('send', chip)"
            class="text-xs px-3.5 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-left shadow-sm"
          >
            {{ chip }}
          </button>
        </div>
      </div>

      <!-- Message list -->
      <template v-else>
        <ChatMessageBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
        />

        <!-- Typing indicator -->
        <div v-if="isLoading" class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.594.264M14.25 3.104c.251.023.501.05.75.082" />
            </svg>
          </div>
          <div class="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-3.5 py-2.5">
            <TypingIndicator />
          </div>
        </div>

        <div ref="messagesEndRef"></div>
      </template>
    </div>

    <!-- Input Area -->
    <div class="flex-shrink-0 border-t border-gray-100 bg-white px-3 py-3">
      <div class="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          @keydown="handleKeydown"
          @input="adjustHeight"
          :disabled="isLoading"
          placeholder="Ask about employees, leave, payroll…"
          rows="1"
          maxlength="2000"
          class="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed py-0.5 max-h-24 disabled:opacity-60"
        ></textarea>
        <div class="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            v-if="inputText.length > 1800"
            class="text-[10px]"
            :class="inputText.length >= 2000 ? 'text-red-500' : 'text-gray-400'"
          >{{ inputText.length }}/2000</span>
          <button
            @click="handleSend"
            :disabled="!inputText.trim() || isLoading"
            class="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { ChatMessage } from '~/types/chatbot'
import ChatMessageBubble from './ChatMessage.vue'
import TypingIndicator from './TypingIndicator.vue'

const props = defineProps<{
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  send: [text: string]
  clear: []
  close: []
}>()

const suggestions = [
  'How many employees do we have?',
  'Show pending leave requests',
  'Export all employees as CSV',
  'What are our departments?',
]

const inputText = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const messagesEndRef = ref<HTMLElement | null>(null)

function adjustHeight() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 96) + 'px'
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function handleSend() {
  const text = inputText.value.trim()
  if (!text || props.isLoading) return
  emit('send', text)
  inputText.value = ''
  nextTick(() => {
    const el = textareaRef.value
    if (el) el.style.height = 'auto'
  })
}

async function scrollToBottom() {
  await nextTick()
  messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
}

watch(() => props.messages.length, scrollToBottom)
watch(() => props.isLoading, scrollToBottom)
</script>

<style scoped>
.error-banner-enter-active,
.error-banner-leave-active {
  transition: all 0.2s ease;
}
.error-banner-enter-from,
.error-banner-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.error-banner-enter-to,
.error-banner-leave-from {
  opacity: 1;
  max-height: 40px;
}
</style>
