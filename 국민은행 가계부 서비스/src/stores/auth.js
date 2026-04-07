import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);

  const isAuthenticated = computed(() => Boolean(user.value));

  function login(email) {
    user.value = { email };
  }

  function signup(name, email) {
    user.value = { name, email };
  }

  function logout() {
    user.value = null;
  }

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };
});
