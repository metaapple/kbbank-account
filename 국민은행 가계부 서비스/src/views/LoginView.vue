<template>
  <div class="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
    <div class="mb-8 text-center">
      <h2 class="mb-2 text-3xl font-bold text-gray-800">로그인</h2>
      <p class="text-gray-600">KB 가계부에 오신 것을 환영합니다</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </p>

      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">이메일</label>
        <input
          v-model="email"
          type="email"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          v-model="password"
          type="password"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="••••••••"
        />
      </div>

      <button
        :disabled="loading"
        type="submit"
        class="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {{ loading ? "로그인 중..." : "로그인" }}
      </button>
    </form>

    <div class="mt-6 text-center text-gray-600">
      계정이 없으신가요?
      <RouterLink class="font-semibold text-orange-500 hover:text-orange-600" to="/signup">
        회원가입
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

function handleSubmit() {
  error.value = "";
  if (!email.value || !password.value) {
    error.value = "이메일과 비밀번호를 입력해주세요.";
    return;
  }

  loading.value = true;
  setTimeout(() => {
    auth.login(email.value);
    loading.value = false;
    router.push("/dashboard");
  }, 800);
}
</script>
