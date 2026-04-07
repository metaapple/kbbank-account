<template>
  <div class="kb-card p-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h5 class="fw-bold mb-0" style="color:var(--kb-dark);">
        <i class="bi bi-bar-chart-fill me-2" style="color:var(--kb-orange);"></i>월별 수입/지출
      </h5>
      <div class="d-flex gap-3">
        <div class="d-flex align-items-center gap-1">
          <span class="legend-dot" style="background:#28a745;"></span>
          <span class="text-muted" style="font-size:0.78rem;">수입</span>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="legend-dot" style="background:var(--kb-orange);"></span>
          <span class="text-muted" style="font-size:0.78rem;">지출</span>
        </div>
      </div>
    </div>

    <!-- SVG 차트 -->
    <div class="chart-wrap">
      <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="w-100" style="overflow:visible;">
        <!-- 그리드 라인 -->
        <line
          v-for="y in gridYs"
          :key="y"
          :x1="padL" :y1="y"
          :x2="svgW - padR" :y2="y"
          stroke="#f0f0f0" stroke-width="1"
        />
        <!-- 그리드 레이블 -->
        <text
          v-for="(y, i) in gridYs"
          :key="'gl'+i"
          :x="padL - 8" :y="y + 4"
          text-anchor="end"
          font-size="11"
          fill="#bbb"
        >{{ gridLabels[i] }}</text>

        <!-- 바 그룹 -->
        <g v-for="(month, i) in stats" :key="month.key">
          <!-- 수입 바 -->
          <rect
            :x="barX(i, 'income')"
            :y="barY(month.income)"
            :width="barW"
            :height="barH(month.income)"
            :fill="hoveredBar === `${i}-income` ? '#1e8c3a' : '#28a745'"
            rx="4"
            style="cursor:pointer; transition: fill 0.15s;"
            @mouseenter="hoveredBar = `${i}-income`; tooltip = { x: barX(i,'income') + barW/2, y: barY(month.income) - 6, val: month.income, label: month.label + ' 수입' }"
            @mouseleave="hoveredBar = null; tooltip = null"
          />
          <!-- 지출 바 -->
          <rect
            :x="barX(i, 'expense')"
            :y="barY(month.expense)"
            :width="barW"
            :height="barH(month.expense)"
            :fill="hoveredBar === `${i}-expense` ? 'var(--kb-orange-dark)' : 'var(--kb-orange)'"
            rx="4"
            style="cursor:pointer; transition: fill 0.15s;"
            @mouseenter="hoveredBar = `${i}-expense`; tooltip = { x: barX(i,'expense') + barW/2, y: barY(month.expense) - 6, val: month.expense, label: month.label + ' 지출' }"
            @mouseleave="hoveredBar = null; tooltip = null"
          />
          <!-- X축 레이블 -->
          <text
            :x="barX(i,'income') + barW"
            :y="svgH - padB + 16"
            text-anchor="middle"
            font-size="12"
            :font-weight="month.key === store.selectedMonth ? '700' : '400'"
            :fill="month.key === store.selectedMonth ? 'var(--kb-orange-dark)' : '#999'"
          >{{ month.label }}</text>
        </g>

        <!-- 툴팁 -->
        <g v-if="tooltip" style="pointer-events:none;">
          <rect
            :x="tooltip.x - 58" :y="tooltip.y - 26"
            width="116" height="24"
            rx="6" fill="rgba(26,26,46,0.88)"
          />
          <text
            :x="tooltip.x" :y="tooltip.y - 10"
            text-anchor="middle"
            font-size="11"
            fill="white"
          >{{ tooltip.label }}: {{ tooltip.val.toLocaleString() }}원</text>
        </g>
      </svg>
    </div>

    <!-- 하단 요약 -->
    <div class="row g-3 mt-3">
      <div class="col-4 text-center">
        <div class="text-muted" style="font-size:0.78rem;">이번달 수입</div>
        <div class="fw-bold" style="color:#28a745; font-size:1rem;">{{ store.totalIncome.toLocaleString() }}원</div>
      </div>
      <div class="col-4 text-center" style="border-left:1px solid #f0f0f0; border-right:1px solid #f0f0f0;">
        <div class="text-muted" style="font-size:0.78rem;">이번달 지출</div>
        <div class="fw-bold" style="color:var(--kb-orange-dark); font-size:1rem;">{{ store.totalExpense.toLocaleString() }}원</div>
      </div>
      <div class="col-4 text-center">
        <div class="text-muted" style="font-size:0.78rem;">잔액</div>
        <div
          class="fw-bold"
          :style="{ color: store.balance >= 0 ? 'var(--kb-dark)' : '#dc3545', fontSize:'1rem' }"
        >{{ store.balance.toLocaleString() }}원</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHouseholdStore } from '@/stores/household.js'

const store = useHouseholdStore()

const svgW = 520
const svgH = 220
const padL = 52
const padR = 12
const padT = 20
const padB = 28
const chartH = svgH - padT - padB
const chartW = svgW - padL - padR

const stats = computed(() => store.monthlyStats)
const maxVal = computed(() => Math.max(...stats.value.flatMap(m => [m.income, m.expense]), 1))

// 그리드 (4단계)
const gridYs    = computed(() => [0,1,2,3].map(i => padT + (chartH / 3) * i))
const gridLabels = computed(() => [0,1,2,3].map(i => {
  const v = maxVal.value * (1 - i / 3)
  return v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : v >= 1000 ? (v/1000).toFixed(0) + 'K' : v.toFixed(0)
}))

const groupW = computed(() => chartW / stats.value.length)
const barW = computed(() => Math.max(8, groupW.value * 0.3))
const gap  = computed(() => barW.value * 0.35)

const barX = (i, type) => {
  const cx = padL + groupW.value * i + groupW.value / 2
  return type === 'income' ? cx - barW.value - gap.value / 2 : cx + gap.value / 2
}
const barY = (val) => padT + chartH * (1 - val / maxVal.value)
const barH = (val) => chartH * (val / maxVal.value)

const hoveredBar = ref(null)
const tooltip    = ref(null)
</script>

<style scoped>
.chart-wrap { width: 100%; overflow-x: auto; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
</style>
