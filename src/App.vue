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
        <div class="label-overlay overlay-left">2D : {{ year2D }}</div>
        <Map2D :year="year2D" @sync-3d="handleSync" ref="map2dComponent" />
      </div>
      
      <div class="map-box">
        <div class="label-overlay overlay-right">3D : {{ year3D }}</div>
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

const years = [
  { id: '1926', label: '1926' }, { id: '1927', label: '1927' }, { id: '1929', label: '1929' },
  { id: '1930', label: '1930' }, { id: '1931', label: '1931' }, { id: '1932', label: '1932' },
  { id: '1933', label: '1933' }, { id: '1934', label: '1934' }, { id: '1935', label: '1935' },
  { id: '1936', label: '1936' }, { id: '1937', label: '1937' }, { id: '1938', label: '1938' },
  { id: '1939', label: '1939' }, { id: '1940', label: '1940' }, { id: '1941', label: '1941' },
  { id: '1942', label: '1942' }, { id: '1943', label: '1943' }, { id: '1944', label: '1944' },
  { id: '1945', label: '1945' }, { id: '1946', label: '1946' }, { id: '1947', label: '1947' },
  { id: '1948', label: '1948' }, { id: '1949', label: '1949' }, { id: '1950', label: '1950' },
  { id: '1951', label: '1951' }, { id: '1952', label: '1952' }, { id: '1953', label: '1953' },
  { id: '1954', label: '1954' }, { id: '1955', label: '1955' }, { id: '1956', label: '1956' },
  { id: '1957', label: '1957' }, { id: '1958', label: '1958' }, { id: '1959', label: '1959' },
  { id: '1960', label: '1960' }, { id: '1961', label: '1961' }, { id: '1962', label: '1962' },
  { id: '1963', label: '1963' }, { id: '1964', label: '1964' }, { id: '1965', label: '1965' },
  { id: '1966', label: '1966' }, { id: '1967', label: '1967' }, { id: '1968', label: '1968' },
  { id: '1969', label: '1969' }, { id: '1970', label: '1970' }, { id: '1971', label: '1971' },
  { id: '1972', label: '1972' }, { id: '1973', label: '1973' }, { id: '1974', label: '1974' },
  { id: '1975', label: '1975' }, { id: '1976', label: '1976' }, { id: '1977', label: '1977' },
  { id: '1978', label: '1978' }, { id: '1979', label: '1979' }, { id: '1980', label: '1980' },
  { id: '1981', label: '1981' }, { id: '1982', label: '1982' }, { id: '1983', label: '1983' },
  { id: '1984', label: '1984' }, { id: '1985', label: '1985' }, { id: '1986', label: '1986' },
  { id: '1987', label: '1987' }, { id: '1988', label: '1988' }, { id: '1989', label: '1989' },
  { id: '1990', label: '1990' }, { id: '1991', label: '1991' }, { id: '1992', label: '1992' },
  { id: '1993', label: '1993' }, { id: '1994', label: '1994' }, { id: '1995', label: '1995' },
  { id: '1996', label: '1996' }, { id: '1997', label: '1997' }, { id: '1998', label: '1998' },
  { id: '1999', label: '1999' }, { id: '2000', label: '2000' }, { id: '2001', label: '2001' },
  { id: '2002', label: '2002' }, { id: '2003', label: '2003' }, { id: '2004', label: '2004' },
  { id: '2005', label: '2005' }, { id: '2006', label: '2006' }, { id: '2007', label: '2007' },
  { id: '2008', label: '2008' }, { id: '2009', label: '2009' }, { id: '2010', label: '2010' },
  { id: '2011', label: '2011' }, { id: '2012', label: '2012' }, { id: '2013', label: '2013' },
  { id: '2014', label: '2014' }, { id: '2015', label: '2015' }, { id: '2016', label: '2016' },
  { id: '2017', label: '2017' }, { id: '2018', label: '2018' }, { id: '2019', label: '2019' },
  { id: '2020', label: '2020' }, { id: '2021', label: '2021' }, { id: '2022', label: '2022' },
  { id: '2023', label: '2023' }, { id: '2024', label: '2024' }, { id: '2025', label: '2025' }
];

// Zones d'intérêt converties en WGS84
const pointsOfInterest = [
  { name: "Bulle", lat: 46.6212, lng: 7.0578, zoom: 16 },
  { name: "Glacier Aletsch", lat: 46.4312, lng: 8.0685, zoom: 14 },
  { name: "Grande Dixence", lat: 46.0805, lng: 7.4025, zoom: 16 },
  { name: "Gravière de Bioley-Orjulaz", lat: 46.6165, lng: 6.5815, zoom: 17 },
  { name: "Aéroport de Genève", lat: 46.2370, lng: 6.1091, zoom: 15 },
  { name: "Bure", lat: 47.4385, lng: 7.0095, zoom: 15 }
];

const index2D = ref(years.length - 1);
const index3D = ref(years.findIndex(y => y.id === '1946'));

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
  // Debug pour voir si l'objet contient bien le zoom dans ta console (F12)
  console.log("Sync reçu :", data); 

  if (map3dComponent.value && data) {
    // On passe bien les 3 propriétés de l'objet data
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

/* Badges Années */
.overlay-left {
  position: absolute; top: 15px; left: 15px; z-index: 1001;
  background: rgba(0, 0, 0, 0.7); color: white; padding: 5px 12px;
  border-radius: 20px; font-size: 0.9rem; pointer-events: none; text-transform: uppercase;
}

.overlay-right {
  position: absolute; top: 15px; right: 15px; z-index: 1001;
  background: rgba(0, 0, 0, 0.7); color: white; padding: 5px 12px;
  border-radius: 20px; font-size: 0.9rem; pointer-events: none; text-transform: uppercase;
}

/* Menu Central */
.central-menu {
  position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
  z-index: 2000; background: rgba(255, 255, 255, 0.95); padding: 15px 25px;
  border-radius: 35px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: auto; min-width: 550px; backdrop-filter: blur(10px); text-align: center;
}

.poi-container { margin: 10px 0 15px 0; }
.poi-select {
  width: 100%; padding: 8px 15px; border-radius: 20px; border: 1px solid #ddd;
  background: #f9f9f9; font-size: 0.9rem; cursor: pointer; outline: none;
}

h3 { margin: 0; font-size: 1rem; color: #333; }
.subtitle { margin: 0 0 10px 0; font-size: 0.8rem; color: #666; }

.sliders-container { display: flex; align-items: center; gap: 20px; }
.slider-group { flex: 1; }
.slider-group label { display: block; font-size: 0.9rem; margin-bottom: 5px; }

.vertical-separator { width: 1px; height: 40px; background: #ddd; }

input[type="range"] { width: 100%; cursor: pointer; }
.2d-accent label strong { color: #007bff; }
.3d-accent label strong { color: #e67e22; }

.footer-info { margin-top: 8px; font-size: 0.7rem; color: #bbb; }
.tech-indicator {
  position: absolute; bottom: 10px; right: 10px; z-index: 1001;
  font-size: 10px; color: rgba(255, 255, 255, 0.4); text-transform: uppercase;
}
</style>