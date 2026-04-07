<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
    <header class="border-b border-orange-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 class="text-lg font-bold text-gray-800">국민은행 가계부 서비스</h1>
        <nav class="flex items-center gap-3 text-sm">
          <RouterLink class="text-gray-600 hover:text-orange-500" to="/login">로그인</RouterLink>
          <RouterLink class="text-gray-600 hover:text-orange-500" to="/signup">회원가입</RouterLink>
          <RouterLink
            v-if="auth.isAuthenticated"
            class="text-gray-600 hover:text-orange-500"
            to="/dashboard"
          >
            대시보드
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto flex w-full max-w-7xl justify-center px-4 py-10">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();
</script>
