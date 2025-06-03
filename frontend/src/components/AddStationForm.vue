<template>
  <div class="form-container">
    <h2>Add Charging Station</h2>
    <form @submit.prevent="handleAdd">
      <label>Station Name</label>
      <input v-model="name" placeholder="Station Name" required />

      <label>Latitude</label>
      <input v-model.number="lat" placeholder="Latitude" required type="number" />

      <label>Longitude</label>
      <input v-model.number="lng" placeholder="Longitude" required type="number" />

      <label>Power Output (kW)</label>
      <input v-model.number="powerOutput" placeholder="Power Output" required type="number" />

      <label>Status</label>
      <select v-model="status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <label>Connector Type</label>
      <select v-model="connectorType">
        <option value="AC">AC</option>
        <option value="DC">DC</option>
      </select>

      <button type="submit">➕ Add Station</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const name = ref("");
const lat = ref(0);
const lng = ref(0);
const status = ref("active");
const powerOutput = ref(0);
const connectorType = ref("AC");

const handleAdd = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in. Please login first.");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/stations/add",
      {
        name: name.value,
        location: { lat: lat.value, lng: lng.value },
        status: status.value,
        powerOutput: powerOutput.value,
        connectorType: connectorType.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert(res.data.msg || "Station added successfully!");
    name.value = "";
    lat.value = 0;
    lng.value = 0;
    powerOutput.value = 0;
    status.value = "active";
    connectorType.value = "AC";
  } catch (err: any) {
    console.error("Error adding station:", err.response?.data || err.message);
    alert(err.response?.data?.msg || "Failed to add station.");
  }
};
</script>

<style scoped>
.form-container {
  background: #f0f8ff;
  border: 1px solid #ddd;
  padding: 24px;
  border-radius: 10px;
  max-width: 500px;
  margin: 20px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: "Segoe UI", sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  font-weight: 600;
  color: #555;
}

input,
select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #bbb;
  border-radius: 6px;
}

button {
  background-color: #28a745;
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background-color: #218838;
}
</style>
