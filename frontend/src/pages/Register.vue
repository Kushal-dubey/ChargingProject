<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const errorMsg = ref("");
const router = useRouter();

const handleRegister = async () => {
  errorMsg.value = "";
  try {
    const res = await axios.post("http://localhost:5000/api/auth/signup", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    console.log("✅ Backend success response:", res.data);
    alert(res.data.msg || "Registered successfully");

    // ✅ Redirect to login
    router.push("/login");

  } catch (err: any) {
    console.error("❌ Axios error:", err);

    if (err.response) {
      errorMsg.value = err.response.data.msg || "Registration failed. Server error.";
    } else {
      errorMsg.value = "Registration failed. No server response.";
    }
  }
};
</script>

<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Name</label>
        <input v-model="name" placeholder="Enter your name" required />
      </div>
      <div>
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter your email" required />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter password" required />
      </div>
      <button type="submit">Register</button>
      <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>
