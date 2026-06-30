<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Tabs -->
    <div class="flex gap-1 overflow-x-auto border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'"
        class="px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Requests Tab -->
    <div v-if="activeTab === 'requests'" class="space-y-5">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Pending" :value="leaveStore.pendingCount" hint="Awaiting review" color="amber">
          <template #icon>
            <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </template>
        </StatCard>
        <StatCard label="Approved" :value="leaveStore.approvedCount" hint="This list" color="emerald">
          <template #icon>
            <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </template>
        </StatCard>
        <StatCard label="Rejected" :value="leaveStore.rejectedCount" hint="This list" color="red">
          <template #icon>
            <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </template>
        </StatCard>
        <StatCard label="Total Requests" :value="leaveStore.leaveRequests.length" hint="This list" color="blue">
          <template #icon>
            <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </template>
        </StatCard>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <select
          v-model="filterStatus"
          class="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm w-full sm:w-56"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          @click="showRequestModal = true"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Request Leave
        </button>
      </div>

      <!-- Error State -->
      <div v-if="leaveStore.error && !leaveStore.loading" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p class="text-red-700 font-semibold mb-1">Failed to load leave requests</p>
        <p class="text-red-500 text-sm mb-4">{{ leaveStore.error }}</p>
        <button @click="fetchRequests" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
          Retry
        </button>
      </div>

      <!-- Loading Skeleton -->
      <template v-else-if="leaveStore.loading">
        <div class="space-y-3">
          <div v-for="i in 6" :key="i" class="bg-white rounded-2xl p-4 animate-pulse border border-gray-100 flex items-center gap-4">
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
      <template v-else-if="filteredRequests.length === 0">
        <div class="text-center py-20">
          <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p class="text-gray-700 font-semibold text-lg mb-1">No leave requests found</p>
          <p class="text-gray-400 text-sm">{{ filterStatus ? `No ${filterStatus.toLowerCase()} requests` : 'Submit a leave request to get started' }}</p>
        </div>
      </template>

      <!-- Table -->
      <template v-else>
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Employee</th>
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Type</th>
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Dates</th>
                  <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Days</th>
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden lg:table-cell">Reason</th>
                  <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                  <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="req in filteredRequests" :key="req.id" class="hover:bg-blue-50/30 transition-colors">
                  <td class="px-5 py-3.5">
                    <NuxtLink :to="`/employees/${req.employeeId}`" class="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
                      {{ req.employeeName }}
                    </NuxtLink>
                  </td>
                  <td class="px-4 py-3.5 text-sm text-gray-600">{{ req.leaveTypeName }}</td>
                  <td class="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{{ format.date(req.startDate) }} - {{ format.date(req.endDate) }}</td>
                  <td class="px-4 py-3.5 text-sm text-gray-500 text-center">{{ req.totalDays }}</td>
                  <td class="px-4 py-3.5 text-sm text-gray-400 hidden lg:table-cell truncate max-w-xs">{{ req.reason || '-' }}</td>
                  <td class="px-4 py-3.5 text-center"><StatusBadge :status="req.status" /></td>
                  <td class="px-5 py-3.5 text-right">
                    <button
                      v-if="req.status === 'Pending'"
                      @click="openApproveModal(req)"
                      class="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Review
                    </button>
                    <span v-else class="text-xs text-gray-400">{{ req.approvalNote || '-' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- Types Tab -->
    <div v-else-if="activeTab === 'types'" class="space-y-5">
      <div class="flex justify-end">
        <button
          @click="showTypeModal = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Leave Type
        </button>
      </div>

      <template v-if="leaveStore.leaveTypes.length === 0">
        <div class="text-center py-20">
          <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-700 font-semibold text-lg mb-1">No leave types defined</p>
          <p class="text-gray-400 text-sm">Add a leave type to start tracking employee leave.</p>
        </div>
      </template>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="type in leaveStore.leaveTypes" :key="type.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <StatusBadge :status="type.isActive ? 'active' : 'inactive'" :label="type.isActive ? 'Active' : 'Inactive'" />
          </div>
          <p class="text-sm font-semibold text-gray-800">{{ type.name }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ type.maxDaysPerYear }} days / year</p>
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-3"
            :class="type.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'"
          >
            {{ type.isPaid ? 'Paid' : 'Unpaid' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Balances Tab -->
    <div v-else-if="activeTab === 'balances'" class="space-y-5">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="balanceEmployeeId"
          class="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm flex-1"
        >
          <option value="">Select an employee</option>
          <option v-for="emp in employeesStore.employees" :key="emp.id" :value="emp.id">{{ emp.fullName }} &mdash; {{ emp.employeeNo }}</option>
        </select>
        <select
          v-model.number="balanceYear"
          class="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm w-full sm:w-32"
        >
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <template v-if="!balanceEmployeeId">
        <div class="text-center py-20">
          <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-1.13a4 4 0 10-4-4 4 4 0 004 4zM9 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>
          <p class="text-gray-700 font-semibold text-lg mb-1">Select an employee</p>
          <p class="text-gray-400 text-sm">Choose an employee to view their leave balances.</p>
        </div>
      </template>

      <template v-else-if="leaveStore.loading">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-4 animate-pulse border border-gray-100 space-y-3">
            <div class="h-3.5 bg-gray-200 rounded w-1/2"></div>
            <div class="h-2 bg-gray-100 rounded-full"></div>
            <div class="h-3 bg-gray-100 rounded w-2/3"></div>
          </div>
        </div>
      </template>

      <template v-else-if="leaveStore.leaveBalances.length === 0">
        <div class="text-center py-20">
          <p class="text-gray-700 font-semibold text-lg mb-1">No balance records found</p>
          <p class="text-gray-400 text-sm">No leave balances for {{ balanceYear }}.</p>
        </div>
      </template>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="bal in leaveStore.leaveBalances" :key="bal.leaveTypeName" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p class="text-sm font-semibold text-gray-800">{{ bal.leaveTypeName }}</p>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              :style="{ width: `${bal.totalDays ? Math.min(100, (bal.usedDays / bal.totalDays) * 100) : 0}%` }"
            ></div>
          </div>
          <p class="text-xs text-gray-400 mt-2">{{ bal.usedDays }} used of {{ bal.totalDays }} &middot; {{ bal.remainingDays }} remaining</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <LeaveRequestFormModal v-if="showRequestModal" @close="showRequestModal = false" @success="handleRequestSuccess" />
    <LeaveTypeFormModal v-if="showTypeModal" @close="showTypeModal = false" @success="handleTypeSuccess" />
    <ApproveLeaveModal
      v-if="showApproveModal && reviewingRequest"
      :request="reviewingRequest"
      @close="showApproveModal = false"
      @success="handleApproveSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import LeaveRequestFormModal from '~/components/leave/LeaveRequestFormModal.vue'
import LeaveTypeFormModal from '~/components/leave/LeaveTypeFormModal.vue'
import ApproveLeaveModal from '~/components/leave/ApproveLeaveModal.vue'

definePageMeta({
  middleware: ['auth', 'hr-staff'],
  title: 'Leave Management',
  subtitle: 'Manage leave requests, types, and balances',
})

const leaveStore = useLeaveStore()
const employeesStore = useEmployeesStore()
const toast = useToast()
const format = useFormat()

const tabs = [
  { key: 'requests', label: 'Requests' },
  { key: 'types', label: 'Types' },
  { key: 'balances', label: 'Balances' },
]
const activeTab = ref('requests')

const filterStatus = ref('')
const showRequestModal = ref(false)
const showTypeModal = ref(false)
const showApproveModal = ref(false)
const reviewingRequest = ref(null)

const balanceEmployeeId = ref('')
const currentYear = new Date().getFullYear()
const balanceYear = ref(currentYear)
const yearOptions = [currentYear, currentYear - 1, currentYear - 2]

const filteredRequests = computed(() => {
  if (!filterStatus.value) return leaveStore.leaveRequests
  return leaveStore.leaveRequests.filter((r) => r.status === filterStatus.value)
})

const fetchRequests = () => {
  leaveStore.fetchLeaveRequests({ status: filterStatus.value || undefined })
}

watch(filterStatus, fetchRequests)

watch([balanceEmployeeId, balanceYear], () => {
  if (balanceEmployeeId.value) {
    leaveStore.fetchLeaveBalances(balanceEmployeeId.value, balanceYear.value)
  }
})

const openApproveModal = (req) => {
  reviewingRequest.value = req
  showApproveModal.value = true
}

const handleRequestSuccess = () => {
  toast.success('Leave request submitted successfully.')
}

const handleTypeSuccess = () => {
  toast.success('Leave type created successfully.')
}

const handleApproveSuccess = (status) => {
  toast.success(`Leave request ${status === 'Approved' ? 'approved' : 'rejected'} successfully.`)
}

onMounted(() => {
  leaveStore.fetchLeaveRequests()
  leaveStore.fetchLeaveTypes()
  if (!employeesStore.employees.length) employeesStore.fetchAll({ pageSize: 100 })
})
</script>
