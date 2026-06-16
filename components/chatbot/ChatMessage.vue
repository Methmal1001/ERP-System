<template>
  <div class="flex gap-2.5" :class="isUser ? 'flex-row-reverse' : 'flex-row'">
    <!-- Bot avatar -->
    <div
      v-if="!isUser"
      class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm"
    >
      <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.594.264M14.25 3.104c.251.023.501.05.75.082M19.5 14.5l-4.091-4.091a2.25 2.25 0 00-1.659-.659H10.25M19.5 14.5A2.25 2.25 0 0121.75 12V9a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 9v3c0 1.243 1.007 2.25 2.25 2.25h15z" />
      </svg>
    </div>

    <div class="flex flex-col max-w-[78%]" :class="isUser ? 'items-end' : 'items-start'">
      <!-- File download message -->
      <div
        v-if="message.isFile"
        class="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-sm bg-emerald-50 border border-emerald-200 text-emerald-800"
        :class="isUser ? 'rounded-br-sm' : 'rounded-bl-sm'"
      >
        <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Downloaded <strong>{{ message.fileName }}</strong></span>
      </div>

      <!-- Text / Markdown message -->
      <div
        v-else
        class="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
        :class="isUser
          ? 'bg-indigo-600 text-white rounded-br-sm'
          : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'"
      >
        <span v-if="isUser" class="whitespace-pre-wrap break-words">{{ message.content }}</span>
        <div v-else class="md-body" v-html="renderedMarkdown"></div>
      </div>

      <span class="text-[10px] text-gray-400 mt-1 px-0.5">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import type { ChatMessage } from '~/types/chatbot'

marked.use({ breaks: true, gfm: true })

const props = defineProps<{ message: ChatMessage }>()

const isUser = computed(() => props.message.role === 'user')

const renderedMarkdown = computed(() => {
  if (isUser.value) return ''
  const raw = marked.parse(props.message.content)
  return typeof raw === 'string' ? raw : ''
})

const formattedTime = computed(() => {
  const d = props.message.timestamp
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
})
</script>

<style scoped>
.md-body :deep(p) {
  margin: 0 0 0.5rem 0;
}
.md-body :deep(p:last-child) {
  margin-bottom: 0;
}
.md-body :deep(h1),
.md-body :deep(h2),
.md-body :deep(h3) {
  font-weight: 700;
  margin: 0.75rem 0 0.35rem 0;
  line-height: 1.3;
}
.md-body :deep(h1) { font-size: 1.1rem; }
.md-body :deep(h2) { font-size: 1rem; }
.md-body :deep(h3) { font-size: 0.9375rem; }
.md-body :deep(ul),
.md-body :deep(ol) {
  padding-left: 1.25rem;
  margin: 0.35rem 0 0.5rem 0;
}
.md-body :deep(ul) { list-style-type: disc; }
.md-body :deep(ol) { list-style-type: decimal; }
.md-body :deep(li) {
  margin-bottom: 0.2rem;
  line-height: 1.5;
}
.md-body :deep(strong) { font-weight: 700; }
.md-body :deep(em) { font-style: italic; }
.md-body :deep(code) {
  background: rgb(243 244 246);
  padding: 0.1rem 0.35rem;
  border-radius: 0.3rem;
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
  color: rgb(79 70 229);
}
.md-body :deep(pre) {
  background: rgb(17 24 39);
  color: rgb(229 231 235);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
  font-size: 0.8rem;
  line-height: 1.6;
}
.md-body :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: inherit;
}
.md-body :deep(blockquote) {
  border-left: 3px solid rgb(199 210 254);
  padding-left: 0.75rem;
  margin: 0.4rem 0;
  color: rgb(107 114 128);
  font-style: italic;
}
.md-body :deep(hr) {
  border: none;
  border-top: 1px solid rgb(229 231 235);
  margin: 0.5rem 0;
}
.md-body :deep(a) {
  color: rgb(79 70 229);
  text-decoration: underline;
}
.md-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  margin: 0.5rem 0;
}
.md-body :deep(th),
.md-body :deep(td) {
  padding: 0.3rem 0.6rem;
  border: 1px solid rgb(229 231 235);
  text-align: left;
}
.md-body :deep(th) {
  background: rgb(243 244 246);
  font-weight: 600;
}
</style>
