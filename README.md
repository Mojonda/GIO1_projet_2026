# Vue 3 + Vite
Pour utiliser l'application : 
1. Ouvrir Visual Studio Code
2. Ouvrir le fichier index.html
3. Ouvrir un terminal
4. Ecrire la commande suivante : npm run dev
5. Double clique sur le lien local affiché dans le terminal

* **Préparation de l'espace** : Ouvrez le dossier racine du projet (`GIO1_projet_2026`) dans Visual Studio Code. 
* **Accès au terminal** : Ouvrez le terminal intégré de VS Code (`Ctrl + J` sur Windows) afin d'exécuter les commandes nécessaires.
* **Installation des dépendances (nécessaire la première fois)** : Tapez la commande `npm install`. Cette étape télécharge et installe localement toutes les bibliothèques nécessaires (Vue, Leaflet, Cesium) définies dans le fichier package.json.
* **Lancement du serveur** : Exécutez la commande `npm run dev`. Cela compile le code source et crée un serveur local temporaire pour héberger l'application.
* **Visualisation** : Cliquez sur le lien local (généralement `http://localhost:5173/`) qui s'affiche dans le terminal pour ouvrir l'interface dans votre navigateur.




# Desciption du projet 
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

