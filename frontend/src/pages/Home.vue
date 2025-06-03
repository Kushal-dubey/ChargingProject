<template>
  <div class="home-page">
    <!-- Background Animation Layer -->
    <div class="animated-bg"></div>

    <!-- Navbar -->
    <Navbar :activeTab="activeTab" @changeTab="activeTab = $event" />

    <!-- Custom Tab Buttons -->
    <div class="tab-nav">
      <span
        class="tab-label"
        :class="{ active: activeTab === 'dashboard' }"
        @click="activeTab = 'dashboard'"
      >
        Charging Stations
      </span>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'add' }"
        @click="activeTab = 'add'"
      >
        ➕ Add Station
      </button>
    </div>

    <!-- Dashboard / Add -->
    <transition name="fade-tab" mode="out-in">
      <div v-if="activeTab === 'dashboard'" key="dashboard" class="tab-content">
        <div v-if="loading">Loading stations...</div>
        <div v-else-if="stations.length === 0">No stations available.</div>
        <div v-else>
          <div
            class="station-card"
            v-for="station in stations"
            :key="station._id"
          >
            <h3>{{ station.name }}</h3>
            <p>Status: {{ station.status }}</p>
            <p>Power Output: {{ station.powerOutput }} kW</p>
            <p>Type: {{ station.connectorType }}</p>
            <p>Location: Lat {{ station.location.lat }}, Lng {{ station.location.lng }}</p>

            <button @click="deleteStation(station._id)" class="delete-btn">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else key="add" class="tab-content">
        <AddStationForm @station-added="fetchStations" />
      </div>
    </transition>

    <!-- Map -->
    <MapComponent />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import AddStationForm from "../components/AddStationForm.vue";
import MapComponent from "../components/MapComponent.vue";

const activeTab = ref("dashboard");
const stations = ref([]);
const loading = ref(true);

// Fetch all stations
const fetchStations = async () => {
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:5000/api/stations");
    stations.value = res.data;
  } catch (err) {
    console.error("Failed to fetch stations:", err);
  }
  loading.value = false;
};

// Delete station
const deleteStation = async (id: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    return;
  }

  const confirmed = confirm("Are you sure you want to delete this station?");
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:5000/api/stations/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Proper format
      },
    });

    alert("Station deleted");
    fetchStations(); //  Refresh station list
  } catch (err: any) {
    console.error("Delete failed:", err.response?.data || err.message);
    alert(err.response?.data?.msg || "Failed to delete station.");
  }
};
;

// Load on mount
onMounted(fetchStations);
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  position: relative;
  font-family: "Segoe UI", sans-serif;
  padding-top: 80px;
  overflow: hidden;
}

/*  Animated Background */
.animated-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(270deg, #007bff, #6610f2, #20c997, #fd7e14);
  background-size: 800% 800%;
  animation: bgAnimation 15s ease infinite;
  filter: blur(80px);
  opacity: 0.2;
}

@keyframes bgAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Navigation */
.tab-nav {
  max-width: 1000px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.tab-label {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.tab-label.active {
  color: #007bff;
}

.tab-button {
  padding: 10px 22px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s ease;
}

.tab-button:hover {
  background-color: #0056b3;
}

/* Dashboard Station Cards */
.tab-content {
  background-color: rgba(255, 255, 255, 0.93);
  max-width: 1000px;
  margin: 30px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.station-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  position: relative;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: 0.3s ease;
}

.delete-btn:hover {
  background-color: #a71d2a;
}

/* Transitions */
.fade-tab-enter-active,
.fade-tab-leave-active {
  transition: opacity 0.3s ease;
}
.fade-tab-enter-from,
.fade-tab-leave-to {
  opacity: 0;
}
</style>
