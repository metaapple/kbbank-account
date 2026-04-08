<template>
  <div class="w-full max-w-5xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">대시보드</h2>
        <p class="text-gray-600">수입과 지출을 편하게 관리하세요.</p>
      </div>
      <button
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="logout"
      >
        로그아웃
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-green-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-2 text-green-600 mb-1">
          <font-awesome-icon icon="arrow-up" class="text-xs" />
          <p class="text-sm font-medium">이번 달 수입</p>
        </div>
        <p class="text-2xl font-bold text-green-600">{{ formatCurrency(summary.income) }}</p>
      </div>
      <div class="rounded-xl border border-orange-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-2 text-orange-600 mb-1">
          <font-awesome-icon icon="arrow-down" class="text-xs" />
          <p class="text-sm font-medium">이번 달 지출</p>
        </div>
        <p class="text-2xl font-bold text-orange-600">{{ formatCurrency(summary.expense) }}</p>
      </div>
      <div class="rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-2 text-blue-600 mb-1">
          <font-awesome-icon icon="wallet" class="text-xs" />
          <p class="text-sm font-medium">이번 달 잔액</p>
        </div>
        <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(summary.balance) }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
          <font-awesome-icon icon="chart-pie" class="text-orange-500" />
          <span>수입/지출 막대 차트</span>
        </h3>
        <div class="flex h-44 items-end justify-around gap-6 rounded-lg bg-gray-50 px-4 py-3">
          <div v-for="bar in incomeExpenseBars" :key="bar.label" class="flex w-full max-w-24 flex-col items-center gap-2">
            <div class="relative flex h-28 w-full items-end rounded bg-gray-200/70">
              <div
                class="w-full rounded"
                :class="bar.color"
                :style="{ height: `${Math.max((bar.value / maxBarValue) * 100, bar.value ? 10 : 0)}%` }"
              />
            </div>
            <p class="text-sm font-medium text-gray-700">{{ bar.label }}</p>
            <p class="text-xs text-gray-500">{{ formatCurrency(bar.value) }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-lg font-semibold text-gray-800">수입/지출 비중</h3>
        <div class="flex flex-col items-center">
          <div
            class="mb-4 h-40 w-40 rounded-full border border-gray-200"
            :style="{ background: donutBackground }"
            aria-label="수입 지출 비중 도넛 차트"
          />
          <div class="w-full space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="flex items-center gap-2 text-gray-700"><span class="h-3 w-3 rounded-full bg-green-500" />수입</span>
              <span class="font-medium text-gray-800">{{ incomeRatio }}%</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="flex items-center gap-2 text-gray-700"><span class="h-3 w-3 rounded-full bg-orange-500" />지출</span>
              <span class="font-medium text-gray-800">{{ expenseRatio }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-lg font-semibold text-gray-800">최근 7일 지출 추세</h3>
        <div class="rounded-lg bg-gray-50 p-3">
          <svg viewBox="0 0 260 120" class="h-40 w-full">
            <polyline
              fill="none"
              stroke="#f97316"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              :points="expenseLinePoints"
            />
            <circle
              v-for="point in expensePoints"
              :key="point.key"
              :cx="point.x"
              :cy="point.y"
              r="3.5"
              fill="#ea580c"
            />
          </svg>
          <div class="mt-2 flex justify-between text-[11px] text-gray-500">
            <span v-for="d in recentExpenseTrend" :key="d.date">{{ d.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <form class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm" @submit.prevent="addItem">
      <h3 class="mb-4 text-lg font-semibold text-gray-800">거래 추가</h3>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
        <select
          v-model="form.type"
          class="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="expense">지출</option>
          <option value="income">수입</option>
        </select>
        <select
          v-model="form.title"
          class="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">{{ form.type === 'expense' ? '지출 항목 선택' : '수입 항목 선택' }}</option>
          <template v-if="form.type === 'expense'">
            <option value="식비">식비</option>
            <option value="교통비">교통비</option>
            <option value="문화생활">문화생활</option>
            <option value="쇼핑">쇼핑</option>
            <option value="주거비">주거비</option>
            <option value="기타 지출">기타 지출</option>
          </template>
          <template v-else>
            <option value="급여">급여</option>
            <option value="부수입">부수입</option>
            <option value="이자">이자</option>
            <option value="용돈">용돈</option>
            <option value="환급">환급</option>
            <option value="기타 수입">기타 수입</option>
          </template>
        </select>
        <input
          v-model.number="form.amount"
          type="number"
          min="1"
          placeholder="금액"
          class="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          v-model="form.date"
          type="date"
          class="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
      <button
        type="submit"
        class="mt-4 flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
      >
        <font-awesome-icon icon="plus" />
        <span>추가하기</span>
      </button>
    </form>

    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
        <font-awesome-icon icon="list" class="text-gray-500" />
        <span>거래 내역</span>
      </h3>
      <p v-if="!transactions.items.length" class="text-gray-500">아직 거래 내역이 없습니다.</p>
      <ul v-else class="space-y-3">
        <li
          v-for="item in transactions.items"
          :key="item.id"
          class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <div 
              class="flex h-10 w-10 items-center justify-center rounded-full"
              :class="item.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'"
            >
              <font-awesome-icon :icon="item.type === 'income' ? 'arrow-up' : 'arrow-down'" />
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ item.title }}</p>
              <p class="text-sm text-gray-500">{{ item.date }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <p :class="item.type === 'income' ? 'text-green-600' : 'text-orange-600'" class="font-semibold">
              {{ item.type === "income" ? "+" : "-" }}{{ formatCurrency(item.amount) }}
            </p>
            <button 
              class="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 hover:text-red-700" 
              @click="transactions.removeTransaction(item.id)"
              title="삭제"
            >
              <font-awesome-icon icon="circle-minus" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useTransactionStore } from "../stores/transactions";

const router = useRouter();
const auth = useAuthStore();
const transactions = useTransactionStore();

onMounted(() => {
  transactions.fetchTransactions();
});

const summary = computed(() => transactions.currentMonthSummary);
const currentMonthItems = computed(() => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return transactions.items.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
});

const incomeExpenseBars = computed(() => [
  { label: "수입", value: summary.value.income, color: "bg-green-500" },
  { label: "지출", value: summary.value.expense, color: "bg-orange-500" },
]);

const maxBarValue = computed(() => {
  const values = incomeExpenseBars.value.map((bar) => bar.value);
  return Math.max(...values, 1);
});

const totalFlow = computed(() => summary.value.income + summary.value.expense);
const incomeRatio = computed(() =>
  totalFlow.value ? Math.round((summary.value.income / totalFlow.value) * 100) : 0
);
const expenseRatio = computed(() => (totalFlow.value ? 100 - incomeRatio.value : 0));

const donutBackground = computed(() => {
  if (!totalFlow.value) {
    return "conic-gradient(#e5e7eb 0deg 360deg)";
  }
  const incomeDegrees = (summary.value.income / totalFlow.value) * 360;
  return `conic-gradient(#22c55e 0deg ${incomeDegrees}deg, #f97316 ${incomeDegrees}deg 360deg)`;
});

const recentExpenseTrend = computed(() => {
  const result = [];
  for (let i = 6; i >= 0; i -= 1) {
    const target = new Date();
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() - i);
    const targetKey = target.toISOString().slice(0, 10);

    const value = transactions.items
      .filter((item) => item.type === "expense" && item.date === targetKey)
      .reduce((sum, item) => sum + Number(item.amount), 0);

    result.push({
      date: targetKey,
      label: `${target.getMonth() + 1}/${target.getDate()}`,
      value,
    });
  }
  return result;
});

const expensePoints = computed(() => {
  const values = recentExpenseTrend.value.map((d) => d.value);
  const max = Math.max(...values, 1);
  return recentExpenseTrend.value.map((d, index) => {
    const x = 10 + index * 40;
    const y = 110 - (d.value / max) * 90;
    return { key: d.date, x, y: Number.isFinite(y) ? y : 110 };
  });
});

const expenseLinePoints = computed(() => expensePoints.value.map((p) => `${p.x},${p.y}`).join(" "));
const error = ref("");
const form = ref({
  type: "expense",
  title: "",
  amount: null,
  date: new Date().toISOString().slice(0, 10),
});

function formatCurrency(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Number(value) || 0)}원`;
}

function addItem() {
  error.value = "";
  if (!form.value.title || !form.value.amount || !form.value.date) {
    error.value = "모든 필드를 입력해주세요.";
    return;
  }

  transactions.addTransaction({
    type: form.value.type,
    title: form.value.title,
    amount: Number(form.value.amount),
    date: form.value.date,
  });

  form.value.title = "";
  form.value.amount = null;
}

function logout() {
  auth.logout();
  router.push("/login");
}
</script>
