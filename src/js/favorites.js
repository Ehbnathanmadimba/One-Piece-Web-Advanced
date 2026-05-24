// ============================================================
// favorites.js — Beheer van favoriete characters
//
// Technische vereisten gedemonstreerd:
//   - LocalStorage (get, set, remove)   (alle functies)
//   - JSON manipuleren                  (JSON.parse, JSON.stringify)
//   - Arrow functions                   (alle exports)
//   - Constanten (const)                (STORAGE_KEY, alle functies)
//   - Array methodes                    (filter, find, some)
//   - Ternary operator                  (isFavorite)
// ============================================================
 
// De sleutel onder welke we opslaan in LocalStorage
const STORAGE_KEY = 'one_piece_favorites';
 
// ── getFavorites ─────────────────────────────────────────────
/**
 * Haalt de opgeslagen favorieten op uit LocalStorage.
 * Geeft een lege array terug als er nog niets opgeslagen is.
 *
 * @returns {Array} Array van character-objecten
 */
export const getFavorites = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  // Ternary operator: als stored bestaat, parse JSON, anders lege array
  return stored ? JSON.parse(stored) : [];
};
 
// ── saveFavorites ─────────────────────────────────────────────
// Interne helperfunctie — niet geëxporteerd
const saveFavorites = (favorites) => {
  // JSON.stringify converteert het array-object naar een string voor opslag
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  console.log(`[Favorites] 💾 ${favorites.length} favorieten opgeslagen`);
};
 
// ── addFavorite ───────────────────────────────────────────────
/**
 * Voegt een character toe aan de favorieten.
 * Doet niets als het character al in de lijst staat.
 *
 * @param {Object} character - Het character-object om op te slaan
 */
export const addFavorite = (character) => {
  const favorites = getFavorites();
 
  // Controleer of al aanwezig (gebruik van array methode .some())
  const alreadySaved = favorites.some(fav => fav.id === character.id);
 
  if (!alreadySaved) {
    // Spread: voeg character toe aan einde van array
    saveFavorites([...favorites, character]);
    console.log(`[Favorites] ⭐ "${character.name}" toegevoegd`);
  } else {
    console.log(`[Favorites] ℹ️ "${character.name}" was al opgeslagen`);
  }
};
 
// ── removeFavorite ────────────────────────────────────────────
/**
 * Verwijdert een character uit de favorieten via ID.
 *
 * @param {number|string} id - Het ID van het te verwijderen character
 */
export const removeFavorite = (id) => {
  const favorites = getFavorites();
 
  // Array methode .filter() maakt een nieuw array zonder het character
  const updated = favorites.filter(fav => fav.id !== id);
 
  saveFavorites(updated);
  console.log(`[Favorites] 🗑️ Character ID=${id} verwijderd`);
};
 
// ── isFavorite ────────────────────────────────────────────────
/**
 * Controleert of een character al in de favorieten staat.
 *
 * @param {number|string} id - Character ID
 * @returns {boolean} true als het al favoriet is
 */
export const isFavorite = (id) => {
  const favorites = getFavorites();
  // Array methode .some() geeft true als minstens 1 element voldoet
  return favorites.some(fav => fav.id === id);
};
 
// ── clearFavorites ────────────────────────────────────────────
/**
 * Verwijdert alle favorieten uit LocalStorage.
 */
export const clearFavorites = () => {
  localStorage.removeItem(STORAGE_KEY);

  console.log('[Favorites] 🗑️ Alle favorieten verwijderd');
};
 
// ── getFavoriteCount ──────────────────────────────────────────
/**
 * Geeft het aantal opgeslagen favorieten terug.
 *
 * @returns {number} Aantal favorieten
 */
export const getFavoriteCount = () => getFavorites().length;
