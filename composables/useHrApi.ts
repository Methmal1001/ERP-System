export const useHrApi = () => {
  const auth = useAuthStore()

  const request = async <T = any>(url: string, opts: Record<string, any> = {}): Promise<T> => {
    const headers: Record<string, string> = { ...(opts.headers || {}) }
    if (auth.accessToken) {
      headers.Authorization = `Bearer ${auth.accessToken}`
    }

    try {
      return await $fetch<T>(`/api/hr${url}`, { ...opts, headers })
    } catch (err: any) {
      if (err?.response?.status === 401) {
        await auth.logout()
        if (import.meta.client) {
          navigateTo('/auth/Login')
        }
      }
      throw err
    }
  }

  return { request }
}
