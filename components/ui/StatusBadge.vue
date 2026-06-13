<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
    :class="classes"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    {{ label ?? status }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
  label: { type: String, default: null },
})

const STYLES = {
  // Generic active / positive states
  active: 'bg-emerald-50 text-emerald-700',
  approved: 'bg-emerald-50 text-emerald-700',
  paid: 'bg-emerald-50 text-emerald-700',
  present: 'bg-emerald-50 text-emerald-700',
  acknowledged: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-emerald-50 text-emerald-700',

  // Warning / pending states
  pending: 'bg-amber-50 text-amber-700',
  draft: 'bg-amber-50 text-amber-700',
  halfday: 'bg-amber-50 text-amber-700',
  submitted: 'bg-amber-50 text-amber-700',
  onleave: 'bg-amber-50 text-amber-700',

  // Negative states
  inactive: 'bg-red-50 text-red-600',
  rejected: 'bg-red-50 text-red-600',
  absent: 'bg-red-50 text-red-600',
  terminated: 'bg-red-50 text-red-600',
  cancelled: 'bg-red-50 text-red-600',

  // Informational states
  late: 'bg-blue-50 text-blue-600',
  workfromhome: 'bg-indigo-50 text-indigo-600',
  fulltime: 'bg-blue-50 text-blue-600',
  parttime: 'bg-purple-50 text-purple-600',
  contract: 'bg-orange-50 text-orange-600',
  intern: 'bg-gray-100 text-gray-600',
}

const DOT_STYLES = {
  active: 'bg-emerald-500',
  approved: 'bg-emerald-500',
  paid: 'bg-emerald-500',
  present: 'bg-emerald-500',
  acknowledged: 'bg-emerald-500',
  completed: 'bg-emerald-500',
  pending: 'bg-amber-500',
  draft: 'bg-amber-500',
  halfday: 'bg-amber-500',
  submitted: 'bg-amber-500',
  onleave: 'bg-amber-500',
  inactive: 'bg-red-400',
  rejected: 'bg-red-400',
  absent: 'bg-red-400',
  terminated: 'bg-red-400',
  cancelled: 'bg-red-400',
  late: 'bg-blue-500',
  workfromhome: 'bg-indigo-500',
  fulltime: 'bg-blue-500',
  parttime: 'bg-purple-500',
  contract: 'bg-orange-500',
  intern: 'bg-gray-400',
}

const key = computed(() => (props.status || '').toLowerCase().replace(/[\s_-]/g, ''))
const classes = computed(() => STYLES[key.value] ?? 'bg-gray-100 text-gray-600')
const dotClass = computed(() => DOT_STYLES[key.value] ?? 'bg-gray-400')
</script>
