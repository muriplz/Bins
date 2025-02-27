<template>
  <div>
    <div class="profile-container">
      <a href="javascript:void(0)" class="profile-button" @click="toggleProfileMenu">
        <span>Profile</span>
      </a>
      <div v-if="isProfileMenuOpen" class="profile-dropdown">
        <div v-if="!isLoggedIn">
          <a href="javascript:void(0)" class="dropdown-item" @click="showLogin">Login</a>
          <a href="javascript:void(0)" class="dropdown-item" @click="showRegister">Register</a>
        </div>
        <div v-else>
          <span class="username">{{ username }}</span>
          <a href="javascript:void(0)" class="dropdown-item" @click="handleLogout">Logout</a>
        </div>
      </div>
    </div>

    <a href="javascript:void(0)" class="bottom-button" @click="toggleMenu">
      <span>Menu</span>
    </a>

    <div v-if="isMenuOpen" class="fullscreen-menu" @click="toggleMenu">
      <div class="menu-container" @click.stop>
        <a href="javascript:void(0)" class="menu-button" @click="showInventory">Inventory</a>
        <a href="javascript:void(0)" class="menu-button" @click="showVitrine">Vitrine</a>
        <a href="javascript:void(0)" class="menu-button" @click="showNoIdea">NoIdea</a>
      </div>
    </div>

    <div v-if="activeComponent === 'inventory'" class="inventory-container">
      <Inventory />
    </div>

    <div v-if="activeComponent === 'vitrine'" class="component-container">
      <h2>Vitrine Component</h2>
    </div>

    <div v-if="activeComponent === 'noidea'" class="component-container">
      <h2>NoIdea Component</h2>
    </div>

    <div v-if="activeComponent === 'login'" class="auth-container">
      <div class="auth-form">
        <h2>Login</h2>
        <input v-model="loginUsername" type="text" placeholder="Username" />
        <input v-model="loginPassword" type="password" placeholder="Password" />
        <button @click="login">Login</button>
        <a href="javascript:void(0)" @click="closeAuth">Cancel</a>
      </div>
    </div>

    <div v-if="activeComponent === 'register'" class="auth-container">
      <div class="auth-form">
        <h2>Register</h2>
        <input v-model="registerUsername" type="text" placeholder="Username" />
        <input v-model="registerPassword" type="password" placeholder="Password" />
        <button @click="register">Register</button>
        <a href="javascript:void(0)" @click="closeAuth">Cancel</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Inventory from "./inventory/Inventory.vue"
import AuthService from "@/js/auth/authService.js"
import Store from "@/js/auth/store.js"

const isMenuOpen = ref(false)
const activeComponent = ref(null)
const isProfileMenuOpen = ref(false)
const isLoggedIn = ref(false)
const username = ref('')

const loginUsername = ref('')
const loginPassword = ref('')
const registerUsername = ref('')
const registerPassword = ref('')

onMounted(async () => {
  const valid = await AuthService.validate()
  if (valid) {
    isLoggedIn.value = true
    username.value = Store.getUser()
  }
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value === false) {
    activeComponent.value = null
  }
}

function toggleProfileMenu() {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

function showInventory() {
  activeComponent.value = 'inventory'
  isMenuOpen.value = false
}

function showVitrine() {
  activeComponent.value = 'vitrine'
  isMenuOpen.value = false
}

function showNoIdea() {
  activeComponent.value = 'noidea'
  isMenuOpen.value = false
}

function showLogin() {
  activeComponent.value = 'login'
  isProfileMenuOpen.value = false
}

function showRegister() {
  activeComponent.value = 'register'
  isProfileMenuOpen.value = false
}

function closeAuth() {
  activeComponent.value = null
  loginUsername.value = ''
  loginPassword.value = ''
  registerUsername.value = ''
  registerPassword.value = ''
}

async function login() {
  const success = await AuthService.login(loginUsername.value, loginPassword.value)
  if (success) {
    isLoggedIn.value = true
    username.value = loginUsername.value
    closeAuth()
  }
}

async function register() {
  const success = await AuthService.register(registerUsername.value, registerPassword.value)
  if (success) {
    loginUsername.value = registerUsername.value
    loginPassword.value = registerPassword.value
    await login()
  }
}

function handleLogout() {
  AuthService.logout()
  isLoggedIn.value = false
  username.value = ''
  isProfileMenuOpen.value = false
}
</script>

<style scoped>
.profile-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 300;
}

.profile-button {
  background-color: #333;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  display: inline-block;
}

.profile-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 150px;
  z-index: 301;
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.username {
  display: block;
  padding: 10px 15px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}

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

.bottom-button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  user-select: none;
  text-decoration: none;
  display: inline-block;
}

.bottom-button:hover {
  text-decoration: none;
  color: white;
}

.fullscreen-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-button {
  display: block;
  padding: 16px 32px;
  background-color: white;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  width: 200px;
  text-align: center;
  user-select: none;
  text-decoration: none;
}

.menu-button:hover {
  background-color: #f0f0f0;
  text-decoration: none;
  color: #333;
}

.component-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inventory-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  pointer-events: none;
}

.inventory-box {
  width: 400px;
  height: 400px;
  background-color: #333;
  border: 4px solid #555;
  border-radius: 8px;
  pointer-events: auto;
}
</style>