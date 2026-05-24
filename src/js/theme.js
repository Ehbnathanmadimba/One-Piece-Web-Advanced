// ============================================================
// theme.js — Themaswitcher voor One Piece Explorer
//
// Technische vereisten gedemonstreerd:
//   - LocalStorage               (getItem, setItem)
//   - DOM manipulatie            (setAttribute, querySelectorAll)
//   - Arrow functions            (alle functies)
//   - Constanten (const)         (STORAGE_KEY, THEMES, alle functies)
//   - Array methodes             (forEach)
//   - Event listeners            (theme-knoppen)
// ============================================================
 
const STORAGE_KEY = 'one_piece_theme';
const DEFAULT_THEME = 'straw-hat';
 
// Alle beschikbare thema's
const THEMES = ['straw-hat', 'marine', 'dark', 'gold'];
 
// ── getTheme ──────────────────────────────────────────────────
/**
 * Leest het opgeslagen thema uit LocalStorage.
 * Valt terug op het standaardthema als er niets opgeslagen is.
 *
 * @returns {string} Themanaam
 */
export const getTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  // Ternary: gebruik opgeslagen thema als het geldig is, anders default
  return (saved && THEMES.includes(saved)) ? saved : DEFAULT_THEME;
};
 
// ── setTheme ──────────────────────────────────────────────────
/**
 * Past het thema toe op de <html>-tag en slaat het op in LocalStorage.
 *
 * @param {string} theme - De themanaam (bv. 'straw-hat')
 */
export const setTheme = (theme) => {
  if (!THEMES.includes(theme)) {
    console.warn(`[Theme] ⚠️ Ongeldig thema: "${theme}"`);
    return;
  }
 
  // DOM manipulatie: pas data-attribuut aan op het root-element
  document.documentElement.setAttribute('data-theme', theme);
 
  // Persistentie: sla op in LocalStorage
  localStorage.setItem(STORAGE_KEY, theme);
 
  // Update de actieve staat van de thema-knoppen
  updateActiveThemeButton(theme);
 
  console.log(`[Theme] 🎨 Thema ingesteld: "${theme}"`);
};
 
// ── updateActiveThemeButton ──────────────────────────────────
/**
 * Voegt de class 'active-theme' toe aan de actieve thema-knop
 * en verwijdert hem van de anderen.
 *
 * @param {string} activeTheme - Het actieve thema
 */
const updateActiveThemeButton = (activeTheme) => {
  // DOM: selecteer alle thema-knoppen
  const buttons = document.querySelectorAll('.theme-btn');
 
  // Array methode (via NodeList): forEach over alle knoppen
  buttons.forEach(btn => {
    const isActive = btn.dataset.theme === activeTheme;
    // Ternary: voeg class toe of verwijder hem
    isActive
      ? btn.classList.add('active-theme')
      : btn.classList.remove('active-theme');
  });
};
 
// ── initTheme ─────────────────────────────────────────────────
/**
 * Initialiseert het thema bij opstarten van de app:
 *   1. Laadt het opgeslagen thema uit LocalStorage
 *   2. Past het toe op de DOM
 *   3. Koppelt click-events aan alle thema-knoppen
 */
export const initTheme = () => {
  // Laad het opgeslagen thema en pas het toe
  const savedTheme = getTheme();
  setTheme(savedTheme);
 
  // Event listeners koppelen aan thema-knoppen
  const buttons = document.querySelectorAll('.theme-btn');
 
  buttons.forEach(btn => {
    // Arrow function als event handler (callback function)
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
    });
  });
 
  console.log(`[Theme] ✅ Thema initialisatie klaar (actief: "${savedTheme}")`);
};