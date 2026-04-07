import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHouseholdStore = defineStore('household', () => {
  // ─── State ───────────────────────────────────────────
  const transactions = ref([
    { id: 1, type: 'income',  name: '급여',       amount: 3250000, category: '급여/수입',   date: '2024-04-01', memo: '4월 월급' },
    { id: 2, type: 'expense', name: '이마트',      amount: 87500,   category: '식비',        date: '2024-04-02', memo: '장보기' },
    { id: 3, type: 'expense', name: '스타벅스',    amount: 5500,    category: '카페',        date: '2024-04-03', memo: '' },
    { id: 4, type: 'expense', name: '배달의민족',  amount: 23000,   category: '외식',        date: '2024-04-04', memo: '저녁 배달' },
    { id: 5, type: 'expense', name: 'CGV',         amount: 14000,   category: '문화/여가',   date: '2024-04-05', memo: '영화 관람' },
    { id: 6, type: 'income',  name: '부수입',      amount: 150000,  category: '급여/수입',   date: '2024-04-06', memo: '프리랜서' },
    { id: 7, type: 'expense', name: '카카오페이',  amount: 32000,   category: '쇼핑',        date: '2024-04-07', memo: '' },
    { id: 8, type: 'expense', name: '버스/지하철', amount: 7200,    category: '교통',        date: '2024-04-08', memo: '' },
  ])

  const categories = ref({
    expense: ['식비', '카페', '외식', '쇼핑', '교통', '문화/여가', '의료/건강', '주거/관리비', '교육', '기타'],
    income:  ['급여/수입', '용돈', '부업', '투자수익', '기타수입']
  })

  const budgets = ref({
    '식비':       { limit: 300000,  color: '#E8941A' },
    '카페':       { limit: 50000,   color: '#8B5CF6' },
    '외식':       { limit: 150000,  color: '#EC4899' },
    '쇼핑':       { limit: 200000,  color: '#06B6D4' },
    '교통':       { limit: 100000,  color: '#10B981' },
    '문화/여가':  { limit: 100000,  color: '#F59E0B' },
    '의료/건강':  { limit: 80000,   color: '#EF4444' },
    '주거/관리비':{ limit: 500000,  color: '#6366F1' },
    '교육':       { limit: 200000,  color: '#14B8A6' },
    '기타':       { limit: 100000,  color: '#94A3B8' },
  })

  const nextId = ref(9)
  const selectedMonth = ref(getCurrentMonth())

  // ─── Getters ──────────────────────────────────────────
  function getCurrentMonth() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const filteredByMonth = computed(() =>
    transactions.value.filter(t => t.date.startsWith(selectedMonth.value))
  )

  const totalIncome = computed(() =>
    filteredByMonth.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  )

  const totalExpense = computed(() =>
    filteredByMonth.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  )

  const balance = computed(() => totalIncome.value - totalExpense.value)

  // 월별 카테고리 지출 합계
  const expenseByCategory = computed(() => {
    const map = {}
    filteredByMonth.value
      .filter(t => t.type === 'expense')
      .forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount })
    return map
  })

  // 최근 6개월 월별 수입/지출 집계
  const monthlyStats = computed(() => {
    const result = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = `${d.getMonth() + 1}월`
      const income  = transactions.value.filter(t => t.date.startsWith(key) && t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expense = transactions.value.filter(t => t.date.startsWith(key) && t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      result.push({ key, label, income, expense })
    }
    return result
  })

  // 예산 대비 지출 현황
  const budgetStatus = computed(() => {
    return Object.entries(budgets.value).map(([cat, b]) => ({
      category: cat,
      limit: b.limit,
      color: b.color,
      spent: expenseByCategory.value[cat] || 0,
      ratio: Math.min(((expenseByCategory.value[cat] || 0) / b.limit) * 100, 100)
    }))
  })

  // ─── Actions ──────────────────────────────────────────
  function addTransaction(tx) {
    transactions.value.unshift({ ...tx, id: nextId.value++ })
  }

  function deleteTransaction(id) {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  function updateBudget(category, limit) {
    if (budgets.value[category]) {
      budgets.value[category].limit = limit
    }
  }

  function addCategory(type, name) {
    if (!categories.value[type].includes(name)) {
      categories.value[type].push(name)
      if (type === 'expense') {
        budgets.value[name] = { limit: 100000, color: '#94A3B8' }
      }
    }
  }

  function removeCategory(type, name) {
    categories.value[type] = categories.value[type].filter(c => c !== name)
    if (type === 'expense') delete budgets.value[name]
  }

  return {
    transactions, categories, budgets, selectedMonth,
    filteredByMonth, totalIncome, totalExpense, balance,
    expenseByCategory, monthlyStats, budgetStatus,
    addTransaction, deleteTransaction, updateBudget, addCategory, removeCategory,
    getCurrentMonth
  }
})
