<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
    <p class="text-sm text-gray-400">
      Page <span class="font-semibold text-gray-600">{{ page }}</span> of
      <span class="font-semibold text-gray-600">{{ totalPages }}</span>
      <template v-if="totalCount !== null">
        — <span class="font-semibold text-gray-600">{{ totalCount }}</span> total
      </template>
    </p>
    <div class="flex gap-1.5">
      <button
        @click="$emit('change', page - 1)"
        :disabled="page === 1 || loading"
        class="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        ← Prev
      </button>
      <button
        v-for="p in pages"
        :key="p"
        @click="$emit('change', p)"
        :class="p === page
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
        class="w-9 h-9 text-sm border rounded-xl transition-colors"
      >
        {{ p }}
      </button>
      <button
        @click="$emit('change', page + 1)"
        :disabled="page === totalPages || loading"
        class="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalCount: { type: Number, default: null },
  loading: { type: Boolean, default: false },
})

defineEmits(['change'])

const pages = computed(() => {
  const total = props.totalPages
  const cur = props.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const start = Math.max(1, cur - 2)
  const end = Math.min(total, cur + 2)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>
