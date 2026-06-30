<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-6">
    <!-- Welcome banner -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
      <div class="absolute -right-8 -top-12 w-48 h-48 bg-white/10 rounded-full"></div>
      <div class="absolute right-16 -bottom-16 w-32 h-32 bg-white/10 rounded-full"></div>
      <div class="relative">
        <h1 class="text-2xl sm:text-3xl font-bold">Welcome back, {{ firstName }}</h1>
        <p class="text-blue-100 mt-1.5 text-sm sm:text-base">{{ todayLabel }} &middot; Here's what's happening across your organization today.</p>
      </div>
    </div>

    <!-- Stat cards -->
    <div v-if="visibleStatCards.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard v-if="canViewEmployees" label="Employees" :value="format.number(employeesStore.totalCount)" hint="Total headcount" color="blue">
        <template #icon>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-1.13a4 4 0 10-4-4 4 4 0 004 4zM9 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </template>
      </StatCard>

      <StatCard v-if="canViewDepartments" label="Departments" :value="departmentsStore.departments.length" :hint="`${departmentsStore.activeCount} active`" color="indigo">
        <template #icon>
          <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M5 21V5a1 1 0 011-1h5a1 1 0 011 1v16M13 21V9a1 1 0 011-1h5a1 1 0 011 1v12M9 7h0M9 11h0M9 15h0" />
          </svg>
        </template>
      </StatCard>

      <StatCard v-if="canViewLeave" label="Pending Leave" :value="format.number(leaveStore.pendingCount)" hint="Awaiting approval" color="red">
        <template #icon>
          <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
          </svg>
        </template>
      </StatCard>

      <StatCard v-if="canViewAttendance" label="Present Today" :value="format.number(attendanceStore.presentCount)" :hint="todayLabelShort" color="emerald">
        <template #icon>
          <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
          </svg>
        </template>
      </StatCard>

      <StatCard v-if="canViewPayroll" label="Payroll (Net)" :value="format.currency(payrollStore.totalNet)" :hint="currentMonthLabel" color="purple">
        <template #icon>
          <svg class="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6v0M18 18v0" />
          </svg>
        </template>
      </StatCard>

      <StatCard v-if="canViewPerformance" label="Avg. Rating" :value="performanceStore.averageRating ? `${performanceStore.averageRating} / 5` : '—'" hint="Performance reviews" color="amber">
        <template #icon>
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.52-4.674z" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Main grid -->
    <div v-if="canViewDepartments || canViewLeave" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Department breakdown -->
      <div v-if="canViewDepartments" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" :class="canViewLeave ? 'lg:col-span-1' : 'lg:col-span-3'">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900">Department Breakdown</h2>
          <NuxtLink to="/departments" class="text-xs font-medium text-blue-600 hover:text-blue-700">View all</NuxtLink>
        </div>

        <div v-if="departmentsStore.loading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        <div v-else-if="!topDepartments.length" class="text-sm text-gray-400 text-center py-8">No departments yet.</div>
        <div v-else class="space-y-4">
          <div v-for="dept in topDepartments" :key="dept.id">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="font-medium text-gray-700 truncate pr-2">{{ dept.name }}</span>
              <span class="text-gray-400 flex-shrink-0">{{ dept.employeeCount }}</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                :style="{ width: `${maxDeptCount ? (dept.employeeCount / maxDeptCount) * 100 : 0}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent leave requests -->
      <div v-if="canViewLeave" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" :class="canViewDepartments ? 'lg:col-span-2' : 'lg:col-span-3'">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900">Recent Leave Requests</h2>
          <NuxtLink to="/leave" class="text-xs font-medium text-blue-600 hover:text-blue-700">View all</NuxtLink>
        </div>

        <div v-if="leaveStore.loading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        <div v-else-if="!recentLeaveRequests.length" class="text-sm text-gray-400 text-center py-8">No leave requests yet.</div>
        <div v-else class="overflow-x-auto -mx-5">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-gray-400 uppercase tracking-wide">
                <th class="px-5 py-2 font-medium">Employee</th>
                <th class="px-5 py-2 font-medium">Type</th>
                <th class="px-5 py-2 font-medium">Dates</th>
                <th class="px-5 py-2 font-medium">Days</th>
                <th class="px-5 py-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="req in recentLeaveRequests" :key="req.id" class="hover:bg-gray-50/60 transition-colors">
                <td class="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">{{ req.employeeName }}</td>
                <td class="px-5 py-3 text-gray-500 whitespace-nowrap">{{ req.leaveTypeName }}</td>
                <td class="px-5 py-3 text-gray-500 whitespace-nowrap">{{ format.date(req.startDate) }} - {{ format.date(req.endDate) }}</td>
                <td class="px-5 py-3 text-gray-500 whitespace-nowrap">{{ req.totalDays }}</td>
                <td class="px-5 py-3 text-right">
                  <StatusBadge :status="req.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Quick access -->
    <div v-if="quickLinks.length">
      <h2 class="text-sm font-semibold text-gray-900 mb-4">Quick Access</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-4 flex flex-col items-center text-center gap-2 group"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors" :class="link.bg">
            <div v-html="link.icon" :class="link.color"></div>
          </div>
          <span class="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{{ link.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'

definePageMeta({
  middleware: 'auth',
  title: 'Dashboard',
  subtitle: 'Overview of your organization',
})

const auth = useAuthStore()
const format = useFormat()

const employeesStore = useEmployeesStore()
const departmentsStore = useDepartmentsStore()
const leaveStore = useLeaveStore()
const attendanceStore = useAttendanceStore()
const payrollStore = usePayrollStore()
const performanceStore = usePerformanceStore()

const firstName = computed(() => auth.user?.name?.split(' ')[0] || 'there')

const canViewEmployees = computed(() => auth.can('HR', 'ViewEmployee'))
const canViewDepartments = computed(() => auth.can('HR', 'ViewDepartment'))
const canViewJobPositions = computed(() => auth.can('HR', 'ViewJobPosition'))
const canViewAttendance = computed(() => auth.can('HR', 'ViewAttendance'))
const canViewLeave = computed(() => auth.can('HR', 'ViewLeave'))
const canViewPayroll = computed(() => auth.can('HR', 'ViewPayroll'))
const canViewPerformance = computed(() => auth.can('HR', 'ViewPerformance'))
const canViewProducts = computed(() => auth.can('Products', 'View'))
const canViewAdmin = computed(() => auth.canAny([['Roles', 'View'], ['Permissions', 'View'], ['Users', 'View']]))

const visibleStatCards = computed(() =>
  [
    canViewEmployees.value,
    canViewDepartments.value,
    canViewLeave.value,
    canViewAttendance.value,
    canViewPayroll.value,
    canViewPerformance.value,
  ].filter(Boolean)
)

const today = new Date()
const todayLabel = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
const todayLabelShort = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const currentMonthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const topDepartments = computed(() =>
  [...departmentsStore.departments]
    .sort((a, b) => (b.employeeCount || 0) - (a.employeeCount || 0))
    .slice(0, 5)
)
const maxDeptCount = computed(() => Math.max(1, ...topDepartments.value.map((d) => d.employeeCount || 0)))

const recentLeaveRequests = computed(() =>
  [...leaveStore.leaveRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
)

const icon = (path) => `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${path}</svg>`

const allQuickLinks = [
  {
    label: 'Employees',
    to: '/employees',
    bg: 'bg-blue-50',
    color: 'text-blue-500',
    icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-1.13a4 4 0 10-4-4 4 4 0 004 4zM9 11a4 4 0 100-8 4 4 0 000 8z" />'),
    show: canViewEmployees,
  },
  {
    label: 'Departments',
    to: '/departments',
    bg: 'bg-indigo-50',
    color: 'text-indigo-500',
    icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M5 21V5a1 1 0 011-1h5a1 1 0 011 1v16M13 21V9a1 1 0 011-1h5a1 1 0 011 1v12M9 7h0M9 11h0M9 15h0" />'),
    show: canViewDepartments,
  },
  {
    label: 'Job Positions',
    to: '/job-positions',
    bg: 'bg-cyan-50',
    color: 'text-cyan-500',
    icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a1 1 0 00-1 1v3c0 1.1.9 2 2 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM9 5h6v2H9V5zM3 13v6a2 2 0 002 2h14a2 2 0 002-2v-6" />'),
    show: canViewJobPositions,
  },
  {
    label: 'Attendance',
    to: '/attendance',
    bg: 'bg-emerald-50',
    color: 'text-emerald-500',
    icon: icon('<circle cx="12" cy="12" r="10" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />'),
    show: canViewAttendance,
  },
  {
    label: 'Leave',
    to: '/leave',
    bg: 'bg-amber-50',
    color: 'text-amber-500',
    icon: icon('<rect x="3" y="4" width="18" height="18" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18" />'),
    show: canViewLeave,
  },
  {
    label: 'Payroll',
    to: '/payroll',
    bg: 'bg-purple-50',
    color: 'text-purple-500',
    icon: icon('<rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />'),
    show: canViewPayroll,
  },
  {
    label: 'Performance',
    to: '/performance',
    bg: 'bg-orange-50',
    color: 'text-orange-500',
    icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M7 14l4-4 3 3 5-6" />'),
    show: canViewPerformance,
  },
  {
    label: 'Products',
    to: '/products',
    bg: 'bg-teal-50',
    color: 'text-teal-500',
    icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />'),
    show: canViewProducts,
  },
  {
    label: 'Permissions',
    to: '/permissions',
    bg: 'bg-gray-100',
    color: 'text-gray-500',
    icon: icon('<path stroke-linecap="round" stroke-linejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />'),
    show: canViewAdmin,
  },
]

const quickLinks = computed(() => allQuickLinks.filter((link) => link.show.value))

onMounted(async () => {
  const todayIso = today.toISOString().slice(0, 10)
  const tasks = []
  if (canViewEmployees.value) tasks.push(employeesStore.fetchAll({ page: 1, pageSize: 1 }))
  if (canViewDepartments.value) tasks.push(departmentsStore.fetchAll())
  if (canViewLeave.value) tasks.push(leaveStore.fetchLeaveRequests())
  if (canViewAttendance.value) tasks.push(attendanceStore.fetchAll({ from: todayIso, to: todayIso }))
  if (canViewPayroll.value) tasks.push(payrollStore.fetchAll({ month: today.getMonth() + 1, year: today.getFullYear() }))
  if (canViewPerformance.value) tasks.push(performanceStore.fetchAll())
  await Promise.all(tasks)
})
</script>
