// ============================================================
// theme.js — Beheert de thema-wisselaar (data-theme op <html>)
// Gebruikt: localStorage, classList, querySelectorAll, events
// ============================================================

// De sleutel waarmee we het thema opslaan in localStorage
const THEME_KEY = 'invincible-theme';

// Laad het opgeslagen thema uit localStorage
// Als er geen opgeslagen thema is, gebruiken we 'yellow' als standaard
function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('yellow');
  }
}

// Pas het thema toe door de data-theme attribuut op <html> te zetten
function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem(THEME_KEY, themeName);
}

// Zet event listeners op alle thema-knoppen
function initThemeSwitcher() {
  const themeButtons = document.querySelectorAll('.theme-btn');

  for (let i = 0; i < themeButtons.length; i++) {
    const btn = themeButtons[i];

    btn.addEventListener('click', function () {
      const chosenTheme = btn.getAttribute('data-theme');
      applyTheme(chosenTheme);
    });
  }
}

// Exporteer de functies zodat main.js ze kan gebruiken
export { loadTheme, initThemeSwitcher };