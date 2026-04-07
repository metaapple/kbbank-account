import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLedgerStore = defineStore('ledger', () => {
  const items = ref([])

  function add(item) { items.value.push(item) }

  const income = computed(()=> items.value.filter(i=>i.type==='income').reduce((a,b)=>a+b.amount,0))
  const expense = computed(()=> items.value.filter(i=>i.type==='expense').reduce((a,b)=>a+b.amount,0))

  return { items, add, income, expense }
})
