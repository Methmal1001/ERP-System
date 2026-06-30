import { defineStore } from 'pinia'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkInTime?: string | null
  checkOutTime?: string | null
  workedHours?: number | null
  status: string
  note?: string | null
  approvalStatus: string
  approvedByName?: string | null
  approvedAt?: string | null
  rejectionReason?: string | null
  createdAt: string
}

interface AttendanceState {
  records: AttendanceRecord[]
  pendingApprovals: AttendanceRecord[]
  loading: boolean
  approvalsLoading: boolean
  error: string | null
}

export const useAttendanceStore = defineStore('hrAttendance', {
  state: (): AttendanceState => ({
    records: [],
    pendingApprovals: [],
    loading: false,
    approvalsLoading: false,
    error: null,
  }),

  getters: {
    presentCount: (state) => state.records.filter((r) => r.status === 'Present').length,
    lateCount: (state) => state.records.filter((r) => r.status === 'Late').length,
    absentCount: (state) => state.records.filter((r) => r.status === 'Absent').length,
    onLeaveCount: (state) => state.records.filter((r) => r.status === 'OnLeave').length,
    totalWorkedHours: (state) =>
      state.records.reduce((sum, r) => sum + (r.workedHours || 0), 0),
  },

  actions: {
    async fetchAll(filters: { employeeId?: string; from?: string; to?: string } = {}) {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const params: Record<string, any> = {}
        if (filters.employeeId) params.employeeId = filters.employeeId
        if (filters.from) params.from = filters.from
        if (filters.to) params.to = filters.to

        const res: any = await request('/attendance/GetAttendanceRecords', { params })
        if (res.isSuccess) this.records = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load attendance records. Please check your connection.'
      } finally {
        this.loading = false
      }
    },

    async mark(payload: {
      employeeId: string
      date: string
      checkInTime?: string | null
      checkOutTime?: string | null
      status: string
      note?: string
    }) {
      const { request } = useHrApi()
      try {
        await request('/attendance/MarkAttendance', { method: 'POST', body: payload })
        await this.fetchAll()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to mark attendance.' }
      }
    },

    async fetchPendingApprovals() {
      this.approvalsLoading = true
      const { request } = useHrApi()
      try {
        const res: any = await request('/attendance/GetPendingApprovals')
        if (res.isSuccess) this.pendingApprovals = res.data
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load pending approvals.'
      } finally {
        this.approvalsLoading = false
      }
    },

    async approve(id: string) {
      const { request } = useHrApi()
      try {
        await request(`/attendance/ApproveAttendance?id=${id}`, { method: 'PUT' })
        await this.fetchPendingApprovals()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: getApiErrorMessage(e, 'Failed to approve attendance.') }
      }
    },

    async reject(id: string, reason: string) {
      const { request } = useHrApi()
      try {
        await request(`/attendance/RejectAttendance?id=${id}`, { method: 'PUT', body: { reason } })
        await this.fetchPendingApprovals()
        return { success: true }
      } catch (e: any) {
        return { success: false, error: getApiErrorMessage(e, 'Failed to reject attendance.') }
      }
    },
  },
})
