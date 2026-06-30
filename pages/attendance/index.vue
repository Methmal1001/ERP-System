<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatCard label="Present" :value="store.presentCount" hint="In selected range" color="emerald">
        <template #icon>
          <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Late" :value="store.lateCount" hint="In selected range" color="blue">
        <template #icon>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Absent" :value="store.absentCount" hint="In selected range" color="red">
        <template #icon>
          <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="On Leave" :value="store.onLeaveCount" hint="In selected range" color="amber">
        <template #icon>
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Total Hours" :value="format.number(store.totalWorkedHours)" hint="In selected range" color="purple">
        <template #icon>
          <svg class="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3 lg:items-end">
      <div class="flex-1 grid grid-cols-1 gap-3" :class="auth.isHrStaff ? 'sm:grid-cols-3' : 'sm:grid-cols-2'">
        <div v-if="auth.isHrStaff">
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Employee</label>
          <select
            v-model="filterEmployee"
            class="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
          >
            <option value="">All Employees</option>
            <option v-for="emp in employeesStore.employees" :key="emp.id" :value="emp.id">{{ emp.fullName }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">From</label>
          <input
            v-model="filterFrom"
            type="date"
            class="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">To</label>
          <input
            v-model="filterTo"
            type="date"
            class="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
          />
        </div>
      </div>

      <button
        @click="openMarkModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Mark Attendance
      </button>
    </div>

    <!-- Error State -->
    <div v-if="store.error && !store.loading" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="text-red-700 font-semibold mb-1">Failed to load attendance records</p>
      <p class="text-red-500 text-sm mb-4">{{ store.error }}</p>
      <button @click="fetchRecords" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <template v-else-if="store.loading">
      <div class="space-y-3">
        <div v-for="i in 8" :key="i" class="bg-white rounded-2xl p-4 animate-pulse border border-gray-100 flex items-center gap-4">
          <div class="w-9 h-9 bg-gray-200 rounded-xl"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3.5 bg-gray-200 rounded w-1/3"></div>
            <div class="h-3 bg-gray-100 rounded w-1/4"></div>
          </div>
          <div class="h-6 bg-gray-100 rounded-full w-20"></div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <template v-else-if="store.records.length === 0">
      <div class="text-center py-20">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <p class="text-gray-700 font-semibold text-lg mb-1">No attendance records found</p>
        <p class="text-gray-400 text-sm">Try adjusting the date range or employee filter.</p>
        <div class="flex gap-2 justify-center mt-5">
          <button @click="openMarkModal" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
            Mark Attendance
          </button>
        </div>
      </div>
    </template>

    <!-- Records Table -->
    <template v-else>
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Date</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Employee</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Check In</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Check Out</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Hours</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden lg:table-cell">Note</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Approval</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="rec in store.records" :key="rec.id" class="hover:bg-blue-50/30 transition-colors">
                <td class="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{{ format.date(rec.date) }}</td>
                <td class="px-4 py-3.5">
                  <NuxtLink :to="`/employees/${rec.employeeId}`" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    {{ rec.employeeName }}
                  </NuxtLink>
                </td>
                <td class="px-4 py-3.5 text-sm text-gray-500 text-center">{{ format.time(rec.checkInTime) }}</td>
                <td class="px-4 py-3.5 text-sm text-gray-500 text-center">{{ format.time(rec.checkOutTime) }}</td>
                <td class="px-4 py-3.5 text-sm text-gray-500 text-center">{{ rec.workedHours ?? '-' }}</td>
                <td class="px-4 py-3.5 text-sm text-gray-400 hidden lg:table-cell truncate max-w-xs">{{ rec.note || '-' }}</td>
                <td class="px-4 py-3.5 text-center"><StatusBadge :status="rec.status" /></td>
                <td class="px-5 py-3.5 text-center">
                  <StatusBadge :status="rec.approvalStatus" />
                  <p v-if="rec.approvalStatus !== 'Pending' && rec.approvedByName" class="text-[11px] text-gray-400 mt-1">
                    by {{ rec.approvedByName }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- My Leave Requests -->
    <div v-if="!auth.isHrStaff" class="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="px-5 py-3.5 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-gray-900">My Leave Requests</h2>
      </div>
      <div v-if="!myLeaveRequests.length" class="px-5 py-8 text-center text-sm text-gray-400">
        No leave requests yet.
      </div>
      <div v-else class="divide-y divide-gray-50">
        <div v-for="lr in myLeaveRequests" :key="lr.id" class="px-5 py-3.5 flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-gray-800">{{ lr.leaveTypeName }}</p>
            <p class="text-xs text-gray-400">{{ format.date(lr.startDate) }} - {{ format.date(lr.endDate) }} &middot; {{ lr.totalDays }} day(s)</p>
          </div>
          <StatusBadge :status="lr.status" />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <MarkAttendanceModal
      v-if="showMarkModal"
      :default-date="filterTo"
      @close="showMarkModal = false"
      @success="handleMarkSuccess"
    />
    <SelfServiceModal
      v-if="showSelfServiceModal"
      @close="showSelfServiceModal = false"
      @success="handleSelfServiceSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import MarkAttendanceModal from '~/components/attendance/MarkAttendanceModal.vue'
import SelfServiceModal from '~/components/attendance/SelfServiceModal.vue'

definePageMeta({
  middleware: 'auth',
  title: 'Attendance',
  subtitle: 'Track and manage employee attendance records',
})

const store = useAttendanceStore()
const employeesStore = useEmployeesStore()
const leaveStore = useLeaveStore()
const auth = useAuthStore()
const toast = useToast()
const format = useFormat()

const today = new Date()
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

const filterEmployee = ref('')
const filterFrom = ref(firstOfMonth.toISOString().slice(0, 10))
const filterTo = ref(today.toISOString().slice(0, 10))

const showMarkModal = ref(false)
const showSelfServiceModal = ref(false)

const myLeaveRequests = computed(() => leaveStore.leaveRequests)

const fetchRecords = () => {
  if (!auth.isHrStaff && !auth.user?.employeeId) return
  store.fetchAll({
    employeeId: auth.isHrStaff ? (filterEmployee.value || undefined) : auth.user.employeeId,
    from: filterFrom.value || undefined,
    to: filterTo.value || undefined,
  })
}

watch([filterEmployee, filterFrom, filterTo], fetchRecords)

const openMarkModal = () => {
  if (auth.isHrStaff) {
    showMarkModal.value = true
  } else {
    showSelfServiceModal.value = true
  }
}

const handleMarkSuccess = () => {
  toast.success('Attendance recorded successfully.')
  fetchRecords()
}

const handleSelfServiceSuccess = (payload) => {
  toast.success(payload?.message || 'Submitted successfully.')
  fetchRecords()
  if (auth.user?.employeeId) leaveStore.fetchLeaveRequests({ employeeId: auth.user.employeeId })
}

onMounted(() => {
  fetchRecords()
  if (auth.isHrStaff && !employeesStore.employees.length) employeesStore.fetchAll({ pageSize: 100 })
  if (!auth.isHrStaff && auth.user?.employeeId) leaveStore.fetchLeaveRequests({ employeeId: auth.user.employeeId })
})
</script>
