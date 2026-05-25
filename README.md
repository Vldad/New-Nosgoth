# Royaume de Nosgoth — Structure du projet

## Architecture

```
nosgoth/
├── assets/
│   ├── logo.png            Logo avec fond transparent (généré)
│   └── logo-original.jpg   Logo original
├── css/
│   ├── main.css            Styles partagés : header, bandeau, sidebar, footer
│   └── pages.css           Styles des contenus de page (accueil, lore, jeux...)
├── html/
│   ├── index.html          Accueil
│   ├── lore.html           Lore & Encyclopédie
│   ├── blood-omen.html     Blood Omen
│   ├── soul-reaver.html    Soul Reaver
│   ├── soul-reaver-2.html  Soul Reaver 2
│   ├── blood-omen-2.html   Blood Omen 2
│   ├── defiance.html       Defiance
│   ├── ascendance.html     Ascendance
│   ├── fan-fictions.html   Fan-Fictions
│   ├── chroniques.html     Chroniques
│   └── fan-arts.html       Fan-Arts
└── js/
    └── layout.js           Composant partagé : injecte le shell graphique dans chaque page
```

## Comment ça marche

Chaque page HTML ne contient que son contenu spécifique dans `<div id="site-body">`.
`layout.js` injecte automatiquement au chargement :
- Le header sticky avec les liens vers les 6 jeux
- Le bandeau avec logo, titre et liens sociaux
- La sidebar droite (YouTube, Twitch, Forum, Liens rapides)
- Le footer flottant avec les 4 sections

**Pour modifier le design global** → éditer `css/main.css` et/ou `js/layout.js`
**Pour modifier le contenu d'une page** → éditer uniquement ce fichier HTML

## Transitions entre pages

Basées sur la **View Transitions API** (Chrome 111+, Edge 111+).
Effet : fade + léger glissement vertical. Aucune librairie externe nécessaire.

## Pour créer une nouvelle page

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ma page — Le Royaume de Nosgoth</title>
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/pages.css">
</head>
<body>
<div id="site-body">
  <main class="lore-main">
    <!-- Votre contenu ici -->
  </main>
</div>
<script src="../js/layout.js"></script>
</body>
</html>
```

## Mettre à jour layout.js

Pour changer les topics du forum, les vidéos YouTube/Twitch ou les liens :
éditer les constantes `FORUM_TOPICS`, `GAMES`, etc. en haut de `js/layout.js`.
