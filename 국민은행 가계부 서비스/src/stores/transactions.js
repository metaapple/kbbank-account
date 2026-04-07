import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTransactionStore = defineStore("transactions", () => {
  const items = ref([]);

  function addTransaction(payload) {
    items.value.unshift({
      ...payload,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
  }

  function removeTransaction(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  const currentMonthSummary = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentItems = items.value.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = currentItems
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = currentItems
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  });

  return {
    items,
    addTransaction,
    removeTransaction,
    currentMonthSummary,
  };
});
