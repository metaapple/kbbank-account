<template>
  <div class="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
    <div class="mb-8 text-center">
      <h2 class="mb-2 text-3xl font-bold text-gray-800">회원가입</h2>
      <p class="text-gray-600">새로운 계정을 만들어보세요</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </p>

      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">이름</label>
        <input
          v-model="name"
          type="text"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="홍길동"
        />
      </div>

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
          placeholder="최소 6자리"
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">비밀번호 확인</label>
        <input
          v-model="confirmPassword"
          type="password"
          class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="비밀번호를 다시 입력하세요"
        />
      </div>

      <button
        :disabled="loading"
        type="submit"
        class="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {{ loading ? "가입 처리 중..." : "회원가입" }}
      </button>
    </form>

    <div class="mt-6 text-center text-gray-600">
      이미 계정이 있으신가요?
      <RouterLink class="font-semibold text-orange-500 hover:text-orange-600" to="/login">
        로그인
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

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");

function handleSubmit() {
  error.value = "";

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = "모든 필드를 입력해주세요.";
    return;
  }

  if (password.value.length < 6) {
    error.value = "비밀번호는 최소 6자 이상이어야 합니다.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  loading.value = true;
  setTimeout(() => {
    auth.signup(name.value, email.value);
    loading.value = false;
    router.push("/dashboard");
  }, 800);
}
</script>
