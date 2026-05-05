<template>
  <div class="auth-page">
    <!-- Left Panel - Branding -->
    <div class="auth-panel auth-panel--brand">
      <div class="brand-content">
        <div class="brand-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="18" height="18" rx="4" fill="white"/>
            <rect x="22" width="18" height="18" rx="4" fill="white" opacity="0.6"/>
            <rect y="22" width="18" height="18" rx="4" fill="white" opacity="0.6"/>
            <rect x="22" y="22" width="18" height="18" rx="4" fill="white"/>
          </svg>
          <span>NexusERP</span>
        </div>

        <div class="brand-headline">
          <h2>Streamline your entire<br/>business operations</h2>
          <p>One platform for sales, inventory, finance, HR, and procurement — built for modern enterprises.</p>
        </div>

        <div class="brand-stats">
          <div v-for="stat in stats" :key="stat.label" class="stat-card">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>

        <div class="brand-features">
          <div v-for="f in features" :key="f" class="brand-feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ f }}
          </div>
        </div>
      </div>

      <!-- Decorative background -->
      <div class="brand-bg">
        <div class="bg-orb bg-orb--1"></div>
        <div class="bg-orb bg-orb--2"></div>
        <div class="bg-grid"></div>
      </div>
    </div>

    <!-- Right Panel - Form -->
    <div class="auth-panel auth-panel--form">
      <div class="form-container">
        <!-- Mobile logo -->
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
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <LoginForm />

        <div class="form-divider"><span>or continue with</span></div>

        <div class="sso-buttons">
          <button class="sso-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" class="sso-icon">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button class="sso-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" class="sso-icon">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p class="form-footer-text">
          Don't have an account?
          <NuxtLink to="/auth/register" class="form-link">Create one free</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const stats = [
  { value: '10K+', label: 'Companies' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]
const features = [
  'Real-time analytics & reporting',
  'Multi-currency & multi-branch',
  'Role-based access control',
  'MSSQL powered database',
]
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  font-family: var(--font);
}

/* ── Brand Panel ── */
.auth-panel--brand {
  flex: 1;
  background: linear-gradient(135deg, #1a1040 0%, #0f0a2e 50%, #0a0b1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}
@media (max-width: 900px) { .auth-panel--brand { display: none; } }

.brand-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 440px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}
.brand-logo svg { width: 40px; height: 40px; }

.brand-headline h2 {
  font-size: 38px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  letter-spacing: -1px;
}
.brand-headline p {
  margin-top: 12px;
  font-size: 16px;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
}

.brand-stats {
  display: flex;
  gap: 16px;
}
.stat-card {
  flex: 1;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 16px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-value { font-size: 24px; font-weight: 800; color: white; }
.stat-label { font-size: 12px; color: rgba(255,255,255,0.45); }

.brand-features { display: flex; flex-direction: column; gap: 10px; }
.brand-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255,255,255,0.7);
}
.brand-feature svg { width: 16px; height: 16px; color: #818cf8; flex-shrink: 0; }

/* Background decorations */
.brand-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}
.bg-orb--1 { width: 400px; height: 400px; background: #6366f1; top: -100px; right: -100px; }
.bg-orb--2 { width: 300px; height: 300px; background: #8b5cf6; bottom: -50px; left: 50px; }
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ── Form Panel ── */
.auth-panel--form {
  width: 480px;
  flex-shrink: 0;
  background: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow-y: auto;
}
@media (max-width: 900px) {
  .auth-panel--form { width: 100%; padding: 32px 24px; }
}

.form-container { width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 24px; }

.mobile-logo {
  display: none;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.mobile-logo svg { width: 28px; height: 28px; }
@media (max-width: 900px) { .mobile-logo { display: flex; } }

.form-header h1 { font-size: 26px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }
.form-header p { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }

.form-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;
}
.form-divider::before, .form-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.form-divider span { font-size: 12px; color: var(--text-muted); white-space: nowrap; }

.sso-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sso-btn {
  height: 42px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
}
.sso-btn:hover { background: var(--bg-overlay); color: var(--text-primary); border-color: var(--border-active); }
.sso-icon { width: 18px; height: 18px; }

.form-footer-text { text-align: center; font-size: 13.5px; color: var(--text-secondary); }
.form-link { color: var(--accent-light); text-decoration: none; font-weight: 600; }
.form-link:hover { text-decoration: underline; }
</style>