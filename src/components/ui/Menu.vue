<template>
  <div>
    <div class="profile-container">
      <a href="javascript:void(0)" class="profile-button" @click="toggleProfileMenu">
        <span>Profile</span>
      </a>
      <ProfileDropdown
          :isVisible="isProfileMenuOpen"
          @showLogin="showLogin"
          @showRegister="showRegister"
          @showProfile="showProfile"
          @logout="handleLogout"
          @close="isProfileMenuOpen = false"
      />
    </div>

    <a href="javascript:void(0)" class="bottom-button" @click="toggleMenu">
      <span>Menu</span>
    </a>

    <div v-if="isMenuOpen" class="fullscreen-menu" @click="toggleMenu">
      <div class="menu-container" @click.stop>
        <a href="javascript:void(0)" class="menu-button" @click="showInventory">Inventory</a>
        <a href="javascript:void(0)" class="menu-button" @click="showVitrine">Vitrine</a>
        <a href="javascript:void(0)" class="menu-button" @click="showNoIdea">NoIdea</a>
        <a href="javascript:void(0)" class="menu-button" @click="showSettings">Settings</a>
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

    <div v-if="activeComponent === 'settings'" class="component-container">
      <Settings @close="closeAuth" />
    </div>

    <Login
        v-if="activeComponent === 'login'"
        @success="closeAuth"
        @cancel="closeAuth"
    />

    <Register
        v-if="activeComponent === 'register'"
        @success="closeAuth"
        @cancel="closeAuth"
    />

    <Profile
        v-if="activeComponent === 'profile'"
        @close="closeAuth"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Inventory from "./inventory/Inventory.vue"
import AuthService from "@/js/auth/authService.js"
import ProfileDropdown from "@/components/ui/auth/ProfileDropdown.vue"
import Login from "@/components/ui/auth/Login.vue"
import Register from "@/components/ui/auth/Register.vue"
import Profile from "@/components/ui/auth/Profile.vue"
import Settings from "@/components/ui/Settings.vue"

const isMenuOpen = ref(false)
const activeComponent = ref(null)
const isProfileMenuOpen = ref(false)

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

function showSettings() {
  activeComponent.value = 'settings'
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

function showProfile() {
  activeComponent.value = 'profile'
  isProfileMenuOpen.value = false
}

function closeAuth() {
  activeComponent.value = null
}

function handleLogout() {
  AuthService.logout()
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
  transition: background-color 0.2s;
}

.profile-button:hover {
  background-color: #444;
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
  z-index: 50;
  display: flex;
  background-color: rgba(0, 0, 0, 0.7);
  flex-direction: column;
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