<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Total Net" :value="format.currency(store.totalNet)" hint="Selected period" color="purple">
        <template #icon>
          <svg class="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Draft" :value="store.draftCount" hint="Selected period" color="amber">
        <template #icon>
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Approved" :value="store.approvedCount" hint="Selected period" color="blue">
        <template #icon>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Paid" :value="store.paidCount" hint="Selected period" color="emerald">
        <template #icon>
          <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col lg:flex-row gap-3 lg:items-end">
      <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Month</label>
          <select
            v-model.number="filterMonth"
            class="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
          >
            <option v-for="(name, idx) in monthNames" :key="idx" :value="idx + 1">{{ name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Year</label>
          <input
            v-model.number="filterYear"
            type="number"
            min="2000"
            class="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Employee</label>
          <select
            v-model="filterEmployee"
            class="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
          >
            <option value="">All Employees</option>
            <option v-for="emp in employeesStore.employees" :key="emp.id" :value="emp.id">{{ emp.fullName }}</option>
          </select>
        </div>
      </div>

      <button
        @click="showGenerateModal = true"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Generate Payroll
      </button>
    </div>

    <!-- Error State -->
    <div v-if="store.error && !store.loading" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="text-red-700 font-semibold mb-1">Failed to load payroll records</p>
      <p class="text-red-500 text-sm mb-4">{{ store.error }}</p>
      <button @click="fetchPayrolls" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <template v-else-if="store.loading">
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
    <template v-else-if="store.payrolls.length === 0">
      <div class="text-center py-20">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </div>
        <p class="text-gray-700 font-semibold text-lg mb-1">No payroll records found</p>
        <p class="text-gray-400 text-sm">Generate payroll for {{ monthNames[filterMonth - 1] }} {{ filterYear }} to get started.</p>
        <div class="flex gap-2 justify-center mt-5">
          <button @click="showGenerateModal = true" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
            Generate Payroll
          </button>
        </div>
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
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Period</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Net Salary</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Present / Working</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="p in store.payrolls" :key="p.id" class="hover:bg-blue-50/30 transition-colors">
                <td class="px-5 py-3.5">
                  <NuxtLink :to="`/employees/${p.employeeId}`" class="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
                    {{ p.employeeName }}
                  </NuxtLink>
                </td>
                <td class="px-4 py-3.5 text-sm text-gray-500">{{ monthNames[p.month - 1] }} {{ p.year }}</td>
                <td class="px-4 py-3.5 text-sm font-semibold text-gray-800 text-right">{{ format.currency(p.netSalary) }}</td>
                <td class="px-4 py-3.5 text-sm text-gray-500 text-center hidden md:table-cell">{{ p.presentDays }} / {{ p.workingDays }}</td>
                <td class="px-4 py-3.5 text-center"><StatusBadge :status="p.status" /></td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openPayslip(p)"
                      class="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                    >
                      View Payslip
                    </button>
                    <button
                      v-if="p.status === 'Draft'"
                      @click="advanceStatus(p, 'Approved')"
                      :disabled="updatingId === p.id"
                      class="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      v-else-if="p.status === 'Approved'"
                      @click="advanceStatus(p, 'Paid')"
                      :disabled="updatingId === p.id"
                      class="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      Mark Paid
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Modals -->
    <GeneratePayrollModal
      v-if="showGenerateModal"
      :default-month="filterMonth"
      :default-year="filterYear"
      @close="showGenerateModal = false"
      @success="handleGenerateSuccess"
    />
    <PayslipModal v-if="payslipRecord" :record="payslipRecord" @close="payslipRecord = null" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import GeneratePayrollModal from '~/components/payroll/GeneratePayrollModal.vue'
import PayslipModal from '~/components/payroll/PayslipModal.vue'

definePageMeta({
  middleware: ['auth', 'hr-staff'],
  title: 'Payroll',
  subtitle: 'Generate and manage employee payroll',
})

const store = usePayrollStore()
const employeesStore = useEmployeesStore()
const toast = useToast()
const format = useFormat()

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const now = new Date()
const filterMonth = ref(now.getMonth() + 1)
const filterYear = ref(now.getFullYear())
const filterEmployee = ref('')

const showGenerateModal = ref(false)
const payslipRecord = ref(null)
const updatingId = ref(null)

const fetchPayrolls = () => {
  store.fetchAll({
    month: filterMonth.value,
    year: filterYear.value,
    employeeId: filterEmployee.value || undefined,
  })
}

watch([filterMonth, filterYear, filterEmployee], fetchPayrolls)

const openPayslip = (record) => {
  payslipRecord.value = record
}

const advanceStatus = async (record, status) => {
  updatingId.value = record.id
  const result = await store.updateStatus(record.id, status)
  updatingId.value = null
  if (result.success) {
    toast.success(`Payroll marked as ${status}.`)
  } else {
    toast.error(result.error)
  }
}

const handleGenerateSuccess = () => {
  toast.success('Payroll generated successfully.')
}

onMounted(() => {
  fetchPayrolls()
  if (!employeesStore.employees.length) employeesStore.fetchAll({ pageSize: 100 })
})
</script>
