<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6 pb-4">
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                :class="tone === 'danger' ? 'bg-red-100' : 'bg-blue-100'"
              >
                <svg
                  v-if="tone === 'danger'"
                  class="w-6 h-6 text-red-600"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6 text-blue-600"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ title }}</h2>
                <p class="text-sm text-gray-400 mt-0.5">{{ subtitle }}</p>
              </div>
            </div>

            <div
              class="mt-4 rounded-xl p-3.5 text-sm leading-relaxed"
              :class="tone === 'danger' ? 'bg-red-50 border border-red-100 text-gray-600' : 'bg-blue-50 border border-blue-100 text-gray-600'"
            >
              <slot>{{ message }}</slot>
            </div>

            <div v-if="error" class="mt-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2">
              {{ error }}
            </div>
          </div>

          <div class="px-6 pb-6 flex gap-3">
            <button
              @click="$emit('close')"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              {{ cancelText }}
            </button>
            <button
              @click="$emit('confirm')"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              :class="tone === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading ? loadingText : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  message: { type: String, default: '' },
  tone: { type: String, default: 'danger' }, // 'danger' | 'info'
  confirmText: { type: String, default: 'Confirm' },
  loadingText: { type: String, default: 'Processing...' },
  cancelText: { type: String, default: 'Cancel' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

defineEmits(['close', 'confirm'])
</script>
