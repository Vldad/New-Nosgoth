# Royaume de Nosgoth — Claude Project Context

## Contexte du projet

Site web communautaire francophone dédié à la saga **Legacy of Kain**, en cours de refonte.
La communauté s'appelle "Le Royaume de Nosgoth" et existe depuis 2001.

**Repo GitHub :** https://github.com/Vldad/New-Nosgoth

---

## Architecture cible (migration en cours)

Le site doit migrer de l'architecture actuelle (HTML + JS) vers **PHP avec includes**.

### Structure cible

```
nosgoth/
├── index.php
├── lore.php
├── blood-omen.php
├── soul-reaver.php
├── soul-reaver-2.php
├── blood-omen-2.php
├── defiance.php
├── ascendance.php
├── fan-fictions.php
├── chroniques.php
├── fan-arts.php
├── layout/
│   ├── header.php      ← nav sticky + 7 liens jeux
│   ├── bandeau.php     ← logo + titre + liens sociaux
│   ├── sidebar.php     ← colonne droite (YouTube, Twitch, Forum, Liens rapides)
│   └── footer.php      ← footer flottant 4 sections
├── assets/
│   ├── logo-original.webp  ← logo du site
│   ├── pillars-bg.webp     ← fond Piliers de Nosgoth
│   ├── *.webp              ← visuels jeux (BO1, SR1, SR2, BO2, Def, Asc…)
│   └── icons/              ← icônes nav (BO1, SR1, SR2, BO2, DEF, ASC, DEF_REM, SR12_REM)
├── css/
│   ├── main.css            ← styles partagés (header, bandeau, sidebar, footer, bg)
│   ├── pages.css           ← styles des contenus de page
│   └── transitions.css     ← animations fade+slide inter-pages
└── js/
    └── transitions.js      ← UNIQUEMENT les transitions de page (plus de layout.js)
```

### Principe PHP

Chaque page PHP déclare sa page courante puis inclut le layout :

```php
<?php
$current_page = 'blood-omen'; // utilisé par header.php pour la classe active
include 'layout/header.php';
include 'layout/bandeau.php';
?>

<div id="site-body">
  <main class="game-main">
    <!-- contenu spécifique à la page -->
  </main>
  <?php include 'layout/sidebar.php'; ?>
</div>

<?php include 'layout/footer.php'; ?>
```

### Header actif via PHP

```php
// layout/header.php
<a href="blood-omen.php" class="hitem <?= $current_page === 'blood-omen' ? 'active' : '' ?>">
```

---

## État actuel du projet

Version HTML+JS fonctionnelle — base de travail pour la migration PHP.
Repo : https://github.com/Vldad/New-Nosgoth (branche `master`)

### Ce qui fonctionne
- Design complet responsive (desktop + mobile)
- Header sticky pleine largeur avec les 7 liens (Accueil + 6 jeux)
- Bandeau avec logo, titre "Le Royaume de Nosgoth", liens sociaux
- Layout 70/30 (colonne gauche contenu, colonne droite sidebar)
- Footer flottant fixe avec 4 sections (hover pour déployer)
- Fond en filigrane fixe (Piliers de Nosgoth, opacity 0.28)
- Blocs semi-transparents (rgba 72% opacité + backdrop-filter blur)
- Transitions inter-pages fade+slide (CSS classes + double rAF)
- Anti-flash au chargement (body.layout-loading visibility:hidden)
- Toutes les images converties en WebP ✅

### Ce qui reste à faire
- [ ] Migration HTML → PHP avec includes
- [ ] `layout.js` → supprimer, remplacer par `transitions.js` allégé
- [ ] Tester les transitions avec le PHP (le mécanisme reste identique)
- [ ] Contenu réel (remplacer les lorem ipsum)
- [ ] Intégration avec le forum (nosgoth.fr)
- [ ] Vraies URLs YouTube/Twitch dans sidebar
- [ ] Pages jeux : contenu réel pour chaque jeu

---

## Design

### Palette de couleurs

```css
--blood:     #8B1A1A;   /* rouge sang foncé */
--blood-lt:  #B83030;   /* rouge sang clair */
--blood-glow:#D44040;   /* rouge hover */
--s9: #0D0C0B;          /* noir profond (fond body) */
--s8: #161413;          /* pierre très foncée */
--s7: #1E1B19;          /* pierre foncée */
--s6: #2A2522;          /* pierre */
--s5: #3A3330;          /* pierre claire */
--s2: #8A8380;          /* gris pierre */
--s1: #B0A9A5;          /* gris clair */
--s0: #D4CCC8;          /* parchemin clair */
--gold:   #B8942A;      /* or (auteurs forum) */
--gold-d: #7A6425;      /* or foncé */
--td: #8A8380;          /* texte secondaire */
--tf: #504844;          /* texte tertiaire (dates, meta) */
```

### Typographie

- **Cinzel Decorative** — titres principaux (Le Royaume de Nosgoth, H1)
- **Cinzel** — labels, navigation, boutons, eyebrows (tout ce qui est UPPERCASE)
- **Cormorant Garamond** — corps de texte, descriptions

### Structure de page type

```
[header sticky — 52px]
  7 items flex:1 chacun, pleine largeur
  Accueil (logo rond) | Blood Omen | Soul Reaver | SR2 | BO2 | Defiance | Ascendance 👑

[bandeau]
  Gauche : logo rond 56px + "Le Royaume de Nosgoth" + sous-titre
  Droite : boutons Forums ⚔ | YouTube ▶ | Twitch ⬡ | Discord ⊕

[body — grid 70/30]
  Gauche (70%) : contenu de la page
  Droite (30%) : sidebar fixe (YouTube, Twitch, Forum, Liens rapides)

[footer fixe]
  Masqué par défaut (translateY 100% - 36px)
  Onglet "▲ Sections" visible en bas
  Hover → déploie les 4 sections : Lore | Fan-Fictions | Chroniques | Fan-Arts
```

### Background

- Image : `assets/pillars-bg.webp` (Piliers de Nosgoth depuis LoK)
- Implémentation : `<div id="bg-fixed">` injecté, `position: fixed`, `opacity: 0.28`
- **Ne pas utiliser `background-attachment: fixed`** — buggué sur iOS Safari
- Utiliser `will-change: transform` + `transform: translateZ(0)` pour promotion GPU

### Blocs de contenu (version B — semi-transparents)

```css
.intro-block, .ncard, .intro-featured, .rblock {
  background: rgba(16, 13, 12, 0.72);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
```

---

## Transitions inter-pages

Pattern : **CSS classes + double requestAnimationFrame**
Même technique que test.gibelin.fr/large

```
Clic lien local
  → body.page-out (CSS: opacity 0 + translateY -12px, 200ms)
  → après 215ms : window.location.href = href

Nouvelle page chargée
  → body.page-before-in (CSS: opacity 0 + translateY 14px, pas de transition)
  → rAF → rAF
  → body.page-in (CSS: opacity 1 + translateY 0, 300ms)
```

```css
/* transitions.css */
body.page-out #site-body {
  opacity: 0;
  transform: translateY(-12px);
  transition: opacity 200ms ease, transform 200ms ease;
}
body.page-before-in #site-body {
  opacity: 0;
  transform: translateY(14px);
  transition: none;
}
body.page-in #site-body {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms ease, transform 300ms ease;
}
```

Seul `#site-body` est animé — le header/bandeau/footer restent fixes visuellement.

---

## Contraintes techniques du webmaster

| Contrainte | Statut | Notes |
|---|---|---|
| Boutons CSS (pas image) | ✅ OK | Déjà respecté |
| Animations CSS | ⚠️ Partiel | Styles en CSS, déclenchement inter-pages nécessite JS (incontournable) |
| Mobile CSS uniquement | ⚠️ Partiel | Responsive layout en CSS, même JS de transition sur mobile |
| Images WebP | ✅ Fait | Tous les assets sont en .webp |
| Injection layout sans JS | ✅ Cible PHP | Migration en cours vers includes PHP |

---

## Pages du site

| Fichier | Titre | `$current_page` |
|---|---|---|
| index.php | Accueil | `'accueil'` |
| lore.php | Lore & Encyclopédie | `'lore'` |
| blood-omen.php | Blood Omen (1996) | `'blood-omen'` |
| soul-reaver.php | Soul Reaver (1999) | `'soul-reaver'` |
| soul-reaver-2.php | Soul Reaver 2 (2001) | `'soul-reaver-2'` |
| blood-omen-2.php | Blood Omen 2 (2002) | `'blood-omen-2'` |
| defiance.php | Defiance (2003) | `'defiance'` |
| defiance-remastered.php | Defiance Remastered (2025) | `'defiance-remastered'` |
| soul-reaver-remasters.php | Soul Reaver Remasters (2024) | `'soul-reaver-remasters'` |
| ascendance.php | Ascendance (2026) | `'ascendance'` |
| fan-fictions.php | Fan-Fictions | `'fan-fictions'` |
| chroniques.php | Chroniques | `'chroniques'` |
| fan-arts.php | Fan-Arts | `'fan-arts'` |

---

## Liens externes

| Service | URL |
|---|---|
| Forum | https://forum.nosgoth.fr/ |
| YouTube | https://www.youtube.com/@LeRoyaumedeNosgoth |
| Twitch | https://www.twitch.tv/nosgothfr |
| Discord | https://discord.gg/3K5xNJaN8z |
| Logos jeux (source) | https://nosgoth.net/images/BO.png etc. |

---

## Sections du site (contenu à développer)

- **Lore & Encyclopédie** ("Univers") — personnages, Piliers, paradoxes temporels, factions, artefacts, lieux. ~312 articles à terme.
- **Fan-Fictions** ("Bastions") — ~47 œuvres publiées
- **Chroniques** ("Le Livre") — epic fan-fiction, 12 tomes, ~600 000 mots
- **Fan-Arts** ("Esquisses") — ~189 créations

---

## Notes importantes

- Le logo du site (rond gris) doit rester — c'est le logo historique de la communauté
- La citation de Vorador en page d'accueil : *« Appelez vos chiens ! Qu'ils viennent se repaître de vos cadavres ! »*
- L'image de fond est un screenshot des Piliers de Nosgoth depuis le jeu — elle appartient à Crystal Dynamics/Square Enix
- Site non-officiel, fan community
