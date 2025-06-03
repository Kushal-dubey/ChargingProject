<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref('');

const loginUser = async () => {
  errorMsg.value = '';
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem('token', res.data.token);
    router.push('/home');
  } catch (error: any) {
    errorMsg.value = error.response?.data?.msg || 'Login failed, try again';
  }
};
</script>

<template>
  <div class="login-page">
    <div class="form-container">
      <h2>Login </h2>
      <form @submit.prevent="loginUser">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Enter your email" required />

        <label>Password</label>
        <input type="password" v-model="password" placeholder="Enter your password" required />

        <button type="submit">Login</button>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  background: rgba(255, 255, 255, 0.93);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 350px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

label {
  font-weight: 600;
  margin-top: 15px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

button {
  width: 100%;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-msg {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
