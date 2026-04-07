<template>
  <div>
    <h2>Dashboard</h2>
    <p>Income: {{ ledger.income }}</p>
    <p>Expense: {{ ledger.expense }}</p>
  </div>
</template>
<script setup>
import { useLedgerStore } from '../stores/ledger'
const ledger = useLedgerStore()
</script>
