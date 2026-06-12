// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  devtools: { enabled: true },
  pinia: {
    storesDirs: ['./stores/**'],
  },
})
