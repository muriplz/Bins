<template>
  <div class="auth-container">
    <div class="auth-form">
      <h2>Login</h2>
      <input v-model="loginUsername" type="text" placeholder="Username" />
      <input v-model="loginPassword" type="password" placeholder="Password" />
      <button @click="login">Login</button>
      <a href="javascript:void(0)" @click="$emit('cancel')">Cancel</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AuthService from "@/js/auth/authService.js"

const emit = defineEmits(['success', 'cancel'])

const loginUsername = ref('')
const loginPassword = ref('')

async function login() {
  const success = await AuthService.login(loginUsername.value, loginPassword.value)
  if (success) {
    emit('success')
  }
}
</script>

<style scoped>
.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 400;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-form {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.auth-form button {
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-form a {
  text-align: center;
  color: #333;
  text-decoration: none;
}
</style>