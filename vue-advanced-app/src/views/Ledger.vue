<template>
  <div>
    <h2>Ledger</h2>
    <select v-model="type">
      <option value="income">income</option>
      <option value="expense">expense</option>
    </select>
    <input v-model.number="amount" type="number"/>
    <button @click="add">add</button>

    <ul>
      <li v-for="(i,index) in ledger.items" :key="index">
        {{ i.type }} - {{ i.amount }}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useLedgerStore } from '../stores/ledger'

const ledger = useLedgerStore()
const type = ref('income')
const amount = ref(0)

function add(){
  ledger.add({ type: type.value, amount: amount.value })
}
</script>
