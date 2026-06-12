<template>
  <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
    <div class="text-center mb-6">
      <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
        <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">Accounts by invitation</h1>
      <p class="text-sm text-gray-400 mt-1">HR Suite workspace access</p>
    </div>

    <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-4 text-sm text-blue-700 leading-relaxed mb-6">
      Self-service sign-up is disabled. New accounts can only be created by an
      <span class="font-semibold">HR Admin</span> from the
      <span class="font-semibold">Roles &amp; Permissions → Users</span> screen.
      If you need access, please reach out to your HR administrator and they will
      create your account and share your sign-in details.
    </div>

    <NuxtLink
      to="/auth/Login"
      class="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3V5a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      Back to Sign In
    </NuxtLink>
  </div>
</template>
