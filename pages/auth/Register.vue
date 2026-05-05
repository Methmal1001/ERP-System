<template>
  <div class="auth-page">
    <div class="auth-panel auth-panel--brand">
      <div class="brand-content">
        <div class="brand-logo">
          <svg viewBox="0 0 40 40" fill="none">
            <rect width="18" height="18" rx="4" fill="white"/>
            <rect x="22" width="18" height="18" rx="4" fill="white" opacity="0.6"/>
            <rect y="22" width="18" height="18" rx="4" fill="white" opacity="0.6"/>
            <rect x="22" y="22" width="18" height="18" rx="4" fill="white"/>
          </svg>
          <span>NexusERP</span>
        </div>
        <div class="brand-headline">
          <h2>Start your journey<br/>with NexusERP</h2>
          <p>Join thousands of businesses managing their operations smarter. Free 14-day trial, no credit card required.</p>
        </div>
        <div class="brand-steps">
          <div v-for="(step, i) in steps" :key="i" class="step">
            <div class="step-num">{{ i + 1 }}</div>
            <div>
              <p class="step-title">{{ step.title }}</p>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="brand-bg">
        <div class="bg-orb bg-orb--1"></div>
        <div class="bg-orb bg-orb--2"></div>
        <div class="bg-grid"></div>
      </div>
    </div>

    <div class="auth-panel auth-panel--form">
      <div class="form-container">
        <div class="mobile-logo">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="14" height="14" rx="3" fill="#6366f1"/>
            <rect x="18" width="14" height="14" rx="3" fill="#8b5cf6" opacity="0.7"/>
            <rect y="18" width="14" height="14" rx="3" fill="#8b5cf6" opacity="0.7"/>
            <rect x="18" y="18" width="14" height="14" rx="3" fill="#6366f1"/>
          </svg>
          <span>NexusERP</span>
        </div>
        <div class="form-header">
          <h1>Create your account</h1>
          <p>Get started with your 14-day free trial</p>
        </div>

        <RegisterForm />

        <p class="form-footer-text">
          Already have an account?
          <NuxtLink to="/auth/login" class="form-link">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const steps = [
  { title: 'Create your account', desc: 'Sign up in under 2 minutes' },
  { title: 'Set up your workspace', desc: 'Configure your company and modules' },
  { title: 'Invite your team', desc: 'Add users with role-based permissions' },
]
</script>

<style scoped>
.auth-page { min-height: 100vh; display: flex; font-family: var(--font); }

.auth-panel--brand {
  flex: 1;
  background: linear-gradient(135deg, #0f2027 0%, #1a1040 50%, #0a0b1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}
@media (max-width: 900px) { .auth-panel--brand { display: none; } }

.brand-content { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 40px; max-width: 400px; }
.brand-logo { display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 800; color: white; }
.brand-logo svg { width: 40px; height: 40px; }
.brand-headline h2 { font-size: 36px; font-weight: 800; color: white; line-height: 1.2; letter-spacing: -1px; }
.brand-headline p { margin-top: 12px; font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.6; }

.brand-steps { display: flex; flex-direction: column; gap: 20px; }
.step { display: flex; align-items: flex-start; gap: 14px; }
.step-num {
  width: 28px;
  height: 28px;
  background: rgba(99,102,241,0.3);
  border: 1px solid rgba(129,140,248,0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #a5b4fc;
  flex-shrink: 0;
}
.step-title { font-size: 14px; font-weight: 600; color: white; }
.step-desc { font-size: 12.5px; color: rgba(255,255,255,0.45); margin-top: 2px; }

.brand-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.25; }
.bg-orb--1 { width: 350px; height: 350px; background: #6366f1; top: -80px; left: -80px; }
.bg-orb--2 { width: 280px; height: 280px; background: #10b981; bottom: -40px; right: 40px; }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }

.auth-panel--form { width: 500px; flex-shrink: 0; background: var(--bg-base); display: flex; align-items: center; justify-content: center; padding: 40px; overflow-y: auto; }
@media (max-width: 900px) { .auth-panel--form { width: 100%; padding: 32px 24px; } }

.form-container { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 22px; }
.mobile-logo { display: none; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; color: var(--text-primary); }
.mobile-logo svg { width: 28px; height: 28px; }
@media (max-width: 900px) { .mobile-logo { display: flex; } }
.form-header h1 { font-size: 26px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }
.form-header p { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }
.form-footer-text { text-align: center; font-size: 13.5px; color: var(--text-secondary); }
.form-link { color: var(--accent-light); text-decoration: none; font-weight: 600; }
.form-link:hover { text-decoration: underline; }
</style>