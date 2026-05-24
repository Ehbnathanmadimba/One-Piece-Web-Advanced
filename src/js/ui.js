// ============================================================
// ui.js — DOM rendering en gebruikersinterface
//
// Technische vereisten gedemonstreerd:
//   - DOM manipulatie (selecteren, aanmaken, toevoegen)
//   - Template literals              (createCardHTML)
//   - Arrow functions                (alle functies)
//   - Observer API (IntersectionObserver) voor kaart-animaties
//   - Callback functions             (IntersectionObserver callback)
//   - Iteratie over arrays           (forEach, map)
//   - Ternary operator               (badge kleur, fav-knop staat)
// ============================================================
 
import { isFavorite } from './favorites.js';
 
// ── DOM element referenties ──────────────────────────────────
const cardsGrid       = document.getElementById('cards-grid');
const favoritesGrid   = document.getElementById('favorites-grid');
const loader          = document.getElementById('loader');
const errorMessage    = document.getElementById('error-message');
const emptyFavorites  = document.getElementById('empty-favorites');
const resultsInfo     = document.getElementById('results-info');
const favCountBadge   = document.getElementById('fav-count');
 
// ── IntersectionObserver ─────────────────────────────────────
// Observer API: animeer kaartjes als ze in beeld komen (scroll-animatie)
// Technische vereiste: Observer API
let cardObserver = null;
 
const initCardObserver = () => {
  // Callback function die wordt aangeroepen als een element zichtbaar wordt
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is zichtbaar: voeg 'visible' class toe voor CSS-animatie
        entry.target.classList.add('visible');
        // Stop met observeren nadat animatie getriggerd is
        cardObserver.unobserve(entry.target);
      }
    });
  };
 
  // Maak de observer aan met opties
  cardObserver = new IntersectionObserver(observerCallback, {
    root:       null,       // Viewport als root
    rootMargin: '0px',
    threshold:  0.1         // Trigger als 10% zichtbaar is
  });
 
  console.log('[UI] 👁️ IntersectionObserver aangemaakt');
};
 
// ── observeCard ───────────────────────────────────────────────
// Laat de observer een kaartje bewaken
const observeCard = (cardElement) => {
  if (cardObserver) {
    cardObserver.observe(cardElement);
  }
};
 
// ── parseBounty ───────────────────────────────────────────────
// Hulpfunctie: converteert bounty-string naar getal (voor sortering)
// "3.000.000.000" → 3000000000
export const parseBounty = (prime) => {
  if (!prime || prime === '0' || prime === 'unknown' || prime === 'Unknown') return 0;
  // Verwijder punten en kommas (Europese notatie)
  const cleaned = String(prime).replace(/\./g, '').replace(/,/g, '').replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
};
 
// ── formatBounty ─────────────────────────────────────────────
// Maakt een bounty-getal leesbaar (3000000000 → "3.000.000.000 ฿")
const formatBounty = (prime) => {
  if (!prime || prime === '0' || prime === 'unknown') return 'Onbekend';
  // Gebruik al geformatteerde string van API, voeg ฿ toe
  return `${prime} ฿`;
};
 
// ── getStatusBadge ───────────────────────────────────────────
// Geeft de juiste badge class terug op basis van status
const getStatusBadge = (status) => {
  if (!status) return { class: 'badge-unknown', label: 'Onbekend' };
 
  const s = status.toLowerCase();
  // Ternary operators (keten) voor badge selectie
  return s.includes('alive') ||
       s.includes('living') ||
       s.includes('vivant')
  ? { class: 'badge-alive', label: 'Alive' }
  : s.includes('dead') ||
    s.includes('deceased') ||
    s.includes('décédé')
    ? { class: 'badge-dead',    label: 'Dead' }
    : { class: 'badge-unknown', label: status };
};
 
// ── getInitialLetter ─────────────────────────────────────────
// Geeft de eerste letter van een naam terug voor de avatar
const getInitialLetter = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};
 
// ── getCrewName ───────────────────────────────────────────────
// Haalt de crew-naam op (de API geeft soms een object, soms een string)
const getCrewName = (crew) => {
  if (!crew) return 'Onbekend';
  if (typeof crew === 'string') return crew;
  // Gebruik naam of roman_name
  return crew.name ?? crew.roman_name ?? 'Onbekend';
};
 
// ── getFruitName ─────────────────────────────────────────────
const getFruitName = (fruit) => {
  if (!fruit) return 'Geen';
  if (typeof fruit === 'string') return fruit;
  return fruit.name ?? 'Onbekend';
};
 
// ── createCardHTML ────────────────────────────────────────────
/**
 * Genereert de HTML voor één character-kaart via template literal.
 * Toont minstens 6 datapunten: naam, status, job, crew, bounty, origin.
 *
 * @param {Object}  character  - Het character-object van de API
 * @param {boolean} inFavorites - Of we in de favorieten-sectie zitten
 * @returns {string} HTML-string
 */
export const createCardHTML = (character, inFavorites = false) => {
  // Destructuring van het character-object
  const {
    id,
    name       = 'Onbekend',
    status,
    job,
    crew,
    prime,      // bounty (als string)
    origin,
    age,
    size,
    fruit,
  } = character;
 
  const statusInfo  = getStatusBadge(status);
  const crewName    = getCrewName(crew);
  const fruitName   = getFruitName(fruit);
  const isFav       = isFavorite(id);
  const favClass    = isFav ? 'is-favorite' : '';
  const favTitle    = isFav ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten';
  const favIcon     = '&#9733;'; // ★
 
  // Template literal: bouw de volledige kaart-HTML
  return `
    <div class="character-card" data-id="${id}">
 
      <!-- Gekleurde bovenrand (via CSS ::before) -->
 
      <!-- Avatar: eerste letter van naam als display -->
      <div class="card-avatar">
        <span class="avatar-letter">${getInitialLetter(name)}</span>
      </div>
 
      <!-- Favoriet-knop (absoluut gepositioneerd) -->
      <button
        class="fav-btn ${favClass}"
        data-id="${id}"
        data-in-favorites="${inFavorites}"
        title="${favTitle}"
        aria-label="${favTitle}"
      >${favIcon}</button>
 
      <!-- Kaartinhoud -->
      <div class="card-body">
        <h3 class="card-name">${name}</h3>
 
        <!-- Status badge -->
        <div class="card-meta">
          <span class="badge ${statusInfo.class}">${statusInfo.label}</span>
        </div>
 
        <!-- Detail-rijen: MINSTENS 6 kolommen vereist door opdracht -->
        <div class="card-details">
          <div class="detail-row">
            <span class="detail-label">Rol</span>
            <span class="detail-value">${job || 'Onbekend'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Crew</span>
            <span class="detail-value">${crewName}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Afkomst</span>
            <span class="detail-value">${origin || 'Onbekend'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Leeftijd</span>
            <span class="detail-value">${age || 'Onbekend'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duivels Fruit</span>
            <span class="detail-value">${fruitName}</span>
          </div>
        </div>
      </div>
 
    </div>
  `;
};
 
// ── renderCards ───────────────────────────────────────────────
/**
 * Rendert een array van characters in het hoofdraster.
 * Gebruikt map() en join() voor efficiënte DOM-updates.
 *
 * @param {Array} characters - Array van character-objecten
 */
export const renderCards = (characters) => {
  // Wis huidige inhoud
  cardsGrid.innerHTML = '';
 
  if (characters.length === 0) {
    cardsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted); font-style:italic;">
        Geen characters gevonden voor je zoekopdracht.
      </div>
    `;
    return;
  }
 
  // Iteratie over array: map() + join() voor template literals
  const html = characters.map(char => createCardHTML(char, false)).join('');
  cardsGrid.innerHTML = html;
 
  // Observer koppelen aan elke nieuwe kaart (IntersectionObserver)
  const cards = cardsGrid.querySelectorAll('.character-card');
  cards.forEach(card => observeCard(card));
 
  console.log(`[UI] ✅ ${characters.length} kaartjes gerenderd`);
};
 
// ── renderFavoriteCards ───────────────────────────────────────
/**
 * Rendert favorieten in het favorieten-raster.
 *
 * @param {Array} favorites - Array van opgeslagen character-objecten
 */
export const renderFavoriteCards = (favorites) => {
  favoritesGrid.innerHTML = '';
 
  if (favorites.length === 0) {
    // Lege-staat tonen
    emptyFavorites.classList.remove('hidden');
    return;
  }
 
  emptyFavorites.classList.add('hidden');
 
  // map() over favorieten: geef 'inFavorites=true' mee
  const html = favorites.map(char => createCardHTML(char, true)).join('');
  favoritesGrid.innerHTML = html;
 
  // Observer ook hier toepassen
  const cards = favoritesGrid.querySelectorAll('.character-card');
  cards.forEach(card => observeCard(card));
 
  console.log(`[UI] ⭐ ${favorites.length} favorieten gerenderd`);
};
 
// ── updateFavCount ────────────────────────────────────────────
/**
 * Update het getal in de navigatiebadge voor favorieten.
 *
 * @param {number} count - Aantal favorieten
 */
export const updateFavCount = (count) => {
  // DOM manipulatie: textContent aanpassen
  favCountBadge.textContent = count;
};
 
// ── updateResultsInfo ─────────────────────────────────────────
/**
 * Update de resultaten-info tekst.
 *
 * @param {number} shown  - Getoond aantal
 * @param {number} total  - Totaal aantal
 */
export const updateResultsInfo = (shown, total) => {
  // Template literal voor dynamische tekst
  resultsInfo.textContent = `${shown} van ${total} characters getoond`;
};
 
// ── showLoader / hideLoader ───────────────────────────────────
export const showLoader = () => {
  loader.classList.remove('hidden');
  cardsGrid.innerHTML = '';
};
 
export const hideLoader = () => {
  loader.classList.add('hidden');
};
 
// ── showError / hideError ─────────────────────────────────────
export const showError = (message = null) => {
  hideLoader();
  errorMessage.classList.remove('hidden');
  if (message) {
    // Template literal voor foutmelding
    errorMessage.querySelector('p').textContent = `⚠️ ${message}`;
  }
  console.error('[UI] ❌ Foutmelding getoond:', message);
};
 
export const hideError = () => {
  errorMessage.classList.add('hidden');
};
 
// ── populateCrewFilter ────────────────────────────────────────
/**
 * Vult de crew-filter-dropdown met unieke crews uit de character-data.
 * Extraheert crews dynamisch zodat geen extra API-call nodig is.
 *
 * @param {Array} characters - Alle characters
 */
export const populateCrewFilter = (characters) => {
  const crewSelect = document.getElementById('filter-crew');
 
  // Verzamel unieke crew-namen via Set (geen duplicates)
  const crewNames = new Set();
 
  // Iteratie over array met forEach
  characters.forEach(char => {
    const name = getCrewName(char.crew);
    if (name && name !== 'Onbekend') {
      crewNames.add(name);
    }
  });
 
  // Sorteer en voeg toe als opties (Array.from + sort + forEach)
  Array.from(crewNames).sort().forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    crewSelect.appendChild(option);
  });
 
  console.log(`[UI] ⚓ ${crewNames.size} unieke crews toegevoegd aan filter`);
};
 
// ── initUI ───────────────────────────────────────────────────
/**
 * Initialiseert UI-componenten bij opstarten.
 * Moet worden aangeroepen vóór enige rendering.
 */
export const initUI = () => {
  initCardObserver();
  console.log('[UI] ✅ UI geïnitialiseerd');
};