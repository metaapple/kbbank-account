<template>
  <div class="w-100" style="max-width: 1000px;">

    <!-- 웰컴 배너 -->
    <div class="kb-welcome-card mb-4 p-4 p-lg-5">
      <div class="row align-items-center">
        <div class="col-lg-7 mb-3 mb-lg-0">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="kb-badge-success">
              <i class="bi bi-check-circle-fill me-1"></i>로그인 성공
            </span>
          </div>
          <h1 class="fw-bold text-white mb-1" style="font-size:1.8rem;">
            안녕하세요, {{ authStore.currentUser?.name }}님! 👋
          </h1>
          <p class="mb-0" style="color:rgba(255,255,255,0.85); font-size:0.95rem;">
            오늘도 스마트한 가계부 관리를 시작해보세요
          </p>
        </div>
        <div class="col-lg-5">
          <div class="d-flex flex-wrap gap-2 justify-content-lg-end">
            <!-- 월 선택 -->
            <input
              v-model="store.selectedMonth"
              type="month"
              class="form-control kb-month-input"
            />
            <!-- 내역 추가 버튼 -->
            <button class="btn kb-add-btn" @click="txModal?.open()">
              <i class="bi bi-plus-lg me-1"></i>내역 추가
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 요약 카드 -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="kb-stat-card p-3 h-100">
          <div class="kb-stat-icon mb-2" style="background:linear-gradient(135deg,#28a745,#20c997);">
            <i class="bi bi-arrow-up-circle-fill text-white"></i>
          </div>
          <div class="text-muted" style="font-size:0.78rem;">이번달 수입</div>
          <div class="fw-bold" style="color:#28a745; font-size:1.05rem;">{{ store.totalIncome.toLocaleString() }}원</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kb-stat-card p-3 h-100">
          <div class="kb-stat-icon mb-2" style="background:linear-gradient(135deg,#dc3545,#e83e8c);">
            <i class="bi bi-arrow-down-circle-fill text-white"></i>
          </div>
          <div class="text-muted" style="font-size:0.78rem;">이번달 지출</div>
          <div class="fw-bold" style="color:#dc3545; font-size:1.05rem;">{{ store.totalExpense.toLocaleString() }}원</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kb-stat-card p-3 h-100">
          <div class="kb-stat-icon mb-2" style="background:linear-gradient(135deg,var(--kb-orange),var(--kb-orange-dark));">
            <i class="bi bi-piggy-bank-fill text-white"></i>
          </div>
          <div class="text-muted" style="font-size:0.78rem;">잔액</div>
          <div
            class="fw-bold"
            :style="{ color: store.balance >= 0 ? 'var(--kb-orange-dark)' : '#dc3545', fontSize:'1.05rem' }"
          >{{ store.balance.toLocaleString() }}원</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kb-stat-card p-3 h-100">
          <div class="kb-stat-icon mb-2" style="background:linear-gradient(135deg,#6610f2,#6f42c1);">
            <i class="bi bi-list-check text-white"></i>
          </div>
          <div class="text-muted" style="font-size:0.78rem;">거래 건수</div>
          <div class="fw-bold" style="color:#6610f2; font-size:1.05rem;">{{ store.filteredByMonth.length }}건</div>
        </div>
      </div>
    </div>

    <!-- 차트 + 예산 -->
    <div class="row g-4 mb-4">
      <div class="col-lg-7">
        <MonthlyChart />
      </div>
      <div class="col-lg-5">
        <BudgetPanel />
      </div>
    </div>

    <!-- 거래 내역 + 카테고리 관리 -->
    <div class="row g-4">
      <div class="col-lg-7">
        <div class="kb-card p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="fw-bold mb-0" style="color:var(--kb-dark);">
              <i class="bi bi-receipt me-2" style="color:var(--kb-orange);"></i>거래 내역
              <span class="ms-2 text-muted fw-normal" style="font-size:0.82rem;">({{ store.filteredByMonth.length }}건)</span>
            </h5>
            <!-- 필터 -->
            <div class="d-flex gap-1">
              <button
                v-for="f in ['all','income','expense']"
                :key="f"
                class="kb-filter-btn"
                :class="{ active: typeFilter === f }"
                @click="typeFilter = f"
              >{{ { all:'전체', income:'수입', expense:'지출' }[f] }}</button>
            </div>
          </div>

          <!-- 내역 목록 -->
          <div style="max-height:420px; overflow-y:auto; padding-right:4px;">
            <TransitionGroup name="tx-list">
              <div
                v-for="tx in filteredList"
                :key="tx.id"
                class="kb-tx-item d-flex align-items-center p-2 rounded-3 mb-1"
              >
                <div class="kb-tx-icon me-3" :style="{ background: catColor(tx.category) + '22' }">
                  <i :class="catIcon(tx.category)" :style="{ color: catColor(tx.category) }"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-semibold" style="font-size:0.9rem;color:var(--kb-dark);">{{ tx.name }}</div>
                  <div class="text-muted" style="font-size:0.75rem;">
                    {{ tx.date }} · {{ tx.category }}
                    <span v-if="tx.memo" class="ms-1">· {{ tx.memo }}</span>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <div
                    class="fw-bold"
                    :style="{ color: tx.type === 'income' ? '#28a745' : '#dc3545', fontSize:'0.92rem' }"
                  >{{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount.toLocaleString() }}원</div>
                  <button class="kb-del-btn" @click="store.deleteTransaction(tx.id)" title="삭제">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </TransitionGroup>
            <div v-if="filteredList.length === 0" class="text-center py-5 text-muted">
              <i class="bi bi-inbox fs-2 d-block mb-2"></i>
              거래 내역이 없습니다
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <CategoryManager />
      </div>
    </div>

    <!-- 거래 추가 모달 -->
    <TransactionModal ref="txModal" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore }      from '@/stores/auth.js'
import { useHouseholdStore } from '@/stores/household.js'
import MonthlyChart      from '@/components/MonthlyChart.vue'
import BudgetPanel       from '@/components/BudgetPanel.vue'
import CategoryManager   from '@/components/CategoryManager.vue'
import TransactionModal  from '@/components/TransactionModal.vue'

const authStore  = useAuthStore()
const store      = useHouseholdStore()
const txModal    = ref(null)
const typeFilter = ref('all')

const filteredList = computed(() => {
  const base = [...store.filteredByMonth].sort((a, b) => b.date.localeCompare(a.date))
  if (typeFilter.value === 'all') return base
  return base.filter(t => t.type === typeFilter.value)
})

// 카테고리별 색/아이콘
const CAT_MAP = {
  '식비':         { icon: 'bi bi-basket2-fill',      color: '#E8941A' },
  '카페':         { icon: 'bi bi-cup-hot-fill',       color: '#8B5CF6' },
  '외식':         { icon: 'bi bi-egg-fried',          color: '#EC4899' },
  '쇼핑':         { icon: 'bi bi-bag-fill',           color: '#06B6D4' },
  '교통':         { icon: 'bi bi-bus-front-fill',     color: '#10B981' },
  '문화/여가':    { icon: 'bi bi-film',               color: '#F59E0B' },
  '의료/건강':    { icon: 'bi bi-heart-pulse-fill',   color: '#EF4444' },
  '주거/관리비':  { icon: 'bi bi-house-fill',         color: '#6366F1' },
  '교육':         { icon: 'bi bi-book-fill',          color: '#14B8A6' },
  '급여/수입':    { icon: 'bi bi-wallet2',            color: '#28a745' },
  '용돈':         { icon: 'bi bi-cash-coin',          color: '#28a745' },
  '부업':         { icon: 'bi bi-briefcase-fill',     color: '#20c997' },
  '투자수익':     { icon: 'bi bi-graph-up-arrow',     color: '#0dcaf0' },
  '기타':         { icon: 'bi bi-three-dots',         color: '#94A3B8' },
  '기타수입':     { icon: 'bi bi-plus-circle-fill',   color: '#6ea8fe' },
}
const catIcon  = (c) => (CAT_MAP[c] || CAT_MAP['기타']).icon
const catColor = (c) => (CAT_MAP[c] || CAT_MAP['기타']).color
</script>

<style scoped>
.kb-welcome-card {
  background: linear-gradient(135deg, var(--kb-orange) 0%, var(--kb-orange-dark) 60%, #c97a12 100%);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(245,166,35,0.4);
}

.kb-month-input {
  border: 2px solid rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.15);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  width: auto;
  backdrop-filter: blur(4px);
}
.kb-month-input:focus {
  border-color: rgba(255,255,255,0.7);
  outline: none;
  box-shadow: none;
  background: rgba(255,255,255,0.25);
}

.kb-add-btn {
  background: white;
  color: var(--kb-orange-deeper);
  font-weight: 700;
  border-radius: 12px;
  padding: 0.5rem 1.1rem;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  transition: all 0.2s;
}
.kb-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.kb-stat-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid rgba(245,166,35,0.08);
  transition: all 0.25s;
}
.kb-stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }

.kb-stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

/* 거래 내역 */
.kb-tx-item {
  transition: background 0.15s;
  cursor: default;
}
.kb-tx-item:hover { background: var(--kb-orange-pale); }

.kb-tx-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.kb-del-btn {
  background: none;
  border: none;
  color: #ccc;
  padding: 4px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.85rem;
}
.kb-del-btn:hover { color: #dc3545; background: #fff0f0; }

/* 필터 버튼 */
.kb-filter-btn {
  border: 1.5px solid #e8e8e8;
  background: #f8f8f8;
  color: #999;
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.kb-filter-btn.active {
  background: var(--kb-orange);
  border-color: var(--kb-orange);
  color: white;
}

/* 리스트 트랜지션 */
.tx-list-enter-active, .tx-list-leave-active { transition: all 0.25s ease; }
.tx-list-enter-from { opacity: 0; transform: translateX(-16px); }
.tx-list-leave-to   { opacity: 0; transform: translateX(16px); }
</style>
