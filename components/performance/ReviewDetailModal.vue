<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ review.employeeName }}</h2>
              <p class="text-sm text-gray-400 mt-0.5">{{ review.period }} &middot; Reviewed by {{ review.reviewerName }}</p>
            </div>
            <button type="button" @click="$emit('close')" :disabled="loading" class="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {{ error }}
            </div>

            <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div class="flex items-center gap-1">
                <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= review.rating ? 'text-amber-400' : 'text-gray-200'" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.52-4.674z" />
                </svg>
                <span class="text-sm font-semibold text-gray-700 ml-1">{{ review.rating }} / 5</span>
              </div>
              <StatusBadge :status="review.status" />
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-xs text-gray-400 uppercase tracking-wide block mb-1">Review Date</span>
                <span class="font-medium text-gray-800">{{ format.date(review.reviewDate) }}</span>
              </div>
              <div>
                <span class="text-xs text-gray-400 uppercase tracking-wide block mb-1">Period</span>
                <span class="font-medium text-gray-800">{{ review.period }}</span>
              </div>
            </div>

            <div v-if="review.strengths">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Strengths</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ review.strengths }}</p>
            </div>
            <div v-if="review.improvements">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Areas for Improvement</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ review.improvements }}</p>
            </div>
            <div v-if="review.goals">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Goals</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ review.goals }}</p>
            </div>
            <div v-if="review.comments">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Comments</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ review.comments }}</p>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              @click="$emit('close')"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Close
            </button>
            <button
              v-if="review.status === 'Draft'"
              @click="advance('Submitted')"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Submit for Acknowledgement
            </button>
            <button
              v-else-if="review.status === 'Submitted'"
              @click="advance('Acknowledged')"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'

const props = defineProps({
  review: { type: Object, required: true },
})
const emit = defineEmits(['close', 'success'])

const performanceStore = usePerformanceStore()
const format = useFormat()

const loading = ref(false)
const error = ref('')

const advance = async (status) => {
  error.value = ''
  loading.value = true
  const result = await performanceStore.updateStatus(props.review.id, status)
  loading.value = false
  if (result.success) {
    emit('success', status)
    emit('close')
  } else {
    error.value = result.error
  }
}
</script>
