<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as Cesium from 'cesium';
import "cesium/Source/Widgets/widgets.css";

window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

const props = defineProps(['year']);
const cesiumContainer = ref(null);
let viewer = null;
let currentImageryLayer = null;

/**
 * Mise à jour de l'imagerie swisstopo
 */


const updateImagery = async (year) => {
  if (!viewer) return;
  
  // On retire l'ancienne couche
  if (currentImageryLayer) {
    viewer.imageryLayers.remove(currentImageryLayer);
  }

  const provider = new Cesium.UrlTemplateImageryProvider({
    url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage-product/default/${year}/3857/{z}/{x}/{y}.jpeg`,
    maximumLevel: 19
  });

  currentImageryLayer = viewer.imageryLayers.addImageryProvider(provider);
};


const flyTo = (lat, lng, zoomLevel) => {  // FORMULE DE CONVERSION ZOOM -> ALTITUDE
  if (!viewer) return;
  const altitude = 100000 / Math.pow(2, zoomLevel - 3);

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lng, lat, altitude + 8000),
    orientation: {
      pitch: Cesium.Math.toRadians(-90), 
      heading: 0,
      roll: 0
    },
    duration: 1.5,
    easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT
  });
};

defineExpose({ flyTo });

onMounted(async () => {
  try {
    viewer = new Cesium.Viewer(cesiumContainer.value, {
      terrainProvider: await Cesium.createWorldTerrainAsync().catch(() => new Cesium.EllipsoidTerrainProvider()),
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      animation: false,
      timeline: false,
      sceneModePicker: false,
      infoBox: false,
      selectionIndicator: false,
      navigationHelpButton: false,
    });



    await updateImagery(props.year);

    // Vue initiale (Yverdon les bains)
    flyTo(46.7785, 6.6412, 16);

  } catch (err) {
    console.error("Erreur Cesium Init:", err);
  }
});

watch(() => props.year, (newYear) => updateImagery(newYear));

onUnmounted(() => {
  if (viewer) viewer.destroy();
});
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100%;
  background: #000;
  position: absolute;
  top: 0; left: 0;
}
</style>