<template>
  <div class="app-wrapper">
    <div class="controls central-menu">
      <h3>Voyage dans le temps</h3>
      <p class="subtitle">2D (Gauche) | 3D (Droite)</p>
      
      <div class="poi-container">
        <select @change="goToLocation" class="poi-select">
          <option value="" disabled selected>Sélectionner un lieu d'intérêt :</option>
          <option v-for="poi in pointsOfInterest" :key="poi.name" :value="poi.name">
            {{ poi.name }}
          </option>
        </select>
      </div>

      <div class="sliders-container">
        <div class="slider-group 2d-accent">
          <label>Année 2D : <strong>{{ years[index2D].label }}</strong></label>
          <input
            type="range"
            :min="0"
            :max="years.length - 1"
            v-model="index2D"
            step="1"
          >
        </div>

        <div class="vertical-separator"></div>

        <div class="slider-group 3d-accent">
          <label>Année 3D : <strong>{{ years[index3D].label }}</strong></label>
          <input
            type="range"
            :min="0"
            :max="years.length - 1"
            v-model="index3D"
            step="1"
          >
        </div>
      </div>

      <div class="footer-info">
        <small>© swisstopo | GIO1 Project</small>
      </div>
    </div>

    <div class="viewer-container">
      <div class="map-box border-right">        
        <Map2D :year="year2D" @sync-3d="handleSync" ref="map2dComponent" />
      </div>
      
      <div class="map-box">       
        <Map3D :year="year3D" ref="map3dComponent" />
        <div class="tech-indicator">Powered by CesiumJS</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Map2D from './components/Map2D.vue';
import Map3D from './components/3D.vue';

// Références aux composants pour appeler leurs fonctions flyTo
const map2dComponent = ref(null);
const map3dComponent = ref(null);

// Génération automatique des années de 1926 à 2025
const startYear = 1926;
const endYear = 2025;
const years = Array.from(
  { length: endYear - startYear + 1 }, 
  (_, i) => {
    const year = (startYear + i).toString();
    return { id: year, label: year };
  }
);

// Zones d'intérêt converties en WGS84
const pointsOfInterest = [
  { name: "Bulle", lat: 46.6212, lng: 7.0578, zoom: 14 },
  { name: "Glacier Aletsch", lat: 46.4312, lng: 8.0685, zoom: 14 },
  { name: "Grande Dixence", lat: 46.0805, lng: 7.4025, zoom: 14 },
  { name: "Gravière de Bioley-Orjulaz", lat: 46.6165, lng: 6.5815, zoom: 14 },
  { name: "Aéroport de Genève", lat: 46.2370, lng: 6.1091, zoom: 14 },
  { name: "Bure", lat: 47.4385, lng: 7.0095, zoom: 14 }
];

const index2D = ref(years.length - 1);
const index3D = ref(years.length - 1);

const year2D = computed(() => years[index2D.value].id);
const year3D = computed(() => years[index3D.value].id);

// Fonction pour déplacer les deux vues vers un lieu choisi
const goToLocation = (event) => {
  const poi = pointsOfInterest.find(p => p.name === event.target.value);
  if (poi) {
    if (map2dComponent.value?.flyTo) map2dComponent.value.flyTo(poi.lat, poi.lng, poi.zoom);
    if (map3dComponent.value?.flyTo) map3dComponent.value.flyTo(poi.lat, poi.lng, poi.zoom);
  }
};

const handleSync = (data) => {

  if (map3dComponent.value && data) {
    map3dComponent.value.flyTo(data.lat, data.lng, data.zoom);
  }
};


</script>

<style>
html, body, #app { 
  margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.app-wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
}

.viewer-container {
  display: flex;
  flex: 1;
  width: 100%;
}

.map-box {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.border-right {
  border-right: 3px solid #333;
}


/* Menu Central */
.central-menu {
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
  z-index: 2000; background: rgba(255, 255, 255, 0.95); padding: 1px 10px;
  border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: auto; min-width: 400px; backdrop-filter: blur(10px); text-align: center;
}

.poi-container { margin: 10px 0 15px 0; }
.poi-select {
  width: 100%; padding: 5px 15px; border-radius: 20px; border: 1px solid #ddd;
  background: #f9f9f9; font-size: 0.9rem; cursor: pointer; outline: none;
}

h3 { margin: 0; font-size: 1rem; color: #333; }
.subtitle { margin: 0 0 10px 0; font-size: 0.8rem; color: #666; }

.sliders-container { display: flex; align-items: center; gap: 20px; }
.slider-group { flex: 1; }
.slider-group label { display: block; font-size: 0.9rem; margin-bottom: 5px; }

.vertical-separator { width: 1px; height: 10px; background: #ddd; }

input[type="range"] { width: 100%; cursor: pointer; }


.footer-info { margin-top: 0px; font-size: 0.7rem; color: #bbb; }
.tech-indicator {
  position: absolute; bottom: 10px; right: 10px; z-index: 1001;
  font-size: 10px; color: rgba(255, 255, 255, 0.4); text-transform: uppercase;
}
</style>