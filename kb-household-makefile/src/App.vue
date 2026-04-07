<template>
  <div id="kb-app">
    <!-- 로딩 스피너 오버레이 -->
    <Transition name="fade">
      <div v-if="authStore.isLoading" class="kb-spinner-overlay">
        <div class="kb-spinner mb-3"></div>
        <p class="text-muted fw-semibold" style="font-size: 0.9rem;">처리 중입니다...</p>
      </div>
    </Transition>

    <!-- 헤더 -->
    <AppHeader />

    <!-- 메인 컨텐츠 -->
    <main class="kb-main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- 푸터 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const authStore = useAuthStore()
</script>

<style scoped>
#kb-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.kb-main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

/* 스피너 페이드 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
