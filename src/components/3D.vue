<template>
  <div ref="cesiumContainer" class="cesium-container"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from 'cesium';
import "cesium/Source/Widgets/widgets.css";

const cesiumContainer = ref(null);
let viewer = null;

onMounted(async () => {
  try {
    // 1. On active le relief mondial (Vraie 3D)
    // createWorldTerrainAsync va chercher les données d'élévation
    const terrainProvider = await Cesium.createWorldTerrainAsync({
      requestVertexNormals: true, // Nécessaire pour l'ombrage (calcul des ombres sur les pentes)
      requestWaterMask: true      // Pour avoir des reflets sur le lac Léman/Neuchâtel
    });

    viewer = new Cesium.Viewer(cesiumContainer.value, {
      terrainProvider: terrainProvider,
      baseLayerProvider: new Cesium.ImageryLayer(
        new Cesium.OpenStreetMapImageryProvider({
          url: 'https://tile.openstreetmap.org/'
        })
      ),
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      animation: false,
      timeline: false,
      sceneModePicker: true, // Permet de basculer entre 2D, 3D et Colombus View
      navigationHelpButton: false,
      infoBox: false,
    });

    // 2. ACTIVATION DES OMBRES ET DE LA LUMIÈRE
    viewer.scene.globe.enableLighting = true; // Active l'éclairage selon la position du soleil
    viewer.scene.shadowMap.enabled = true;    // Active les ombres portées
    
    // 3. Amélioration du rendu du brouillard et de l'atmosphère
    viewer.scene.fog.enabled = true;
    viewer.scene.atmosphere = true;

    // 4. Positionnement avec inclinaison (Pitch) pour voir le relief
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(6.6412, 46.7785, 5000), 
      orientation: {
        heading: Cesium.Math.toRadians(0),   // Nord
        pitch: Cesium.Math.toRadians(-25),  // Inclinaison de 25° vers le bas pour voir les montagnes
        roll: 0
      }
    });

  } catch (err) {
    console.error("Erreur relief 3D :", err);
  }
});

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
  top: 0; left: 0; right: 0; bottom: 0;
}
</style>