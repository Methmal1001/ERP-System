export default defineNitroPlugin(() => {
  if (process.dev) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
})
