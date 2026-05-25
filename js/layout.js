/**
 * layout.js — Royaume de Nosgoth
 *
 * ARCHITECTURE ANTI-FLASH :
 * Le shell (side-nav + bandeau + sidebar + footer) est construit une seule fois,
 * mis en cache dans sessionStorage, puis injecté de façon SYNCHRONE depuis
 * un script inline en <head> sur les chargements suivants.
 * Résultat : zéro clignotement entre les pages.
 *
 * Transitions : CSS classes + double requestAnimationFrame (fade + slide).
 */

const ASSETS = 'assets/';
const CACHE_KEY = 'nosgoth_layout_v4';

const GAMES = [
  { href: 'index.html',         label: 'Accueil',       isHome: true },
  { href: 'blood-omen.html',            label: 'Blood Omen',          icon: 'BO1.webp' },
  { href: 'soul-reaver.html',           label: 'Soul Reaver',          icon: 'SR1.webp' },
  { href: 'soul-reaver-2.html',         label: 'Soul Reaver 2',        icon: 'SR2.webp' },
  { href: 'soul-reaver-remasters.html', label: 'Soul Reaver 1&amp;2 Remastered', icon: 'SR12_REM.webp' },
  { href: 'blood-omen-2.html',          label: 'Blood Omen 2',         icon: 'BO2.webp' },
  { href: 'defiance.html',              label: 'Defiance',             icon: 'DEF.webp' },
  { href: 'defiance-remastered.html',   label: 'Defiance Remastered',  icon: 'DEF_REM.webp' },
  { href: 'ascendance.html',            label: 'Ascendance',           icon: 'ASC.webp', cls: 'asc' },
];

const FORUM_TOPICS = [
  { author: 'Chernabog',  title: 'Le paradoxe du grand-père William le Juste', date: '11 mai 2026', section: 'Le Livre du Dogme', href: 'https://forum.nosgoth.fr/' },
  { author: 'Analand',    title: 'Re : Attaque Russe — suite des discussions',  date: '10 mai 2026', section: 'Forum général',     href: 'https://forum.nosgoth.fr/' },
  { author: 'Aegthelion', title: 'Attaque Russe — thread principal',            date: '8 mai 2026',  section: 'Forum général',     href: 'https://forum.nosgoth.fr/' },
];

const SVG = {
  bars:    `<svg viewBox="0 0 18 14" width="18" height="14" fill="currentColor"><rect x="0" y="0"  width="18" height="2"/><rect x="0" y="6"  width="18" height="2"/><rect x="0" y="12" width="18" height="2"/></svg>`,
  close:   `<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  twitch:  `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`,
  ytColor: `<svg viewBox="0 0 24 24" width="13" height="13" fill="#E03030"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  twColor: `<svg viewBox="0 0 24 24" width="13" height="13" fill="#9146FF"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>`,
};

// ─── BUILD HTML FRAGMENTS ─────────────────────────────────────────────────────
function buildNavToggle() {
  return `<button id="nav-toggle" aria-label="Menu">
    <span class="nt-bars">${SVG.bars}</span>
    <span class="nt-x">${SVG.close}</span>
  </button>`;
}

// Side nav active state is NOT cached — rebuilt each page
function buildSideNav(currentPage) {
  const items = GAMES.map((g, i) => {
    const isActive = g.href === currentPage;
    const cls = ['nitem', g.cls ? 'nasc' : '', isActive ? 'active' : ''].filter(Boolean).join(' ');
    if (g.isHome) {
      return `<a href="${g.href}" class="${cls}"><img src="${ASSETS}logo-original.webp" alt="" class="nitem-hlogo"><span>Accueil</span></a>` +
             `<div class="ndivider"></div>`;
    }
    return `<a href="${g.href}" class="${cls}" title="${g.label}"><img src="${ASSETS}icons/${g.icon}" alt="${g.label}"><span>${g.label}</span></a>`;
  });
  return `<nav id="site-nav">${items.join('')}</nav>`;
}

// Bandeau, sidebar, footer don't change between pages → cacheable
function buildBandeau() {
  return `<div id="site-bandeau">
  <div class="band-left">
    <a href="index.html"><img src="${ASSETS}logo-original.webp" alt="Logo" class="band-logo"></a>
    <div>
      <div class="band-ey">Communauté française · Legacy of Kain</div>
      <div class="band-h1"><a href="index.html">Le Royaume de <strong>Nosgoth</strong></a></div>
      <div class="band-sub">La référence francophone de la saga depuis 2001</div>
    </div>
  </div>
  <div class="band-socials">
    <a href="https://forum.nosgoth.fr/" class="soc soc-fo" target="_blank" rel="noopener"><span class="soc-icon">⚔</span>Forums du Royaume</a>
    <a href="https://www.youtube.com/@LeRoyaumedeNosgoth" class="soc soc-yt" target="_blank" rel="noopener"><span class="soc-icon">${SVG.youtube}</span>YouTube</a>
    <a href="https://www.twitch.tv/nosgothfr" class="soc soc-tw" target="_blank" rel="noopener"><span class="soc-icon">${SVG.twitch}</span>Twitch</a>
    <a href="https://discord.gg/3K5xNJaN8z" class="soc soc-dc" target="_blank" rel="noopener"><span class="soc-icon">${SVG.discord}</span>Discord</a>
  </div>
</div>`;
}

function buildSidebar() {
  const topics = FORUM_TOPICS.map(t => `
    <a href="${t.href}" class="ftopic" target="_blank" rel="noopener">
      <div class="fta">${t.author}</div>
      <div class="ftn">${t.title}</div>
      <div class="ftm">${t.date} · ${t.section}</div>
    </a>`).join('');
  return `<aside id="site-sidebar">
  <div class="rblock">
    <div class="rbt">Dernière vidéo YouTube</div>
    <a href="https://www.youtube.com/@LeRoyaumedeNosgoth" class="media-item" target="_blank" rel="noopener">
      <div class="mthumb myt-bg"><div class="mpbtn mpyt">▶</div></div>
      <div class="minfo"><div class="mpl mp-y">◉ YouTube</div><div class="mtt">[Cinématique] 17 — Defiance Remastered — Vue des Colonnes</div></div>
    </a>
  </div>
  <div class="rblock">
    <div class="rbt">Dernier Stream Twitch</div>
    <a href="https://www.twitch.tv/nosgothfr" class="media-item" target="_blank" rel="noopener">
      <div class="mthumb mtw-bg" style="position:relative">
        <div class="livebadge"><span class="ld"></span>EN DIRECT</div>
        <div class="mpbtn mptw">▶</div>
      </div>
      <div class="minfo"><div class="mpl mp-t">⬡ Twitch — Radio LoK</div><div class="mtt">Émission Spéciale Ascendance — Débat &amp; Analyse</div></div>
    </a>
  </div>
  <div class="rblock">
    <div class="rbt">Hot Topics du Forum</div>
    ${topics}
    <div style="margin-top:.55rem">
      <a href="https://forum.nosgoth.fr/" class="ibtn ibtn-ghost" style="font-size:7.5px;padding:.3rem .8rem;display:inline-block" target="_blank" rel="noopener">Voir tous les messages →</a>
    </div>
  </div>
  <div class="rblock">
    <div class="rbt">Liens rapides</div>
    <a href="https://www.youtube.com/@LeRoyaumedeNosgoth" class="qlink" target="_blank" rel="noopener"><span class="qi">${SVG.ytColor}</span>YouTube — Radio LoK &amp; Manoir d'Elzevir</a>
    <a href="https://www.twitch.tv/nosgothfr" class="qlink" target="_blank" rel="noopener"><span class="qi">${SVG.twColor}</span>Twitch — Planning des Streams</a>
  </div>
</aside>`;
}

function buildFooter() {
  return `<footer id="site-footer">
  <a href="lore.html" class="fcc fc-lo">
    <div class="fcc-num">Univers</div><div class="fcc-ti">Lore &amp; Encyclopédie</div>
    <p class="fcc-de">Personnages, factions, artefacts, lieux — toute la mythologie de Nosgoth.</p>
    <div class="fcc-co">312 articles</div>
  </a>
  <a href="fan-fictions.html" class="fcc fc-ff">
    <div class="fcc-num">Bastions</div><div class="fcc-ti">Fan-Fictions</div>
    <p class="fcc-de">Les récits de notre communauté dans l'univers de Nosgoth.</p>
    <div class="fcc-co">47 œuvres</div>
  </a>
  <a href="chroniques.html" class="fcc fc-ch">
    <div class="fcc-num">Le Livre</div><div class="fcc-ti">Chroniques</div>
    <p class="fcc-de">Notre saga monumentale retraçant l'histoire cachée de Nosgoth.</p>
    <div class="fcc-co">12 tomes · 600k mots</div>
  </a>
  <a href="fan-arts.html" class="fcc fc-fa">
    <div class="fcc-num">Esquisses</div><div class="fcc-ti">Fan-Arts</div>
    <p class="fcc-de">Illustrations, portraits et décors gothiques de la communauté.</p>
    <div class="fcc-co">189 créations</div>
  </a>
  <div class="fcopy">
    <div class="fcopy-brand"><img src="${ASSETS}logo-original.webp" alt="Logo"><span class="fcopy-name">Royaume de Nosgoth</span></div>
    <span class="fcopy-txt">Site non-officiel · Legacy of Kain © Crystal Dynamics / Square Enix · Royaume de Nosgoth © 2001–2026 · Icônes : <a href="https://www.deviantart.com/andonovmarko/" target="_blank" rel="noopener">andonovmarko</a></span>
  </div>
</footer>`;
}

// ─── INJECT LAYOUT ────────────────────────────────────────────────────────────
function injectLayout() {
  const siteBody = document.getElementById('site-body');
  if (!siteBody) return;

  // Inject fixed background div — avoids iOS Safari bug with background-attachment:fixed
  if (!document.getElementById('bg-fixed')) {
    const bg = document.createElement('div');
    bg.id = 'bg-fixed';
    document.body.insertBefore(bg, document.body.firstChild);
  }

  const currentPage = location.pathname.split('/').pop() || 'index.html';

  // Side nav always rebuilt (active state changes per page)
  document.body.insertAdjacentHTML('afterbegin', buildSideNav(currentPage));
  // Hamburger toggle (mobile)
  document.body.insertAdjacentHTML('beforeend', buildNavToggle());

  // Bandeau + sidebar + footer: try cache first
  let cached = null;
  try { cached = sessionStorage.getItem(CACHE_KEY); } catch(e) {}

  if (cached) {
    const { bandeau, sidebar, footer } = JSON.parse(cached);
    siteBody.insertAdjacentHTML('beforebegin', bandeau);
    siteBody.insertAdjacentHTML('beforeend', sidebar);
    siteBody.insertAdjacentHTML('afterend', footer);
  } else {
    const bandeau = buildBandeau();
    const sidebar = buildSidebar();
    const footer  = buildFooter();
    siteBody.insertAdjacentHTML('beforebegin', bandeau);
    siteBody.insertAdjacentHTML('beforeend', sidebar);
    siteBody.insertAdjacentHTML('afterend', footer);
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ bandeau, sidebar, footer }));
    } catch(e) {}
  }

  updateFooterPad();
  // Reveal body now that layout shell is in place
  document.body.classList.remove('layout-loading');
}

function updateFooterPad() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  document.documentElement.style.setProperty('--footer-h', (footer.offsetHeight + 8) + 'px');
}

// ─── MOBILE NAV TOGGLE ───────────────────────────────────────────────────────
function setupNavToggle() {
  const btn = document.getElementById('nav-toggle');
  if (!btn) return;

  const backdrop = document.createElement('div');
  backdrop.id = 'nav-backdrop';
  document.body.appendChild(backdrop);

  const close = () => document.body.classList.remove('nav-open');
  backdrop.addEventListener('click', close);

  btn.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
}

// ─── TRANSITIONS — CSS classes + double rAF ───────────────────────────────────
let navigating = false;

function isLocalHtml(href) {
  if (!href) return false;
  if (href.startsWith('http') || href.startsWith('//') ||
      href.startsWith('#')    || href.startsWith('mailto:') ||
      href.startsWith('tel:')) return false;
  return href.endsWith('.html');
}

function navigateTo(href) {
  if (navigating) return;
  navigating = true;
  document.body.classList.add('page-out');
  setTimeout(() => { window.location.href = href; }, 215);
}

function triggerPageIn() {
  document.body.classList.add('page-before-in');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('page-before-in');
      document.body.classList.add('page-in');
      setTimeout(() => { document.body.classList.remove('page-in'); }, 330);
    });
  });
}

function setupTransitions() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!isLocalHtml(href)) return;
    const cur = location.pathname.split('/').pop() || 'index.html';
    if (href === cur) return;
    e.preventDefault();
    navigateTo(href);
  });
  triggerPageIn();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  setupTransitions();
  setupNavToggle();
  window.addEventListener('resize', updateFooterPad);
});

// ─── EXPOSE cache buster for dev ─────────────────────────────────────────────
// Open console and run: nosgoth.clearCache() if you update layout.js
window.nosgoth = {
  clearCache: () => { try { sessionStorage.removeItem(CACHE_KEY); } catch(e) {} console.log('Layout cache cleared.'); }
};
