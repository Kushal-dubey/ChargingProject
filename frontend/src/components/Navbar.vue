<template>
  <nav class="navbar">
    <div class="logo"> ChargerApp</div>

    <!-- Hamburger icon for mobile -->
    <div class="hamburger" @click="isMenuOpen = !isMenuOpen">
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
    </div>

    <!-- Links -->
    <div class="nav-content" :class="{ open: isMenuOpen }">
      <ul class="nav-links">
        <li :class="{ active: activeTab === 'dashboard' }" @click="changeTab('dashboard')">
          Dashboard
        </li>
        <li :class="{ active: activeTab === 'add' }" @click="changeTab('add')">

        </li>
        <li class="logout" @click="handleLogout">Logout</li>
      </ul>

      <!-- Login / Register Buttons -->
      <div class="auth-buttons">
        <router-link to="/login" class="btn">Login</router-link>
        <router-link to="/register" class="btn">Register</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ activeTab: string }>();
const emit = defineEmits(["changeTab"]);
const isMenuOpen = ref(false);

const changeTab = (tab: string) => {
  emit("changeTab", tab);
  isMenuOpen.value = false; // close after selecting
};

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #007bff;
  padding: 12px 20px;
  border-radius: 8px;
  flex-wrap: wrap;
  position: relative;
}

.logo {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

/* Hamburger Icon */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.hamburger span {
  height: 3px;
  width: 25px;
  background: white;
  transition: 0.3s;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links li {
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-links li:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-links li.active {
  background: rgba(255, 255, 255, 0.4);
}

.logout {
  margin-left: 15px;
  font-weight: bold;
}

/* Login/Register Buttons */
.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-buttons .btn {
  background-color: white;
  color: #007bff;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 6px;
  text-decoration: none;
  transition: 0.2s;
}

.auth-buttons .btn:hover {
  background-color: #e0e0e0;
}

/*  Mobile Responsive */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-content {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    background-color: #007bff;
    width: 100%;
    margin-top: 10px;
    padding: 10px 0;
    border-radius: 6px;
  }

  .nav-content.open {
    display: flex;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    padding: 0 20px;
  }

  .auth-buttons {
    flex-direction: column;
    width: 100%;
    padding: 0 20px;
    margin-top: 10px;
  }

  .auth-buttons .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
