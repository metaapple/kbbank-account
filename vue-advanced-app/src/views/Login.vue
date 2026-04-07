<template>
  <div>
    <h2>Login</h2>
    <input v-model="id" placeholder="id"/>
    <button @click="login">login</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const id = ref('')
const store = useAuthStore()
const router = useRouter()

function login(){
  store.login(id.value)
  router.push('/')
}
</script>
