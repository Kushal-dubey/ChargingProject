<template>
  <div id="map" class="map"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { io } from "socket.io-client";

const map = ref<L.Map | null>(null);
const markers = ref<L.Marker[]>([]);
const socket = io("http://localhost:5000");

const loadMarkers = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/stations");
    const stations = res.data;

    // Remove old markers
    markers.value.forEach((marker) => map.value?.removeLayer(marker));
    markers.value = [];

    stations.forEach((station: any) => {
      const { lat, lng } = station.location;
      const marker = L.marker([lat, lng])
        .addTo(map.value!)
        .bindPopup(`
          <strong>${station.name}</strong><br/>
          Power: ${station.powerOutput} kW<br/>
          Type: ${station.connectorType}<br/>
          Status: ${station.status}
        `);
      markers.value.push(marker);
    });
  } catch (err) {
    console.error("Map loading error:", err);
  }
};

onMounted(async () => {
  map.value = L.map("map").setView([19.07, 72.87], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value);

  await loadMarkers();

  // 🔄 Listen for real-time updates
  socket.on("new-station", () => {
    console.log("📡 New station added, reloading map...");
    loadMarkers();
  });

  socket.on("station-deleted", () => {
    console.log("🗑️ Station deleted, reloading map...");
    loadMarkers();
  });

  socket.on("station-updated", () => {
    console.log("🔁 Station updated, reloading map...");
    loadMarkers();
  });
});
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}
</style>
