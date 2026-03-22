// Test WMTS geo.admin.ch : SWISSIMAGE + swissALTI3D (relief)

const map = L.map('map', {
  center: [46.95, 7.44], // Berne en WGS84, Leaflet utilise WGS84 par défaut
  zoom: 13
});

// NOTE IMPORTANTE :
// Pour être rigoureux, les services WMTS swissALTI3D/SWISSIMAGE sont en EPSG:2056,
// donc l'intégration "propre" se fait plutôt avec OpenLayers (qui gère nativement 2056).
// Ici on fait un test simple en utilisant l'API TMS "tile" de geo.admin
// qui fournit des tuiles Web Mercator (compatible Leaflet).
// C'est suffisant pour ton POC hors Vue.

// Orthophoto SWISSIMAGE (fond de carte)
const swissimageCurrent = L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg', { attribution: '© swisstopo' });
const swissimage2010 = L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/2010/3857/{z}/{x}/{y}.jpeg', { attribution: '© swisstopo' });

    
const baseMaps = {
  "Actuel": swissimageCurrent,
  "Année 2010": swissimage2010
};

L.control.layers(baseMaps).addTo(map);

const swissaltiRelief = L.tileLayer(
  'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissalti3d-reliefschattierung/default/current/3857/{z}/{x}/{y}.png',
  {
    attribution: '© swisstopo, © geo.admin.ch',
    maxZoom: 19,
    opacity: 0.6
  }
);

// Ajout des couches
swissimage.addTo(map);
swissaltiRelief.addTo(map);

// Contrôle de couches pour activer / désactiver
const baseLayers = {
  'SWISSIMAGE (orthophoto)': swissimage
};

const overlays = {
  'Relief swissALTI3D': swissaltiRelief
};

L.control.layers(baseLayers, overlays).addTo(map);



