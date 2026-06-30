<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Back link -->
    <NuxtLink to="/employees" class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Employees
    </NuxtLink>

    <!-- Loading -->
    <div v-if="store.loading && !employee" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div class="flex items-center gap-4">
        <div class="w-20 h-20 bg-gray-200 rounded-2xl"></div>
        <div class="flex-1 space-y-2">
          <div class="h-5 bg-gray-200 rounded w-1/3"></div>
          <div class="h-3.5 bg-gray-100 rounded w-1/4"></div>
          <div class="h-3.5 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!employee" class="text-center py-20">
      <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
        <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-1.13a4 4 0 10-4-4 4 4 0 004 4zM9 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      </div>
      <p class="text-gray-700 font-semibold text-lg mb-1">Employee not found</p>
      <p class="text-gray-400 text-sm">The employee you're looking for doesn't exist or has been removed.</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-5">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span class="text-white text-xl sm:text-2xl font-bold">{{ initials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ employee.fullName }}</h1>
              <StatusBadge :status="employee.status" />
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ employee.jobTitle }} &middot; {{ employee.departmentName }}</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {{ employee.email }}
              </span>
              <span v-if="employee.phone" class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {{ employee.phone }}
              </span>
              <span class="flex items-center gap-1 font-mono">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h6" /></svg>
                {{ employee.employeeNo }}
              </span>
            </div>
          </div>
          <button
            @click="showEditModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 self-start"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 overflow-x-auto border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="setTab(tab.key)"
          :class="activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'"
          class="px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Overview -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Personal Information</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Date of Birth</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ format.date(employee.dateOfBirth) }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Gender</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ employee.gender || '-' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">National ID</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ employee.nationalId || '-' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Phone</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ employee.phone || '-' }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Address</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ fullAddress }}</dd>
              </div>
            </dl>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Employment Details</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Employment Type</dt>
                <dd class="mt-1"><StatusBadge :status="employee.employmentType" /></dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Joining Date</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ format.date(employee.joiningDate) }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Manager</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ employee.managerName || 'No manager assigned' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Basic Salary</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ format.currency(employee.basicSalary) }}</dd>
              </div>
              <div v-if="employee.terminationDate">
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Termination Date</dt>
                <dd class="text-sm font-medium text-red-600 mt-1">{{ format.date(employee.terminationDate) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Banking Details</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Bank</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ employee.bankName || '-' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Account Number</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1 font-mono">{{ employee.bankAccountNo || '-' }}</dd>
              </div>
            </dl>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Record</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Created</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ format.dateTime(employee.createdAt) }}</dd>
              </div>
              <div v-if="employee.updatedAt">
                <dt class="text-xs text-gray-400 uppercase tracking-wide">Last Updated</dt>
                <dd class="text-sm font-medium text-gray-800 mt-1">{{ format.dateTime(employee.updatedAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div v-else-if="activeTab === 'documents'" class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Documents</h3>
          <button
            @click="showUploadModal = true"
            class="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </button>
        </div>

        <div v-if="employeesStore.documents.length === 0" class="text-center py-12">
          <p class="text-sm text-gray-400">No documents uploaded yet.</p>
        </div>
        <div v-else class="divide-y divide-gray-50">
          <div v-for="doc in employeesStore.documents" :key="doc.id" class="flex items-center justify-between px-6 py-4 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path stroke-linecap="round" stroke-linejoin="round" d="M14 2v6h6" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ doc.fileName }}</p>
                <p class="text-xs text-gray-400">
                  {{ doc.documentType }} &middot; Uploaded {{ format.date(doc.uploadedAt) }}
                  <span v-if="doc.expiryDate"> &middot; Expires {{ format.date(doc.expiryDate) }}</span>
                </p>
                <p v-if="doc.note" class="text-xs text-gray-400 mt-0.5">{{ doc.note }}</p>
              </div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <a
                :href="doc.fileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Open document"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6v6M10 14L20 4" />
                </svg>
              </a>
              <button
                @click="openDeleteDocModal(doc)"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete document"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Leave -->
      <div v-else-if="activeTab === 'leave'" class="space-y-5">
        <div v-if="isHrAdmin" class="flex justify-end">
          <button
            @click="showLeaveBalanceModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Set Leave Balance
          </button>
        </div>

        <div v-if="leaveStore.leaveBalances.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="bal in leaveStore.leaveBalances" :key="bal.leaveTypeName" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
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

        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Leave Requests</h3>
          </div>
          <div v-if="employeeLeaveRequests.length === 0" class="text-center py-12">
            <p class="text-sm text-gray-400">No leave requests found.</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Type</th>
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Dates</th>
                  <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Days</th>
                  <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Reason</th>
                  <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="req in employeeLeaveRequests" :key="req.id" class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-5 py-3 text-sm font-medium text-gray-800">{{ req.leaveTypeName }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ format.date(req.startDate) }} - {{ format.date(req.endDate) }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500 text-center">{{ req.totalDays }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{{ req.reason || '-' }}</td>
                  <td class="px-5 py-3 text-center"><StatusBadge :status="req.status" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Attendance -->
      <div v-else-if="activeTab === 'attendance'" class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900">Attendance History</h3>
          <p class="text-xs text-gray-400">Last 30 days</p>
        </div>
        <div v-if="attendanceStore.records.length === 0" class="text-center py-12">
          <p class="text-sm text-gray-400">No attendance records found.</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Date</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Check In</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Check Out</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Hours</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="rec in attendanceStore.records" :key="rec.id" class="hover:bg-gray-50/60 transition-colors">
                <td class="px-5 py-3 text-sm font-medium text-gray-800">{{ format.date(rec.date) }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 text-center">{{ format.time(rec.checkInTime) }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 text-center">{{ format.time(rec.checkOutTime) }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 text-center">{{ rec.workedHours ?? '-' }}</td>
                <td class="px-5 py-3 text-center"><StatusBadge :status="rec.status" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payroll -->
      <div v-else-if="activeTab === 'payroll'" class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Payroll History</h3>
        </div>
        <div v-if="payrollStore.payrolls.length === 0" class="text-center py-12">
          <p class="text-sm text-gray-400">No payroll records found.</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Period</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Net Salary</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Present / Working Days</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="p in payrollStore.payrolls" :key="p.id" class="hover:bg-gray-50/60 transition-colors">
                <td class="px-5 py-3 text-sm font-medium text-gray-800">{{ monthName(p.month) }} {{ p.year }}</td>
                <td class="px-4 py-3 text-sm font-semibold text-gray-800 text-right">{{ format.currency(p.netSalary) }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 text-center hidden sm:table-cell">{{ p.presentDays }} / {{ p.workingDays }}</td>
                <td class="px-5 py-3 text-center"><StatusBadge :status="p.status" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Performance -->
      <div v-else-if="activeTab === 'performance'" class="space-y-4">
        <div v-if="performanceStore.reviews.length === 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-12">
          <p class="text-sm text-gray-400">No performance reviews found.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="review in performanceStore.reviews" :key="review.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="text-sm font-semibold text-gray-800">{{ review.period }}</p>
                <p class="text-xs text-gray-400">Reviewed by {{ review.reviewerName }} &middot; {{ format.date(review.reviewDate) }}</p>
              </div>
              <StatusBadge :status="review.status" />
            </div>
            <div class="flex items-center gap-1 my-2">
              <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-amber-400' : 'text-gray-200'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.916a1 1 0 00.95-.69l1.52-4.674z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700 ml-1">{{ review.rating }} / 5</span>
            </div>
            <div class="space-y-1.5 text-sm text-gray-500">
              <p v-if="review.strengths"><span class="font-medium text-gray-700">Strengths:</span> {{ review.strengths }}</p>
              <p v-if="review.improvements"><span class="font-medium text-gray-700">Improvements:</span> {{ review.improvements }}</p>
              <p v-if="review.goals"><span class="font-medium text-gray-700">Goals:</span> {{ review.goals }}</p>
              <p v-if="review.comments"><span class="font-medium text-gray-700">Comments:</span> {{ review.comments }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modals -->
    <EmployeeFormModal
      v-if="showEditModal && employee"
      :employee="employee"
      @close="showEditModal = false"
      @success="handleEditSuccess"
    />

    <DocumentUploadModal
      v-if="showUploadModal && employee"
      :employee-id="employee.id"
      :employee-name="employee.fullName"
      @close="showUploadModal = false"
      @success="toast.success('Document uploaded successfully.')"
    />

    <LeaveBalanceFormModal
      v-if="showLeaveBalanceModal && employee"
      :employee-id="employee.id"
      @close="showLeaveBalanceModal = false"
      @success="toast.success('Leave balance updated successfully.')"
    />

    <ConfirmModal
      v-if="showDeleteDocModal && deletingDoc"
      title="Delete Document"
      subtitle="This will permanently remove the document record"
      tone="danger"
      confirm-text="Delete"
      loading-text="Deleting..."
      :loading="deletingDocLoading"
      :error="deleteDocError"
      @close="showDeleteDocModal = false"
      @confirm="confirmDeleteDoc"
    >
      Are you sure you want to delete <strong>{{ deletingDoc.fileName }}</strong>?
    </ConfirmModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import EmployeeFormModal from '~/components/employees/EmployeeFormModal.vue'
import DocumentUploadModal from '~/components/employees/DocumentUploadModal.vue'
import LeaveBalanceFormModal from '~/components/employees/LeaveBalanceFormModal.vue'

definePageMeta({
  middleware: ['auth', 'hr-staff'],
  title: 'Employee Profile',
  subtitle: 'View and manage employee details',
})

const route = useRoute()
const employeeId = route.params.id

const store = useEmployeesStore()
const leaveStore = useLeaveStore()
const attendanceStore = useAttendanceStore()
const payrollStore = usePayrollStore()
const performanceStore = usePerformanceStore()
const auth = useAuthStore()
const toast = useToast()
const format = useFormat()

const employee = computed(() => store.current)
const isHrAdmin = computed(() => auth.user?.role === 'HR Admin' || auth.user?.role === 'Admin')

const activeTab = ref('overview')
const loadedTabs = new Set(['overview'])

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'documents', label: 'Documents' },
  { key: 'leave', label: 'Leave' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'performance', label: 'Performance' },
]

const initials = computed(() => {
  if (!employee.value) return '?'
  return `${employee.value.firstName?.[0] ?? ''}${employee.value.lastName?.[0] ?? ''}`.toUpperCase()
})

const fullAddress = computed(() => {
  if (!employee.value) return '-'
  return [employee.value.address, employee.value.city, employee.value.country].filter(Boolean).join(', ') || '-'
})

const employeeLeaveRequests = computed(() =>
  leaveStore.leaveRequests.filter((r) => r.employeeId === employeeId)
)

const monthName = (m) =>
  new Date(2000, m - 1, 1).toLocaleDateString('en-US', { month: 'long' })

const showEditModal = ref(false)
const showUploadModal = ref(false)
const showLeaveBalanceModal = ref(false)
const showDeleteDocModal = ref(false)
const deletingDoc = ref(null)
const deletingDocLoading = ref(false)
const deleteDocError = ref('')

const setTab = (key) => {
  activeTab.value = key
  loadTabData(key)
}

const loadTabData = async (key) => {
  if (loadedTabs.has(key)) return
  loadedTabs.add(key)

  switch (key) {
    case 'leave':
      await Promise.all([
        leaveStore.fetchLeaveRequests({ employeeId }),
        leaveStore.fetchLeaveBalances(employeeId, new Date().getFullYear()),
      ])
      break
    case 'attendance': {
      const to = new Date()
      const from = new Date()
      from.setDate(from.getDate() - 30)
      await attendanceStore.fetchAll({
        employeeId,
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10),
      })
      break
    }
    case 'payroll':
      await payrollStore.fetchAll({ employeeId })
      break
    case 'performance':
      await performanceStore.fetchAll({ employeeId })
      break
  }
}

const openDeleteDocModal = (doc) => {
  deletingDoc.value = doc
  deleteDocError.value = ''
  showDeleteDocModal.value = true
}

const confirmDeleteDoc = async () => {
  if (!deletingDoc.value) return
  deletingDocLoading.value = true
  deleteDocError.value = ''
  const result = await store.deleteDocument(deletingDoc.value.id, employeeId)
  deletingDocLoading.value = false
  if (result.success) {
    showDeleteDocModal.value = false
    toast.success('Document deleted successfully.')
  } else {
    deleteDocError.value = result.error
  }
}

const handleEditSuccess = () => {
  toast.success('Employee updated successfully.')
}

onMounted(async () => {
  await store.fetchById(employeeId)
  await store.fetchDocuments(employeeId)
})
</script>
