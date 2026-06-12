<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Avg Rating" :value="`${store.averageRating} / 5`" hint="This list" color="amber">
        <template #icon>
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.52-4.674z" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Draft" :value="store.draftCount" hint="This list" color="gray">
        <template #icon>
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Submitted" :value="store.submittedCount" hint="This list" color="blue">
        <template #icon>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Acknowledged" :value="store.acknowledgedCount" hint="This list" color="emerald">
        <template #icon>
          <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div class="flex flex-col sm:flex-row gap-3 flex-1">
        <select
          v-model="filterEmployee"
          class="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm sm:w-64"
        >
          <option value="">All Employees</option>
          <option v-for="emp in employeesStore.employees" :key="emp.id" :value="emp.id">{{ emp.fullName }}</option>
        </select>
        <div class="relative flex-1 sm:max-w-xs">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            v-model="filterPeriod"
            type="text"
            placeholder="Filter by period e.g. Q1 2026"
            class="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
          />
        </div>
      </div>

      <button
        @click="showFormModal = true"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Review
      </button>
    </div>

    <!-- Error State -->
    <div v-if="store.error && !store.loading" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="text-red-700 font-semibold mb-1">Failed to load performance reviews</p>
      <p class="text-red-500 text-sm mb-4">{{ store.error }}</p>
      <button @click="fetchReviews" class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <template v-else-if="store.loading">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl p-5 animate-pulse border border-gray-100 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3.5 bg-gray-200 rounded w-2/3"></div>
              <div class="h-3 bg-gray-100 rounded w-1/3"></div>
            </div>
          </div>
          <div class="h-3 bg-gray-100 rounded w-full"></div>
          <div class="h-3 bg-gray-100 rounded w-4/5"></div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <template v-else-if="filteredReviews.length === 0">
      <div class="text-center py-20">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.52-4.674z" />
          </svg>
        </div>
        <p class="text-gray-700 font-semibold text-lg mb-1">No performance reviews found</p>
        <p class="text-gray-400 text-sm">Create a review to start tracking employee performance.</p>
        <div class="flex gap-2 justify-center mt-5">
          <button @click="showFormModal = true" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
            New Review
          </button>
        </div>
      </div>
    </template>

    <!-- Reviews Grid -->
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="review in filteredReviews" :key="review.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-white text-sm font-bold">{{ review.employeeName.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ review.employeeName }}</p>
                <p class="text-xs text-gray-400">{{ review.period }}</p>
              </div>
            </div>
            <StatusBadge :status="review.status" />
          </div>

          <div class="flex items-center gap-1 mb-3">
            <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-amber-400' : 'text-gray-200'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.52-4.674z" />
            </svg>
            <span class="text-sm font-semibold text-gray-700 ml-1">{{ review.rating }} / 5</span>
          </div>

          <p class="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
            {{ review.strengths || review.comments || 'No summary provided.' }}
          </p>

          <div class="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span>Reviewed by {{ review.reviewerName }}</span>
            <span>{{ format.date(review.reviewDate) }}</span>
          </div>

          <button
            @click="openDetailModal(review)"
            class="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            View Details
          </button>
        </div>
      </div>
    </template>

    <!-- Modals -->
    <ReviewFormModal v-if="showFormModal" @close="showFormModal = false" @success="handleFormSuccess" />
    <ReviewDetailModal
      v-if="detailReview"
      :review="detailReview"
      @close="detailReview = null"
      @success="handleStatusSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import ReviewFormModal from '~/components/performance/ReviewFormModal.vue'
import ReviewDetailModal from '~/components/performance/ReviewDetailModal.vue'

definePageMeta({
  middleware: 'auth',
  title: 'Performance',
  subtitle: 'Track employee performance reviews and ratings',
})

const store = usePerformanceStore()
const employeesStore = useEmployeesStore()
const toast = useToast()
const format = useFormat()

const filterEmployee = ref('')
const filterPeriod = ref('')

const showFormModal = ref(false)
const detailReview = ref(null)

const filteredReviews = computed(() => {
  if (!filterPeriod.value.trim()) return store.reviews
  const q = filterPeriod.value.toLowerCase().trim()
  return store.reviews.filter((r) => r.period.toLowerCase().includes(q))
})

const fetchReviews = () => {
  store.fetchAll({ employeeId: filterEmployee.value || undefined })
}

watch(filterEmployee, fetchReviews)

const openDetailModal = (review) => {
  detailReview.value = review
}

const handleFormSuccess = () => {
  toast.success('Performance review created successfully.')
}

const handleStatusSuccess = (status) => {
  toast.success(`Review marked as ${status}.`)
}

onMounted(() => {
  fetchReviews()
  if (!employeesStore.employees.length) employeesStore.fetchAll({ pageSize: 100 })
})
</script>
