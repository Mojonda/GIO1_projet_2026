<template>
  <div class="container">
    <div class="controls">
      <h3>Voyage dans le temps</h3>
      <p class="subtitle">Orthophotos WMTS 1926-2025</p>
      
      <button 
        @click="setYear('2025')" 
        :class="{ active: currentYear === '2025' }">
        📸 2025 (actuel)
      </button>
      
      <button 
        @click="setYear('2023')" 
        :class="{ active: currentYear === '2023' }">
        📸 2023
      </button>
      
      <button 
        @click="setYear('2020')" 
        :class="{ active: currentYear === '2020' }">
        📸 2020
      </button>
      
      <button 
        @click="setYear('2010')" 
        :class="{ active: currentYear === '2010' }">
        📸 2010
      </button>
      
      <button 
        @click="setYear('2000')" 
        :class="{ active: currentYear === '2000' }">
        📸 2000
      </button>
      
      <button 
        @click="setYear('1990')" 
        :class="{ active: currentYear === '1990' }">
        📸 1990
      </button>
      
      <button 
        @click="setYear('1946')" 
        :class="{ active: currentYear === '1946' }">
        🖤 HIST 1946
      </button>

      <div class="footer-info">
        <small>© swisstopo | ch.swisstopo.swissimage-product</small>
      </div>
    </div>

    <div id="map"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const currentYear = ref('2025');
let map = null;
let tileLayer = null;

const setYear = (year) => {
  currentYear.value = year;
  
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }

  // URL WMTS officielle avec {Time} de ton GetCapabilities
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

onMounted(() => {
  // Centre sur Lausanne/Yverdon
  map = L.map('map', {
    center: [46.7785, 6.6412],
    zoom: 16
  });

  setYear('2025');
  
  // Force resize après montage
  setTimeout(() => {
    map.invalidateSize();
  }, 400);
});
</script>

<style>
html, body, #app { 
  margin: 0; 
  padding: 0; 
  height: 100%; 
  width: 100%; 
  overflow: hidden; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.container { 
  position: relative; 
  width: 100%; 
  height: 100vh; 
}

#map { 
  width: 100%; 
  height: 100%; 
  background-color: #f0f0f0; 
}

.controls {
  position: absolute; 
  top: 20px; 
  right: 20px; 
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px; 
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15); 
  width: 220px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

h3 { 
  margin: 0 0 8px 0; 
  font-size: 1.2rem; 
  color: #333; 
  font-weight: 600;
}

.subtitle { 
  margin: 0 0 20px 0; 
  font-size: 0.85rem; 
  color: #666; 
  font-style: italic;
}

button {
  display: block; 
  width: 100%; 
  padding: 12px 10px; 
  margin-bottom: 10px;
  border: 2px solid #e0e0e0; 
  border-radius: 8px; 
  background: white;
  cursor: pointer; 
  font-weight: 500; 
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-align: left;
}

button.active { 
  background: linear-gradient(135deg, #007bff, #0056b3); 
  color: white; 
  border-color: #007bff; 
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
  transform: translateY(-1px);
}

button:hover:not(.active) { 
  background: #f8f9ff; 
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.footer-info { 
  margin-top: 15px; 
  font-size: 0.75rem; 
  color: #999; 
  text-align: center; 
  font-style: italic;
}
</style>
