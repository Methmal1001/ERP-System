export const getApiErrorMessage = (err: any, fallback: string): string => {
  const data = err?.data
  if (!data) return fallback
  if (typeof data === 'string') return data || fallback
  if (data.message) return data.message
  if (data.errors) {
    const messages = Object.values(data.errors).flat().filter(Boolean)
    if (messages.length) return messages.join(' ')
  }
  if (data.title) return data.title
  return fallback
}

export const useApiClient = (basePath: string) => {
  const auth = useAuthStore()

  const request = async <T = any>(url: string, opts: Record<string, any> = {}): Promise<T> => {
    const headers: Record<string, string> = { ...(opts.headers || {}) }
    if (auth.accessToken) {
      headers.Authorization = `Bearer ${auth.accessToken}`
    }

    try {
      return await $fetch<T>(`${basePath}${url}`, { ...opts, headers })
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
