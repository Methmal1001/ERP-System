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
  createdAt: string
}

interface AttendanceState {
  records: AttendanceRecord[]
  loading: boolean
  error: string | null
}

export const useAttendanceStore = defineStore('hrAttendance', {
  state: (): AttendanceState => ({
    records: [],
    loading: false,
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
  },
})
