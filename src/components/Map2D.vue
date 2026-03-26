<template>
  <div id="map"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// On reçoit l'année depuis App.vue
const props = defineProps({
  year: {
    type: String,
    default: '2025'
  }
});

let map = null;
let tileLayer = null;

const setYear = (year) => {
  if (!map) return;

  // Supprime l'ancienne couche si elle existe
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }

  // Logique swisstopo
  const time = year === '1946' ? '1946' : year;
  const layerId = year === '1946' ? 'ch.swisstopo.swissimage-product_1946' : 'ch.swisstopo.swissimage-product';
  
  const url = `https://wmts.geo.admin.ch/1.0.0/${layerId}/default/${time}/3857/{z}/{x}/{y}.jpeg`;

  tileLayer = L.tileLayer(url, {
    attribution: '&copy; <a href="https://www.swisstopo.admin.ch/">swisstopo</a>',
    maxZoom: 20,
    minZoom: 2,
    tileSize: 256
  });

  tileLayer.addTo(map);
};

// IMPORTANT : On surveille le changement de l'année
watch(() => props.year, (newYear) => {
  setYear(newYear);
});

onMounted(() => {
  // Initialisation de la carte
  map = L.map('map', {
    center: [46.7785, 6.6412],
    zoom: 16,
    zoomControl: true
  });

  // Charger l'année initiale
  setYear(props.year);
  
  setTimeout(() => {
    map.invalidateSize();
  }, 400);
});
</script>

<style scoped>
#map { 
  width: 100%; 
  height: 100%; 
  background-color: #f0f0f0; 
  z-index: 1;
}

/* On masque les contrôles Leaflet par défaut si on veut un look épuré, 
   ou on les laisse à gauche */
:deep(.leaflet-control-zoom) {
  margin-top: 50px;
}
</style>