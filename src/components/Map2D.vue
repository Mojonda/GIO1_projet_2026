<template>
  <div class="map-container">
    <div id="map"></div>
    
    <button class="sync-btn" @click="request3DSync">
      🎯 Aligner la 3D sur cette vue
    </button>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Propriétés reçues du parent (App.vue)
const props = defineProps({
  year: {
    type: String,
    default: '2025'
  }
});

// Événements envoyés au parent
const emit = defineEmits(['sync-3d']);

let map = null;
let tileLayer = null;

/**
 * Met à jour la couche WMTS swisstopo selon l'année
 */
const setYear = (year) => {
  if (!map) return;

  // Nettoyage de la couche précédente
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }

  const time = year;
  const layerId = year === '1946' 
    ? 'ch.swisstopo.swissimage-product_1946' 
    : 'ch.swisstopo.swissimage-product';
  
  const url = `https://wmts.geo.admin.ch/1.0.0/${layerId}/default/${time}/3857/{z}/{x}/{y}.jpeg`;

  tileLayer = L.tileLayer(url, {
    attribution: '&copy; <a href="https://www.swisstopo.admin.ch/">swisstopo</a>',
    maxZoom: 20,
    minZoom: 2,
    tileSize: 256
  });

  tileLayer.addTo(map);
};

/**
 * Capture la position actuelle et l'envoie au parent pour la 3D
 */
const request3DSync = () => {
  if (!map) return;
  
  const center = map.getCenter();
  const zoom = map.getZoom();

  // On émet l'événement vers App.vue
  emit('sync-3d', {
    lat: center.lat,
    lng: center.lng,
    zoom: zoom
  });
};

/**
 * NOUVEAU : Permet de déplacer la carte depuis le parent (App.vue)
 */
const flyTo = (lat, lng, zoom) => {
  if (map) {
    map.flyTo([lat, lng], zoom, {
      animate: true,
      duration: 1.5
    });
  }
};

// On expose la fonction flyTo pour qu'elle soit accessible via les refs dans App.vue
defineExpose({ flyTo });

// Surveiller le changement d'année (boutons du menu)
watch(() => props.year, (newYear) => {
  setYear(newYear);
});

onMounted(() => {
  // Initialisation de la carte Leaflet
  map = L.map('map', {
    center: [46.7785, 6.6412], // Yverdon-les-Bains par défaut
    zoom: 16,
    zoomControl: false // Zoom désactivé pour laisser la place au label 2D
  });

  // Chargement de la couche initiale
  setYear(props.year);
  
  // Correction de l'affichage après le montage (important pour Flexbox)
  setTimeout(() => {
    map.invalidateSize();
  }, 400);
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

#map { 
  width: 100%; 
  height: 100%; 
  background-color: #f0f0f0; 
}

/* Style du bouton de synchronisation - Conservé tel quel */
.sync-btn {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  
  background: white;
  color: #333;
  border: 2px solid #007bff;
  border-radius: 25px;
  padding: 5px 10px;
  
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sync-btn:hover {
  background: #007bff;
  color: white;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,123,255,0.4);
}

.sync-btn:active {
  transform: translateX(-50%) translateY(0);
}

/* Ajustement des contrôles Leaflet */
:deep(.leaflet-bottom.leaflet-left) {
  margin-bottom: 20px;
}
</style>