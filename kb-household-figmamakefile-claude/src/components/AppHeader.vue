<template>
  <header class="kb-header">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between py-3">
        <!-- 로고 (클릭 시 홈/로그인으로 이동) -->
        <RouterLink to="/" class="text-decoration-none d-flex align-items-center gap-2">
          <div class="kb-logo-icon">
            <i class="bi bi-bank2 text-white fs-5"></i>
          </div>
          <div>
            <div class="fw-bold text-dark" style="font-size: 1.1rem; line-height: 1.2;">
              KB 가계부
            </div>
            <div class="text-muted" style="font-size: 0.72rem; letter-spacing: 0.5px;">
              국민은행 스마트 가계부
            </div>
          </div>
        </RouterLink>

        <!-- 네비게이션 -->
        <nav class="d-flex align-items-center gap-2">
          <template v-if="!authStore.isLoggedIn">
            <RouterLink to="/login" class="btn btn-kb-outline btn-sm px-3">
              <i class="bi bi-box-arrow-in-right me-1"></i>로그인
            </RouterLink>
            <RouterLink to="/signup" class="btn btn-kb-primary btn-sm px-3">
              <i class="bi bi-person-plus me-1"></i>회원가입
            </RouterLink>
          </template>
          <template v-else>
            <div class="d-flex align-items-center gap-3">
              <div class="d-flex align-items-center gap-2">
                <div class="kb-avatar">
                  {{ authStore.currentUser.name.charAt(0) }}
                </div>
                <span class="fw-semibold text-dark d-none d-sm-inline" style="font-size: 0.9rem;">
                  {{ authStore.currentUser.name }}님
                </span>
              </div>
              <button class="btn btn-kb-outline btn-sm px-3" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-1"></i>로그아웃
              </button>
            </div>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.kb-logo-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, var(--kb-orange), var(--kb-orange-dark));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(245, 166, 35, 0.4);
  flex-shrink: 0;
}

.kb-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--kb-orange), var(--kb-orange-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
}
</style>
