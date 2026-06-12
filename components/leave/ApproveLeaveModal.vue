<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Review Leave Request</h2>
              <p class="text-sm text-gray-400 mt-0.5">{{ request.employeeName }}</p>
            </div>
            <button type="button" @click="$emit('close')" :disabled="loading" class="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-4">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {{ error }}
            </div>

            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400 uppercase tracking-wide">Leave Type</span>
                <span class="text-sm font-semibold text-gray-800">{{ request.leaveTypeName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400 uppercase tracking-wide">Dates</span>
                <span class="text-sm font-semibold text-gray-800">{{ format.date(request.startDate) }} - {{ format.date(request.endDate) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400 uppercase tracking-wide">Total Days</span>
                <span class="text-sm font-semibold text-gray-800">{{ request.totalDays }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400 uppercase tracking-wide">Current Status</span>
                <StatusBadge :status="request.status" />
              </div>
              <div v-if="request.reason">
                <span class="text-xs text-gray-400 uppercase tracking-wide block mb-1">Reason</span>
                <p class="text-sm text-gray-600">{{ request.reason }}</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Approval Note</label>
              <textarea
                v-model="approvalNote"
                rows="3"
                placeholder="Optional note for the employee..."
                class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              @click="handleDecision('Rejected')"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg v-if="loading && pendingDecision === 'Rejected'" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Reject
            </button>
            <button
              type="button"
              @click="handleDecision('Approved')"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg v-if="loading && pendingDecision === 'Approved'" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Approve
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
  request: { type: Object, required: true },
})
const emit = defineEmits(['close', 'success'])

const leaveStore = useLeaveStore()
const auth = useAuthStore()
const format = useFormat()

const loading = ref(false)
const error = ref('')
const approvalNote = ref('')
const pendingDecision = ref('')

const handleDecision = async (status) => {
  error.value = ''
  loading.value = true
  pendingDecision.value = status

  const result = await leaveStore.approveLeaveRequest({
    leaveRequestId: props.request.id,
    approvedById: auth.user?.id,
    status,
    approvalNote: approvalNote.value.trim() || undefined,
  })

  loading.value = false

  if (result.success) {
    emit('success', status)
    emit('close')
  } else {
    error.value = result.error
  }
}
</script>
