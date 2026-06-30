<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard label="Pending Attendance" :value="attendanceStore.pendingApprovals.length" hint="Awaiting your decision" color="amber">
        <template #icon>
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Pending Leave" :value="leaveStore.pendingApprovals.length" hint="Awaiting your decision" color="blue">
        <template #icon>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Pending Attendance -->
    <div class="space-y-3">
      <h2 class="text-sm font-semibold text-gray-900">Pending Attendance</h2>

      <div v-if="attendanceStore.error && !attendanceStore.approvalsLoading" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p class="text-red-700 font-semibold mb-1">Failed to load pending approvals</p>
        <p class="text-red-500 text-sm mb-4">{{ attendanceStore.error }}</p>
        <button @click="attendanceStore.fetchPendingApprovals()" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
          Retry
        </button>
      </div>

      <template v-else-if="attendanceStore.approvalsLoading">
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
        </div>
      </template>

      <div v-else-if="attendanceStore.pendingApprovals.length === 0" class="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center text-sm text-gray-400">
        No pending attendance approvals.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="rec in attendanceStore.pendingApprovals"
          :key="rec.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-sm font-semibold text-gray-800">{{ rec.employeeName }}</p>
              <StatusBadge :status="rec.status" />
            </div>
            <p class="text-xs text-gray-400 mt-1">
              {{ format.date(rec.date) }} &middot; In {{ format.time(rec.checkInTime) }} &middot; Out {{ format.time(rec.checkOutTime) }}
              <span v-if="rec.workedHours"> &middot; {{ rec.workedHours }}h</span>
            </p>
            <p v-if="rec.note" class="text-xs text-gray-400 mt-1 italic">"{{ rec.note }}"</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="openReject('attendance', rec)" class="px-3.5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
              Reject
            </button>
            <button @click="openApprove('attendance', rec)" class="px-3.5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Leave -->
    <div class="space-y-3">
      <h2 class="text-sm font-semibold text-gray-900">Pending Leave Requests</h2>

      <div v-if="leaveStore.error && !leaveStore.approvalsLoading" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p class="text-red-700 font-semibold mb-1">Failed to load pending leave approvals</p>
        <p class="text-red-500 text-sm mb-4">{{ leaveStore.error }}</p>
        <button @click="leaveStore.fetchPendingApprovals()" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
          Retry
        </button>
      </div>

      <template v-else-if="leaveStore.approvalsLoading">
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
        </div>
      </template>

      <div v-else-if="leaveStore.pendingApprovals.length === 0" class="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center text-sm text-gray-400">
        No pending leave approvals.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="lr in leaveStore.pendingApprovals"
          :key="lr.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-sm font-semibold text-gray-800">{{ lr.employeeName }}</p>
              <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-semibold">{{ lr.leaveTypeName }}</span>
            </div>
            <p class="text-xs text-gray-400 mt-1">
              {{ format.date(lr.startDate) }} - {{ format.date(lr.endDate) }} &middot; {{ lr.totalDays }} day(s)
            </p>
            <p v-if="lr.reason" class="text-xs text-gray-400 mt-1 italic">"{{ lr.reason }}"</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="openReject('leave', lr)" class="px-3.5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
              Reject
            </button>
            <button @click="openApprove('leave', lr)" class="px-3.5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Confirm -->
    <ConfirmModal
      v-if="showApproveModal && actingRecord"
      :title="actingKind === 'attendance' ? 'Approve Attendance' : 'Approve Leave Request'"
      subtitle="Confirm this request"
      tone="info"
      confirm-text="Approve"
      loading-text="Approving..."
      :loading="actionLoading"
      :error="actionError"
      @close="showApproveModal = false"
      @confirm="confirmApprove"
    >
      <template v-if="actingKind === 'attendance'">
        Approve <strong>{{ actingRecord.employeeName }}</strong>'s attendance for {{ format.date(actingRecord.date) }}?
      </template>
      <template v-else>
        Approve <strong>{{ actingRecord.employeeName }}</strong>'s {{ actingRecord.leaveTypeName }} request ({{ actingRecord.totalDays }} day(s))?
      </template>
    </ConfirmModal>

    <!-- Reject Confirm -->
    <ConfirmModal
      v-if="showRejectModal && actingRecord"
      :title="actingKind === 'attendance' ? 'Reject Attendance' : 'Reject Leave Request'"
      subtitle="Provide a reason for the employee"
      tone="danger"
      confirm-text="Reject"
      loading-text="Rejecting..."
      :loading="actionLoading"
      :error="actionError"
      @close="showRejectModal = false"
      @confirm="confirmReject"
    >
      <p class="mb-2">
        <template v-if="actingKind === 'attendance'">
          Reject <strong>{{ actingRecord.employeeName }}</strong>'s attendance for {{ format.date(actingRecord.date) }}?
        </template>
        <template v-else>
          Reject <strong>{{ actingRecord.employeeName }}</strong>'s {{ actingRecord.leaveTypeName }} request?
        </template>
      </p>
      <textarea
        v-model="rejectReason"
        rows="2"
        placeholder="Reason for rejection..."
        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-colors resize-none bg-white"
      ></textarea>
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'

definePageMeta({
  middleware: ['auth', 'manager-access'],
  title: 'Team Approvals',
  subtitle: "Review and approve your direct reports' attendance and leave",
})

const attendanceStore = useAttendanceStore()
const leaveStore = useLeaveStore()
const format = useFormat()
const toast = useToast()

const showApproveModal = ref(false)
const showRejectModal = ref(false)
const actingKind = ref('attendance')
const actingRecord = ref(null)
const actionLoading = ref(false)
const actionError = ref('')
const rejectReason = ref('')

const storeFor = (kind) => (kind === 'attendance' ? attendanceStore : leaveStore)

const openApprove = (kind, rec) => {
  actingKind.value = kind
  actingRecord.value = rec
  actionError.value = ''
  showApproveModal.value = true
}

const openReject = (kind, rec) => {
  actingKind.value = kind
  actingRecord.value = rec
  actionError.value = ''
  rejectReason.value = ''
  showRejectModal.value = true
}

const confirmApprove = async () => {
  if (!actingRecord.value) return
  actionLoading.value = true
  actionError.value = ''
  const result = await storeFor(actingKind.value).approve(actingRecord.value.id)
  actionLoading.value = false
  if (result.success) {
    showApproveModal.value = false
    toast.success(actingKind.value === 'attendance' ? 'Attendance approved.' : 'Leave request approved.')
  } else {
    actionError.value = result.error
  }
}

const confirmReject = async () => {
  if (!actingRecord.value) return
  actionLoading.value = true
  actionError.value = ''
  const result = await storeFor(actingKind.value).reject(actingRecord.value.id, rejectReason.value.trim())
  actionLoading.value = false
  if (result.success) {
    showRejectModal.value = false
    toast.success(actingKind.value === 'attendance' ? 'Attendance rejected.' : 'Leave request rejected.')
  } else {
    actionError.value = result.error
  }
}

onMounted(() => {
  attendanceStore.fetchPendingApprovals()
  leaveStore.fetchPendingApprovals()
})
</script>
