import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  function login(id) { user.value = { id } }
  function logout() { user.value = null }

  return { user, login, logout }
})
