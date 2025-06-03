<template>
  <div>
    <div v-for="station in stations" :key="station._id" class="station-card">
      <h3>{{ station.name }}</h3>
      <p>Status: {{ station.status }}</p>
      <p>Power Output: {{ station.powerOutput }} kW</p>
      <p>Type: {{ station.connectorType }}</p>
      <p>Location: Lat {{ station.location.lat }}, Lng {{ station.location.lng }}</p>

      <!-- 🆕 Update Button -->
      <button @click="selectForUpdate(station)" class="update-btn">✏️ Update</button>
    </div>

    <!-- 🧾 Update Form (Conditional) -->
    <div v-if="selectedStation" class="update-form">
      <h3>Update Station</h3>
      <input v-model="selectedStation.name" placeholder="Station Name" />
      <input v-model.number="selectedStation.powerOutput" placeholder="Power Output (kW)" />
      <input v-model="selectedStation.connectorType" placeholder="Connector Type" />
      <button @click="submitUpdate"> Save</button>
      <button @click="cancelUpdate"> Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const stations = ref<any[]>([]);
const selectedStation = ref<any>(null);

// Load all stations
const fetchStations = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/stations");
    stations.value = res.data;
  } catch (err) {
    console.error("Failed to load stations:", err);
  }
};

onMounted(fetchStations);

// Select station for editing
const selectForUpdate = (station: any) => {
  selectedStation.value = { ...station }; // clone
};

// Cancel update
const cancelUpdate = () => {
  selectedStation.value = null;
};

// Submit updated data
const submitUpdate = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/stations/update/${selectedStation.value._id}`,
      selectedStation.value,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    alert("✅ Station updated successfully!");
    selectedStation.value = null;
    fetchStations(); // refresh
  } catch (err) {
    console.error("❌ Failed to update:", err);
    alert("Update failed.");
  }
};
</script>

<style scoped>
.station-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
}

.update-btn {
  margin-top: 10px;
  background: #ffcc00;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.update-form {
  background: #fff8e1;
  padding: 20px;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
</style>
