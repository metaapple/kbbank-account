import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref(null)
  const isLoading = ref(false)
  const users = ref([]) // 로컬 가입 유저 목록 (mock)

  // getters
  const isLoggedIn = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // actions
  async function signup(name, email, password) {
    isLoading.value = true
    await delay(1200) // mock API 딜레이

    const existing = users.value.find(u => u.email === email)
    if (existing) {
      isLoading.value = false
      throw new Error('이미 가입된 이메일입니다.')
    }

    users.value.push({ name, email, password })
    isLoading.value = false
  }

  async function login(email, password) {
    isLoading.value = true
    await delay(1200)

    const found = users.value.find(u => u.email === email && u.password === password)
    if (!found) {
      isLoading.value = false
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    }

    user.value = { name: found.name, email: found.email }
    isLoading.value = false
  }

  function logout() {
    user.value = null
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  return {
    user,
    isLoading,
    isLoggedIn,
    currentUser,
    signup,
    login,
    logout
  }
})
