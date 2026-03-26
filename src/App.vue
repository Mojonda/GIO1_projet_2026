<template>
  <div class="app-wrapper">
    <div class="controls">
      <h3>Voyage dans le temps</h3>
      <p class="subtitle">Vue synchronisée 2D & 3D</p>
      
      <button 
        v-for="year in years" 
        :key="year.id"
        @click="currentYear = year.id"
        :class="{ active: currentYear === year.id }">
        {{ year.label }}
      </button>

      <div class="footer-info">
        <small>© swisstopo</small>
      </div>
    </div>

    <div class="viewer-container">
      <div class="map-box border-right">
        <div class="label-overlay">Vue 2D (Leaflet)</div>
        <Map2D :year="currentYear" />
      </div>
      
      <div class="map-box">
        <div class="label-overlay">Vue 3D (Cesium)</div>
        <Map3D :year="currentYear" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Map2D from './components/Map2D.vue'; // Ton fichier actuel renommé
import Map3D from './components/3D.vue';

const currentYear = ref('2025');

const years = [
  { id: '2025', label: '📸 2025 (actuel)' },
  { id: '2023', label: '📸 2023' },
  { id: '2020', label: '📸 2020' },
  { id: '2010', label: '📸 2010' },
  { id: '2000', label: '📸 2000' },
  { id: '1990', label: '📸 1990' },
  { id: '1946', label: '🖤 HIST 1946' }
];
</script>

<style>
/* Reset global */
html, body, #app { 
  margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden;
  font-family: sans-serif;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.viewer-container {
  display: flex;
  flex: 1; /* Prend tout l'espace sous les contrôles si besoin, ou tout l'écran */
  height: 100%;
}

.map-box {
  flex: 1;
  position: relative;
  background: #eee;
}

.border-right {
  border-right: 2px solid #333;
}

.label-overlay {
  position: absolute;
  top: 10px;
  left: 50px; /* Pour ne pas cacher les boutons de zoom Leaflet */
  z-index: 1001;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  pointer-events: none;
}

/* Ton style de contrôle existant adapté */
.controls {
  position: absolute; 
  top: 20px; right: 20px; z-index: 2000;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  width: 200px;
}

button {
  display: block; width: 100%; padding: 8px; margin-bottom: 5px;
  border: 1px solid #ccc; border-radius: 6px; cursor: pointer;
  text-align: left; background: white;
}

button.active {
  background: #007bff; color: white; border-color: #0056b3;
}
</style>