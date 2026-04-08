import { defineStore } from "pinia";
import { computed, ref } from "vue";

const API_BASE_URL = "http://localhost:3000/transactions";

export const useTransactionStore = defineStore("transactions", () => {
  const items = ref([]);

  async function fetchTransactions() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Sort by date descending and then by id descending to keep consistent order if dates are same
      items.value = data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          return parseInt(b.id, 10) - parseInt(a.id, 10);
        }
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  async function addTransaction(payload) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTransaction = await response.json();
      items.value.unshift(newTransaction);
      // Re-sort after adding to maintain chronological order
      items.value.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          return parseInt(b.id, 10) - parseInt(a.id, 10);
        }
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }

  async function removeTransaction(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      items.value = items.value.filter((item) => item.id !== id);
    } catch (error) {
      console.error("Error removing transaction:", error);
    }
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
    fetchTransactions,
    addTransaction,
    removeTransaction,
    currentMonthSummary,
  };
});
