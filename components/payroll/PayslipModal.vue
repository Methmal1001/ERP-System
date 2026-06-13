<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm print:hidden" @click="$emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 print:hidden">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Payslip</h2>
              <p class="text-sm text-gray-400 mt-0.5">{{ monthName(record.month) }} {{ record.year }}</p>
            </div>
            <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg font-bold text-gray-900">{{ record.employeeName }}</p>
                <p class="text-sm text-gray-400">Payslip for {{ monthName(record.month) }} {{ record.year }}</p>
              </div>
              <StatusBadge :status="record.status" />
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-lg font-bold text-gray-900">{{ record.workingDays }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Working Days</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-lg font-bold text-emerald-600">{{ record.presentDays }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Present Days</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-lg font-bold text-amber-600">{{ record.leaveDays }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Leave Days</p>
              </div>
            </div>

            <div>
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Earnings</h3>
              <div class="space-y-1.5">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Basic Salary</span>
                  <span class="font-medium text-gray-800">{{ format.currency(record.basicSalary) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Allowances</span>
                  <span class="font-medium text-gray-800">{{ format.currency(record.allowances) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Bonuses</span>
                  <span class="font-medium text-gray-800">{{ format.currency(record.bonuses) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Overtime Pay</span>
                  <span class="font-medium text-gray-800">{{ format.currency(record.overtimePay) }}</span>
                </div>
                <div class="flex justify-between text-sm pt-1.5 border-t border-gray-100">
                  <span class="text-gray-600 font-medium">Gross Pay</span>
                  <span class="font-semibold text-gray-900">{{ format.currency(grossPay) }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Deductions</h3>
              <div class="space-y-1.5">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Deductions</span>
                  <span class="font-medium text-red-500">- {{ format.currency(record.deductions) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax Amount</span>
                  <span class="font-medium text-red-500">- {{ format.currency(record.taxAmount) }}</span>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 flex items-center justify-between">
              <span class="text-sm font-semibold text-white/90">Net Salary</span>
              <span class="text-xl font-bold text-white">{{ format.currency(record.netSalary) }}</span>
            </div>

            <p v-if="record.paidAt" class="text-xs text-gray-400 text-center">Paid on {{ format.dateTime(record.paidAt) }}</p>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex gap-3 print:hidden">
            <button
              @click="$emit('close')"
              class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              @click="print"
              class="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'

const props = defineProps({
  record: { type: Object, required: true },
})
defineEmits(['close'])

const format = useFormat()

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const monthName = (m) => monthNames[m - 1] ?? ''

const grossPay = computed(() =>
  (props.record.basicSalary || 0) + (props.record.allowances || 0) + (props.record.bonuses || 0) + (props.record.overtimePay || 0)
)

const print = () => {
  if (typeof window !== 'undefined') window.print()
}
</script>
