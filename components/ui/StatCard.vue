<template>
  <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
    <div class="flex items-center justify-between mb-2">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">{{ label }}</p>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="iconBg">
        <slot name="icon">
          <svg class="w-4 h-4" :class="iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </slot>
      </div>
    </div>
    <p class="text-2xl font-bold" :class="valueColor">{{ value }}</p>
    <p v-if="hint" class="text-xs text-gray-400 mt-0.5">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  color: { type: String, default: 'blue' }, // blue | indigo | emerald | red | amber | purple
})
</script>

<script>
export default {
  computed: {
    iconBg() {
      const map = {
        blue: 'bg-blue-50',
        indigo: 'bg-indigo-50',
        emerald: 'bg-emerald-50',
        red: 'bg-red-50',
        amber: 'bg-amber-50',
        purple: 'bg-purple-50',
        gray: 'bg-gray-100',
      }
      return map[this.color] ?? map.blue
    },
    iconColor() {
      const map = {
        blue: 'text-blue-500',
        indigo: 'text-indigo-500',
        emerald: 'text-emerald-500',
        red: 'text-red-400',
        amber: 'text-amber-500',
        purple: 'text-purple-500',
        gray: 'text-gray-400',
      }
      return map[this.color] ?? map.blue
    },
    valueColor() {
      const map = {
        blue: 'text-gray-900',
        indigo: 'text-gray-900',
        emerald: 'text-emerald-600',
        red: 'text-red-500',
        amber: 'text-amber-600',
        purple: 'text-purple-600',
        gray: 'text-gray-900',
      }
      return map[this.color] ?? map.blue
    },
  },
}
</script>
