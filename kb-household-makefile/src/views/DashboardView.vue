<template>
  <div class="w-100" style="max-width: 900px;">
    <!-- 웰컴 배너 -->
    <div class="kb-welcome-card mb-4 p-4 p-md-5">
      <div class="row align-items-center">
        <div class="col-md-7 mb-3 mb-md-0">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="kb-badge-success">
              <i class="bi bi-check-circle-fill me-1"></i>로그인 성공
            </span>
          </div>
          <h1 class="fw-bold text-white mb-1" style="font-size: 1.8rem;">
            안녕하세요, {{ authStore.currentUser?.name }}님! 👋
          </h1>
          <p class="mb-0" style="color: rgba(255,255,255,0.85); font-size: 0.95rem;">
            오늘도 스마트한 가계부 관리를 시작해보세요
          </p>
        </div>
        <div class="col-md-5 text-md-end">
          <div class="d-inline-flex align-items-center gap-2 kb-date-badge">
            <i class="bi bi-calendar3" style="color: var(--kb-orange);"></i>
            <span class="fw-semibold" style="font-size: 0.9rem; color: var(--kb-dark);">{{ todayStr }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 요약 카드 -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3" v-for="stat in stats" :key="stat.label">
        <div class="kb-stat-card p-3 h-100">
          <div class="kb-stat-icon mb-2" :style="{ background: stat.bg }">
            <i :class="stat.icon" class="text-white"></i>
          </div>
          <div class="text-muted" style="font-size: 0.78rem;">{{ stat.label }}</div>
          <div class="fw-bold" :style="{ color: stat.valueColor, fontSize: '1.2rem' }">
            {{ stat.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- 최근 거래 내역 -->
    <div class="kb-card p-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h5 class="fw-bold mb-0" style="color: var(--kb-dark);">
          <i class="bi bi-list-ul me-2" style="color: var(--kb-orange);"></i>최근 거래 내역
        </h5>
        <button class="btn btn-kb-outline btn-sm px-3">
          <i class="bi bi-plus me-1"></i>내역 추가
        </button>
      </div>

      <!-- 거래 목록 -->
      <div class="kb-transaction-list">
        <div
          v-for="(tx, i) in transactions"
          :key="i"
          class="kb-transaction-item d-flex align-items-center p-3"
        >
          <div class="kb-tx-icon me-3" :style="{ background: tx.color + '20' }">
            <i :class="tx.icon" :style="{ color: tx.color }"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-semibold" style="font-size: 0.92rem; color: var(--kb-dark);">{{ tx.name }}</div>
            <div class="text-muted" style="font-size: 0.78rem;">{{ tx.date }} · {{ tx.category }}</div>
          </div>
          <div class="fw-bold" :style="{ color: tx.type === 'income' ? '#28a745' : '#dc3545', fontSize: '0.95rem' }">
            {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount.toLocaleString() }}원
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const todayStr = computed(() => {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })
})

const stats = [
  { label: '이번달 수입', value: '3,250,000원', icon: 'bi bi-arrow-up-circle-fill', bg: 'linear-gradient(135deg,#28a745,#20c997)', valueColor: '#28a745' },
  { label: '이번달 지출', value: '1,840,000원', icon: 'bi bi-arrow-down-circle-fill', bg: 'linear-gradient(135deg,#dc3545,#e83e8c)', valueColor: '#dc3545' },
  { label: '이번달 저축', value: '1,410,000원', icon: 'bi bi-piggy-bank-fill', bg: 'linear-gradient(135deg,var(--kb-orange),var(--kb-orange-dark))', valueColor: 'var(--kb-orange-dark)' },
  { label: '예산 달성률', value: '86%', icon: 'bi bi-bar-chart-fill', bg: 'linear-gradient(135deg,#6610f2,#6f42c1)', valueColor: '#6610f2' }
]

const transactions = [
  { name: '스타벅스', date: '오늘', category: '카페/음료', type: 'expense', amount: 5500, icon: 'bi bi-cup-hot-fill', color: '#8B5CF6' },
  { name: '급여', date: '어제', category: '수입', type: 'income', amount: 3250000, icon: 'bi bi-wallet2', color: '#28a745' },
  { name: 'CGV', date: '2일 전', category: '문화/여가', type: 'expense', amount: 14000, icon: 'bi bi-film', color: '#E8941A' },
  { name: '이마트', date: '3일 전', category: '식비/장보기', type: 'expense', amount: 87500, icon: 'bi bi-cart3', color: '#dc3545' },
  { name: '배달의민족', date: '4일 전', category: '배달/외식', type: 'expense', amount: 23000, icon: 'bi bi-bicycle', color: '#17a2b8' }
]
</script>

<style scoped>
.kb-welcome-card {
  background: linear-gradient(135deg, var(--kb-orange) 0%, var(--kb-orange-dark) 60%, #c97a12 100%);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(245, 166, 35, 0.4);
}

.kb-date-badge {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.kb-stat-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid rgba(245, 166, 35, 0.08);
  transition: var(--kb-transition);
}
.kb-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.kb-stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.kb-transaction-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.kb-transaction-item {
  border-radius: 12px;
  transition: background 0.2s;
  cursor: pointer;
}
.kb-transaction-item:hover {
  background: var(--kb-orange-pale);
}

.kb-tx-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
</style>
