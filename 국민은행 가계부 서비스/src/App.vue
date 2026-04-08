<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
    <header class="border-b border-orange-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <font-awesome-icon icon="piggy-bank" class="text-2xl text-amber-500 animate-pulse" />
          <span>국민은행 가계부 서비스</span>
        </h1>
        <nav class="flex items-center gap-4 text-sm">
          <RouterLink v-if="!auth.isAuthenticated" class="flex items-center gap-1 text-gray-600 hover:text-orange-500" to="/login">
            <font-awesome-icon icon="user" />
            <span>로그인</span>
          </RouterLink>
          <RouterLink v-if="!auth.isAuthenticated" class="flex items-center gap-1 text-gray-600 hover:text-orange-500" to="/signup">
            <font-awesome-icon icon="plus" />
            <span>회원가입</span>
          </RouterLink>
          <RouterLink
            v-if="auth.isAuthenticated"
            class="flex items-center gap-1 text-gray-600 hover:text-orange-500"
            to="/dashboard"
          >
            <font-awesome-icon icon="house" />
            <span>대시보드</span>
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
