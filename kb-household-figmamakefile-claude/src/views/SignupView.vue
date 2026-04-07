<template>
  <div class="w-100" style="max-width: 480px;">
    <div class="kb-card p-4 p-md-5">
      <!-- 상단 헤더 -->
      <div class="text-center mb-4">
        <div class="kb-form-icon mx-auto mb-3">
          <i class="bi bi-person-plus-fill text-white fs-4"></i>
        </div>
        <h2 class="fw-bold mb-1" style="font-size: 1.5rem; color: var(--kb-dark);">회원가입</h2>
        <p class="text-muted" style="font-size: 0.88rem;">KB 가계부 회원이 되어보세요</p>
      </div>

      <!-- 에러 메시지 -->
      <Transition name="shake">
        <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4" style="border-radius: 12px; font-size: 0.88rem;">
          <i class="bi bi-exclamation-circle-fill text-danger"></i>
          {{ errorMsg }}
        </div>
      </Transition>

      <!-- 폼 -->
      <form @submit.prevent="handleSignup" novalidate>
        <!-- 이름 -->
        <div class="mb-3">
          <label class="form-label fw-semibold" style="font-size: 0.88rem; color: var(--kb-dark);">
            <i class="bi bi-person me-1" style="color: var(--kb-orange);"></i>이름
          </label>
          <input
            v-model="form.name"
            type="text"
            class="form-control kb-input"
            :class="{ 'is-invalid': submitted && errors.name }"
            placeholder="이름을 입력하세요"
          />
          <div v-if="submitted && errors.name" class="invalid-feedback">{{ errors.name }}</div>
        </div>

        <!-- 이메일 -->
        <div class="mb-3">
          <label class="form-label fw-semibold" style="font-size: 0.88rem; color: var(--kb-dark);">
            <i class="bi bi-envelope me-1" style="color: var(--kb-orange);"></i>이메일
          </label>
          <input
            v-model="form.email"
            type="email"
            class="form-control kb-input"
            :class="{ 'is-invalid': submitted && errors.email }"
            placeholder="이메일을 입력하세요"
          />
          <div v-if="submitted && errors.email" class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <!-- 비밀번호 -->
        <div class="mb-3">
          <label class="form-label fw-semibold" style="font-size: 0.88rem; color: var(--kb-dark);">
            <i class="bi bi-lock me-1" style="color: var(--kb-orange);"></i>비밀번호
          </label>
          <div class="position-relative">
            <input
              v-model="form.password"
              :type="showPw ? 'text' : 'password'"
              class="form-control kb-input pe-5"
              :class="{ 'is-invalid': submitted && errors.password }"
              placeholder="8자 이상 입력하세요"
            />
            <button
              type="button"
              class="btn p-0 position-absolute top-50 end-0 translate-middle-y me-3"
              @click="showPw = !showPw"
              style="color: var(--kb-gray); z-index:2;"
            >
              <i :class="showPw ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div v-if="submitted && errors.password" class="invalid-feedback">{{ errors.password }}</div>
          </div>
          <!-- 비밀번호 강도 -->
          <div v-if="form.password" class="mt-2">
            <div class="d-flex gap-1 mb-1">
              <div
                v-for="i in 4"
                :key="i"
                class="flex-1 rounded"
                style="height: 4px; transition: background 0.3s;"
                :style="{ background: i <= passwordStrength.level ? passwordStrength.color : '#e8e8e8' }"
              ></div>
            </div>
            <small :style="{ color: passwordStrength.color }" class="fw-semibold">{{ passwordStrength.label }}</small>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="mb-4">
          <label class="form-label fw-semibold" style="font-size: 0.88rem; color: var(--kb-dark);">
            <i class="bi bi-lock-fill me-1" style="color: var(--kb-orange);"></i>비밀번호 확인
          </label>
          <div class="position-relative">
            <input
              v-model="form.passwordConfirm"
              :type="showPwConfirm ? 'text' : 'password'"
              class="form-control kb-input pe-5"
              :class="{
                'is-invalid': submitted && errors.passwordConfirm,
                'is-valid': form.passwordConfirm && form.password === form.passwordConfirm
              }"
              placeholder="비밀번호를 다시 입력하세요"
            />
            <button
              type="button"
              class="btn p-0 position-absolute top-50 end-0 translate-middle-y me-3"
              @click="showPwConfirm = !showPwConfirm"
              style="color: var(--kb-gray); z-index:2;"
            >
              <i :class="showPwConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div v-if="submitted && errors.passwordConfirm" class="invalid-feedback">{{ errors.passwordConfirm }}</div>
            <div v-if="form.passwordConfirm && form.password === form.passwordConfirm" class="valid-feedback d-block">
              <i class="bi bi-check-circle me-1"></i>비밀번호가 일치합니다
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-kb-primary w-100 py-3"
          :disabled="authStore.isLoading"
        >
          <span v-if="!authStore.isLoading">
            <i class="bi bi-person-check me-2"></i>회원가입
          </span>
          <span v-else>
            <span class="spinner-border spinner-border-sm me-2"></span>처리 중...
          </span>
        </button>
      </form>

      <!-- 로그인 링크 -->
      <div class="text-center mt-4 pt-3" style="border-top: 1px solid #f0f0f0;">
        <p class="text-muted mb-0" style="font-size: 0.88rem;">
          이미 계정이 있으신가요?
          <RouterLink to="/login" class="kb-link ms-1 fw-semibold">로그인</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '', passwordConfirm: '' })
const errorMsg = ref('')
const submitted = ref(false)
const showPw = ref(false)
const showPwConfirm = ref(false)

// 유효성 검사
const errors = computed(() => {
  const e = {}
  if (!form.name) e.name = '이름을 입력해주세요.'
  else if (form.name.length < 2) e.name = '이름은 2자 이상이어야 합니다.'

  if (!form.email) e.email = '이메일을 입력해주세요.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '올바른 이메일 형식이 아닙니다.'

  if (!form.password) e.password = '비밀번호를 입력해주세요.'
  else if (form.password.length < 8) e.password = '비밀번호는 8자 이상이어야 합니다.'

  if (!form.passwordConfirm) e.passwordConfirm = '비밀번호 확인을 입력해주세요.'
  else if (form.password !== form.passwordConfirm) e.passwordConfirm = '비밀번호가 일치하지 않습니다.'

  return e
})

// 비밀번호 강도
const passwordStrength = computed(() => {
  const pw = form.password
  let level = 0
  if (pw.length >= 8) level++
  if (/[A-Z]/.test(pw)) level++
  if (/[0-9]/.test(pw)) level++
  if (/[^A-Za-z0-9]/.test(pw)) level++

  const map = {
    1: { label: '매우 약함', color: '#dc3545' },
    2: { label: '약함', color: '#fd7e14' },
    3: { label: '보통', color: '#ffc107' },
    4: { label: '강함', color: '#28a745' }
  }
  return map[level] || { label: '', color: '#e8e8e8' }
})

const handleSignup = async () => {
  submitted.value = true
  errorMsg.value = ''

  if (Object.keys(errors.value).length > 0) return

  try {
    await authStore.signup(form.name, form.email, form.password)
    router.push('/login')
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

.flex-1 { flex: 1; }

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
