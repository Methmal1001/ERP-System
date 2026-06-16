<template>
  <!-- Floating widget root -->
  <div class="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">
    <!-- Chat panel -->
    <Transition name="chat-panel">
      <div
        v-show="isOpen"
        class="chat-panel-wrapper overflow-hidden rounded-2xl border border-gray-200 shadow-2xl bg-white"
        :class="isOpen ? 'pointer-events-auto' : 'pointer-events-none'"
      >
        <ChatPanel
          :messages="messages"
          :is-loading="isLoading"
          :error="error"
          @send="sendMessage"
          @clear="clearHistory"
          @close="isOpen = false"
        />
      </div>
    </Transition>

    <!-- Toggle button -->
    <div class="relative">
      <!-- Pulse ring (only when panel is closed) -->
      <div
        v-if="!isOpen"
        class="absolute inset-0 rounded-full bg-indigo-500 opacity-50 animate-ping"
      ></div>
      <button
        @click="isOpen = !isOpen"
        :title="isOpen ? 'Close assistant' : 'Open ERP Assistant'"
        class="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center"
      >
        <!-- Chat icon when closed -->
        <Transition name="icon-swap" mode="out-in">
          <svg v-if="!isOpen" key="open" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          <!-- X icon when open -->
          <svg v-else key="close" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Transition>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatPanel from './ChatPanel.vue'

const isOpen = ref(false)
const { messages, isLoading, error, sendMessage, clearHistory } = useChat()
</script>

<style scoped>
/* Panel enter/leave animation */
.chat-panel-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.chat-panel-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

/* Icon swap */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.7) rotate(15deg);
}

/* Panel size: desktop fixed, mobile full-screen */
.chat-panel-wrapper {
  width: 420px;
  height: 600px;
}

@media (max-width: 639px) {
  .chat-panel-wrapper {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
  }
}
</style>
