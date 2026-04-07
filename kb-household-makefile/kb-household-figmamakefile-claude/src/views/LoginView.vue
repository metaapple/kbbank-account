<template>
  <div class="w-100" style="max-width: 440px;">
    <div class="kb-card p-4 p-md-5">
      <!-- 상단 헤더 -->
      <div class="text-center mb-4">
        <div class="kb-form-icon mx-auto mb-3">
          <i class="bi bi-shield-lock-fill text-white fs-4"></i>
        </div>
        <h2 class="fw-bold mb-1" style="font-size: 1.5rem; color: var(--kb-dark);">로그인</h2>
        <p class="text-muted" style="font-size: 0.88rem;">KB 가계부에 오신 것을 환영합니다</p>
      </div>

      <!-- 에러 메시지 -->
      <Transition name="shake">
        <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4" style="border-radius: 12px; font-size: 0.88rem;">
          <i class="bi bi-exclamation-circle-fill text-danger"></i>
          {{ errorMsg }}
        </div>
      </Transition>

      <!-- 폼 -->
      <form @submit.prevent="handleLogin" novalidate>
        <div class="mb-3">
          <label class="form-label fw-semibold" style="font-size: 0.88rem; color: var(--kb-dark);">
            <i class="bi bi-envelope me-1" style="color: var(--kb-orange);"></i>이메일
          </label>
          <input
            v-model="form.email"
            type="email"
            class="form-control kb-input"
            :class="{ 'is-invalid': submitted && !form.email }"
            placeholder="이메일을 입력하세요"
            autocomplete="email"
          />
          <div v-if="submitted && !form.email" class="invalid-feedback">이메일을 입력해주세요.</div>
        </div>

        <div class="mb-4">
          <label class="form-label fw-semibold" style="font-size: 0.88rem; color: var(--kb-dark);">
            <i class="bi bi-lock me-1" style="color: var(--kb-orange);"></i>비밀번호
          </label>
          <div class="position-relative">
            <input
              v-model="form.password"
              :type="showPw ? 'text' : 'password'"
              class="form-control kb-input pe-5"
              :class="{ 'is-invalid': submitted && !form.password }"
              placeholder="비밀번호를 입력하세요"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="btn p-0 position-absolute top-50 end-0 translate-middle-y me-3"
              @click="showPw = !showPw"
              style="color: var(--kb-gray); z-index:2;"
            >
              <i :class="showPw ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div v-if="submitted && !form.password" class="invalid-feedback">비밀번호를 입력해주세요.</div>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-kb-primary w-100 py-3"
          :disabled="authStore.isLoading"
        >
          <span v-if="!authStore.isLoading">
            <i class="bi bi-box-arrow-in-right me-2"></i>로그인
          </span>
          <span v-else>
            <span class="spinner-border spinner-border-sm me-2"></span>로그인 중...
          </span>
        </button>
      </form>

      <!-- 회원가입 링크 -->
      <div class="text-center mt-4 pt-3" style="border-top: 1px solid #f0f0f0;">
        <p class="text-muted mb-0" style="font-size: 0.88rem;">
          아직 계정이 없으신가요?
          <RouterLink to="/signup" class="kb-link ms-1 fw-semibold">회원가입</RouterLink>
        </p>
      </div>
    </div>

    <!-- 데모 안내 -->
    <div class="text-center mt-3">
      <p class="text-muted" style="font-size: 0.78rem;">
        <i class="bi bi-info-circle me-1"></i>
        회원가입 후 로그인하세요
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const errorMsg = ref('')
const submitted = ref(false)
const showPw = ref(false)

const handleLogin = async () => {
  submitted.value = true
  errorMsg.value = ''

  if (!form.email || !form.password) return

  try {
    await authStore.login(form.email, form.password)
    router.push('/dashboard')
  } catch (e) {
    errorMsg.value = e.message
  }
}
</script>

<style scoped>
.kb-form-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--kb-orange), var(--kb-orange-dark));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(245, 166, 35, 0.4);
}

/* 쉐이크 애니메이션 */
.shake-enter-active {
  animation: shake 0.4s ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
</style>
