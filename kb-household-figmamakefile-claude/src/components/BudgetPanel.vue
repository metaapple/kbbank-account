<template>
  <div class="kb-card p-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h5 class="fw-bold mb-0" style="color:var(--kb-dark);">
        <i class="bi bi-pie-chart-fill me-2" style="color:var(--kb-orange);"></i>예산 관리
      </h5>
      <span class="text-muted" style="font-size:0.82rem;">{{ store.selectedMonth }} 기준</span>
    </div>

    <!-- 초과 알림 배너 -->
    <Transition name="slide-down">
      <div v-if="overBudgetItems.length" class="kb-alert-banner mb-4">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <span>
          <strong>{{ overBudgetItems.map(b => b.category).join(', ') }}</strong>
          카테고리가 예산을 초과했습니다!
        </span>
      </div>
    </Transition>

    <!-- 예산 목록 -->
    <div class="budget-list">
      <div
        v-for="b in store.budgetStatus"
        :key="b.category"
        class="budget-item mb-3"
      >
        <div class="d-flex align-items-center justify-content-between mb-1">
          <div class="d-flex align-items-center gap-2">
            <span
              class="budget-dot"
              :style="{ background: b.color }"
            ></span>
            <span class="fw-semibold" style="font-size:0.88rem;color:var(--kb-dark);">{{ b.category }}</span>
            <span v-if="b.ratio >= 100" class="kb-over-badge">초과</span>
            <span v-else-if="b.ratio >= 80" class="kb-warn-badge">주의</span>
          </div>
          <div class="text-end">
            <span
              class="fw-bold"
              :style="{ color: b.ratio >= 100 ? '#dc3545' : b.ratio >= 80 ? '#fd7e14' : 'var(--kb-dark)', fontSize: '0.88rem' }"
            >{{ b.spent.toLocaleString() }}원</span>
            <span class="text-muted" style="font-size:0.78rem;"> / </span>
            <!-- 예산 인풋 -->
            <input
              :value="b.limit.toLocaleString()"
              type="text"
              inputmode="numeric"
              class="kb-budget-input"
              @change="onBudgetChange(b.category, $event)"
            />
            <span class="text-muted" style="font-size:0.78rem;">원</span>
          </div>
        </div>
        <!-- 프로그레스 바 -->
        <div class="kb-progress-bg">
          <div
            class="kb-progress-bar"
            :style="{
              width: b.ratio + '%',
              background: b.ratio >= 100 ? '#dc3545'
                        : b.ratio >= 80  ? '#fd7e14'
                        : b.color
            }"
          ></div>
        </div>
        <div class="d-flex justify-content-between mt-1">
          <span class="text-muted" style="font-size:0.72rem;">{{ Math.round(b.ratio) }}% 사용</span>
          <span
            :style="{ color: b.limit - b.spent < 0 ? '#dc3545' : '#28a745', fontSize:'0.72rem', fontWeight:600 }"
          >
            {{ b.limit - b.spent >= 0 ? '잔여 ' : '초과 ' }}{{ Math.abs(b.limit - b.spent).toLocaleString() }}원
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHouseholdStore } from '@/stores/household.js'

const store = useHouseholdStore()

const overBudgetItems = computed(() =>
  store.budgetStatus.filter(b => b.ratio >= 100)
)

const onBudgetChange = (category, e) => {
  const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0
  store.updateBudget(category, val)
  e.target.value = val.toLocaleString()
}
</script>

<style scoped>
.budget-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.kb-over-badge {
  background: #dc3545;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 10px;
}
.kb-warn-badge {
  background: #fd7e14;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 10px;
}

.kb-progress-bg {
  height: 8px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}
.kb-progress-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
}

.kb-budget-input {
  border: none;
  border-bottom: 2px solid var(--kb-orange);
  background: transparent;
  text-align: right;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--kb-dark);
  width: 90px;
  outline: none;
  padding: 0 2px;
}
.kb-budget-input:focus {
  border-bottom-color: var(--kb-orange-deeper);
}

.kb-alert-banner {
  background: linear-gradient(135deg, #fff3cd, #ffe8a1);
  border: 1.5px solid #ffc107;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.88rem;
  color: #856404;
  display: flex;
  align-items: center;
}

/* 슬라이드 애니메이션 */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-12px); }
.slide-down-leave-to   { opacity: 0; transform: translateY(-12px); }
</style>
