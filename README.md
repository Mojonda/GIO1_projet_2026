# Vue 3 + Vite
Pour utiliser l'application : 
1. Ouvrir Visual Studio Code
2. Ouvrir le fichier index.html
3. Ouvrir un terminal
4. Ecrire la commande suivante : npm run dev
5. Double clique sur le lien local affiché dans le terminal

# écrire ce que fait le projet, ce qu'on utilise comme outil, notre nom/prénom  (pas besoin d'expliquer les boutons ou fonctionnement)
Ce projet permet de visualiser l'évolution d'une région à travers les années à l'aide d'images aériennes. 
L'interface est composée de 2 parties, une vue en 2D et l'autre en 3D. Pour chaque vue, il est possible de sélectionner différentes années afin de comparer les images aériennes (Données de Swisstopo). 
La modélisation 3D du terrain (Données de Cesium) ne change pas, elle reste constante sur des données récentes. 
Si les vues ne sont plus synchronisées, une fonctionnalité permet de recentrer la vue 3D sur la vue 2D. 
Nous avons également intégrés des lieux d'intérêts qui ont eu une forte évolution au fil des ans et sont donc intéressants à comparer. 

Librairies utilisées : 
- VueJS
- Leaflet
- CesiumJS

David Mojon et Juliette Glasson

