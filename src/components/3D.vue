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
  if (currentImageryLayer) viewer.imageryLayers.remove(currentImageryLayer);

  const layerId = year === '1946' ? 'ch.swisstopo.swissimage-product_1946' : 'ch.swisstopo.swissimage-product';
  
  const provider = new Cesium.UrlTemplateImageryProvider({
    url: `https://wmts.geo.admin.ch/1.0.0/${layerId}/default/${year}/3857/{z}/{x}/{y}.jpeg`,
    maximumLevel: 19
  });

  currentImageryLayer = viewer.imageryLayers.addImageryProvider(provider);
};

/**
 * LA FONCTION CRUCIALE : Synchronisation dynamique du zoom
 */
const flyTo = (lat, lng, zoomLevel) => {
  if (!viewer) return;

  // FORMULE DE CONVERSION ZOOM -> ALTITUDE
  // Cette formule assure que la 3D affiche la même largeur de terrain que la 2D
  const altitude = 100000 / Math.pow(2, zoomLevel - 3);

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lng, lat, altitude + 8000),
    orientation: {
      pitch: Cesium.Math.toRadians(-90), // Vue verticale parfaite pour comparer
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

    // On cache le logo/crédit par défaut pour un look épuré
    if (viewer.cesiumWidget.creditContainer) {
      viewer.cesiumWidget.creditContainer.style.display = 'none';
    }

    await updateImagery(props.year);

    // Vue initiale par défaut
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