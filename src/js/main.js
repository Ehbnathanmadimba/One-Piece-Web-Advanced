// ============================================================
// main.js — Hoofdmodule One Piece Explorer
//
// Technische vereisten gedemonstreerd:
//   - ES modules (import/export)         (alle imports)
//   - async/await                        (init, loadData)
//   - try/catch                          (loadData)
//   - fetch via api.js                   (fetchAllCharacters)
//   - DOM manipulatie + querySelector    (overal)
//   - addEventListener (event listeners) (overal)
//   - Array methodes (filter, sort, map) (applyFilters)
//   - Arrow functions                    (alle handlers)
//   - Template literals                  (via ui.js)
//   - Ternary operator                   (sort logic)
//   - LocalStorage                       (via favorites.js + theme.js)
//   - Callback functions                 (event handlers)
//   - Formulier validatie                (search input)
// ============================================================

import { fetchAllCharacters } from './api.js';
import {
  getFavorites, addFavorite, removeFavorite,
  isFavorite, clearFavorites, getFavoriteCount
} from './favorites.js';
import { initTheme } from './theme.js';
import { updateLanguage, setLang } from './language.js';import {
  initUI, renderCards, renderFavoriteCards, showLoader,
  hideLoader, showError, hideError, updateFavCount,
  updateResultsInfo, populateCrewFilter, parseBounty
} from './ui.js';

// ── App-staat ─────────────────────────────────────────────────
// Alle characters die van de API zijn opgehaald (ongewijzigd)
let allCharacters = [];

// De gefilterde/gesorteerde characters die getoond worden
let displayedCharacters = [];
// Pagination
let currentPage = 1;
const itemsPerPage = 24;

// ── DOM Elementen ─────────────────────────────────────────────
const btnCharacters = document.getElementById('btn-characters');
const btnFavorites = document.getElementById('btn-favorites');
const sectionCharacters = document.getElementById('section-characters');
const sectionFavorites = document.getElementById('section-favorites');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterCrew = document.getElementById('filter-crew');
const sortSelect = document.getElementById('sort-select');
const retryBtn = document.getElementById('retry-btn');
const clearFavBtn = document.getElementById('clear-favorites-btn');
const cardsGrid = document.getElementById('cards-grid');
const favoritesGrid = document.getElementById('favorites-grid');

// ── applyFilters ──────────────────────────────────────────────
/**
 * Past zoekterm, statusfilter, crewfilter en sortering toe.
 * Gebruikt uitsluitend array methodes op het 'allCharacters' array.
 *
 * Technische vereisten: filter(), sort(), toLowerCase(), includes()
 */
const applyFilters = () => {
  const query = searchInput.value.toLowerCase().trim();
  const status = filterStatus.value.toLowerCase();
  const crew = filterCrew.value.toLowerCase();
  const sortOrder = sortSelect.value;

  // ── Formulier validatie ──
  // Zoekterm mag niet te lang zijn (praktische validatie)
  if (query.length > 100) {
    searchInput.value = query.slice(0, 100);
    return;
  }

  // ── Stap 1: Filter op zoekopdracht ──
  // Array methode: .filter() + template literal check in naam/job/crew
  let result = allCharacters.filter(char => {
    const name = (char.name ?? '').toLowerCase();
    const job = (char.job ?? '').toLowerCase();
    const crewName = typeof char.crew === 'object'
      ? (char.crew?.name ?? char.crew?.roman_name ?? '').toLowerCase()
      : (char.crew ?? '').toLowerCase();

    // Ternary: als query leeg is, altijd matchen
    return query === ''
      ? true
      : name.includes(query) || job.includes(query) || crewName.includes(query);
  });

  // ── Stap 2: Filter op status ──
  if (status !== '') {
  result = result.filter(char => {
    const charStatus = (char.status ?? '').toLowerCase();

    // Alive = alive + living
    if (status === 'alive') {
      return charStatus.includes('alive') ||
             charStatus.includes('living');
    }

    // Deceased = dead + deceased
    if (status === 'deceased') {
      return charStatus.includes('dead') ||
             charStatus.includes('deceased');
    }

    // Unknown
    if (status === 'unknown') {
      return charStatus === '' ||
             charStatus.includes('unknown');
    }

    return true;
  });
}

  // ── Stap 3: Filter op crew ──
  if (crew !== '') {
    result = result.filter(char => {
      const crewName = typeof char.crew === 'object'
        ? (char.crew?.name ?? char.crew?.roman_name ?? '').toLowerCase()
        : (char.crew ?? '').toLowerCase();
      return crewName.includes(crew);
    });
  }

  // ── Stap 4: Sortering ──
  // Array methode: .sort() met arrow function comparator
  result = [...result].sort((a, b) => {
    if (sortOrder === 'name-asc') {
      // Ternary: string vergelijking
      return (a.name ?? '').localeCompare(b.name ?? '');
    }
    if (sortOrder === 'name-desc') {
      return (b.name ?? '').localeCompare(a.name ?? '');
    }

    return 0;
  });

 // Sla gefilterde resultaten op
displayedCharacters = result;

// Pagination berekenen
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

// Alleen characters van huidige pagina tonen
const paginatedCharacters = displayedCharacters.slice(
  startIndex,
  endIndex
);

// Render enkel huidige pagina
renderCards(paginatedCharacters);

// Update info
updateResultsInfo(displayedCharacters.length, allCharacters.length);

// Pagination buttons renderen
renderPagination();

}; // <-- applyFilters correct afsluiten

// ── renderPagination ─────────────────────────────────────────

const renderPagination = () => {
  // Zoek bestaande pagination container
  let pagination = document.getElementById('pagination');

  // Bestaat nog niet? Maak hem aan
  if (!pagination) {
    pagination = document.createElement('div');
    pagination.id = 'pagination';
    pagination.style.display = 'flex';
    pagination.style.justifyContent = 'center';
    pagination.style.flexWrap = 'wrap';
    pagination.style.gap = '10px';
    pagination.style.margin = '30px 0';

    cardsGrid.parentElement.appendChild(pagination);
  }

  pagination.innerHTML = '';

  const totalPages = Math.ceil(
    displayedCharacters.length / itemsPerPage
  );

  for (let page = 1; page <= totalPages; page++) {
    const button = document.createElement('button');

    button.textContent = page;

    button.style.padding = '10px 15px';
    button.style.borderRadius = '10px';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    if (page === currentPage) {
      button.style.backgroundColor = '#d62828';
      button.style.color = 'white';
    }

    button.addEventListener('click', () => {
      currentPage = page;
      applyFilters();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    pagination.appendChild(button);
  }
};

const loadData = async () => {
  showLoader();
  hideError();

  try {
    // Await de async fetch-functie uit api.js
    allCharacters = await fetchAllCharacters();

    hideLoader();

    if (allCharacters.length === 0) {
      showError('Geen data ontvangen van de API. Probeer het later opnieuw.');
      return;
    }

    // Vul de crew-dropdown (extraheer uit data, geen extra API-call)
    populateCrewFilter(allCharacters);

    // Toon initieel alle characters (geen filter actief)
    applyFilters();

    // Update fav-count badge
    updateFavCount(getFavoriteCount());

    console.log(`[Main] ✅ App geladen met ${allCharacters.length} characters`);

  } catch (error) {
    // Foutafhandeling: toon foutmelding in de UI
    hideLoader();
    showError(`Kon data niet ophalen: ${error.message}`);
    console.error('[Main] ❌ Laad-fout:', error);
  }
};

// ── handleFavToggle ───────────────────────────────────────────
/**
 * Callback function voor favoriet-knoppen (event delegation).
 * Wordt aangeroepen via click-event op de grids.
 *
 * @param {Event} event - Click-event
 * @param {boolean} fromFavSection - Of het click vanuit de favorieten-sectie komt
 */
const handleFavToggle = (event, fromFavSection = false) => {
  // Event delegation: zoek de dichtstbijzijnde fav-btn
  const favBtn = event.target.closest('.fav-btn');
  if (!favBtn) return;

  // Haal het ID op uit het data-attribuut
  const rawId = favBtn.dataset.id;

  // Zoek het character-object
  // Array methode: .find() zoekt het eerste overeenkomend element
  const character = allCharacters.find(char => String(char.id) === rawId)
    ?? getFavorites().find(fav => String(fav.id) === rawId);

  if (!character) {
    console.warn(`[Main] ⚠️ Character ID=${rawId} niet gevonden`);
    return;
  }

  const id = character.id;

  // Toggle: als al favoriet → verwijder, anders → voeg toe
  if (isFavorite(id)) {
    removeFavorite(id);
    favBtn.classList.remove('is-favorite');
    favBtn.title = 'Voeg toe aan favorieten';
    console.log(`[Main] 💔 "${character.name}" uit favorieten verwijderd`);
  } else {
    addFavorite(character);
    favBtn.classList.add('is-favorite');
    favBtn.title = 'Verwijder uit favorieten';
    console.log(`[Main] ⭐ "${character.name}" aan favorieten toegevoegd`);
  }

  // Update de fav-count badge
  updateFavCount(getFavoriteCount());

  // Als we in de favorieten-sectie zijn: herrender de favorieten
  if (fromFavSection) {
    renderFavoriteCards(getFavorites());
    updateFavCount(getFavoriteCount());
  }
};

// ── switchSection ─────────────────────────────────────────────
/**
 * Wisselt tussen de characters-sectie en favorieten-sectie.
 *
 * @param {'characters'|'favorites'} section - Welke sectie tonen
 */
const switchSection = (section) => {
  if (section === 'characters') {
    sectionCharacters.classList.add('active-section');
    sectionFavorites.classList.remove('active-section');
    btnCharacters.classList.add('active');
    btnFavorites.classList.remove('active');
  } else {
    sectionFavorites.classList.add('active-section');
    sectionCharacters.classList.remove('active-section');
    btnFavorites.classList.add('active');
    btnCharacters.classList.remove('active');

    // Render favorieten bij wisselen naar die sectie
    renderFavoriteCards(getFavorites());
  }
};

// ── Event Listeners ───────────────────────────────────────────
const bindEvents = () => {

  // Navigatie: wisselen tussen secties
  btnCharacters.addEventListener('click', () => switchSection('characters'));
  btnFavorites.addEventListener('click', () => switchSection('favorites'));

  // Zoekfunctie: filter bij elke toetsaanslag
  // 'input' event triggert bij elke wijziging (ook plak, verwijder, etc.)
  searchInput.addEventListener('input', () => {
  currentPage = 1;
  applyFilters();
});

// Filter op status
// Reset pagination zodat resultaten starten op pagina 1
filterStatus.addEventListener('change', () => {
  currentPage = 1; // terug naar eerste pagina
  applyFilters(); // statusfilter opnieuw toepassen
});

// Filter op crew
// Reset pagination zodat gebruiker niet op oude pagina blijft
filterCrew.addEventListener('change', () => {
  currentPage = 1; // terug naar eerste pagina
  applyFilters(); // crewfilter opnieuw toepassen
});

// Sortering wijzigen
// Reset pagination zodat gesorteerde resultaten vanaf pagina 1 starten
sortSelect.addEventListener('change', () => {
  currentPage = 1; // terug naar eerste pagina
  applyFilters(); // sortering opnieuw toepassen
});
// Taal wisselen
const languageSelect = document.getElementById('lang-select');
languageSelect.addEventListener('change', (e) => {
  setLang(e.target.value);
  updateLanguage();
});

  // Favoriet-toggle via event delegation op het hoofdraster
  // (efficiënter dan listener op elke knop afzonderlijk)
  cardsGrid.addEventListener('click', (event) => {
    handleFavToggle(event, false);
  });

  // Favoriet-toggle in de favorieten-sectie
  favoritesGrid.addEventListener('click', (event) => {
    handleFavToggle(event, true);
  });

  // Opnieuw proberen knop
  retryBtn.addEventListener('click', () => {
    loadData();
  });

  // Alle favorieten direct verwijderen (zonder popup)
clearFavBtn.addEventListener('click', () => {
  clearFavorites();

  // UI direct updaten
  updateFavCount(0);
  renderFavoriteCards([]);

  console.log('[Main] 🗑️ Alle favorieten direct verwijderd');
});

  console.log('[Main] ✅ Alle event listeners gekoppeld');
};

// ── init ──────────────────────────────────────────────────────
/**
 * Hoofdfunctie die alles opstart.
 * Wordt aangeroepen zodra de DOM geladen is.
 */
const init = async () => {
  console.log('[Main] 🚀 One Piece Explorer start...');

  // 1. Initialiseer UI (IntersectionObserver, etc.)
  initUI();

  // 2. Pas opgeslagen thema toe
  initTheme();
// taal toepassen
updateLanguage();
// taal initialiseren
  // 3. Koppel alle event listeners
  bindEvents();

  // 4. Haal data op van de API (async)
  await loadData();

  console.log('[Main] ✅ App volledig geïnitialiseerd');
};

// ── Start de app zodra de DOM klaar is ───────────────────────
// DOMContentLoaded is een callback die wacht tot HTML geparsed is
document.addEventListener('DOMContentLoaded', () => {
  init();
});