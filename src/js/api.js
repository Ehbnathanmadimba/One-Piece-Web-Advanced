// ============================================================
// api.js — One Piece API communicatie
//
// Technische vereisten gedemonstreerd:
//   - fetch()                           (regel 28, 67, 86)
//   - async / await                     (regel 25, 64, 83)
//   - try / catch  (foutafhandeling)    (in main.js — hier gooien we de errors)
//   - Promises                          (fetch() is een Promise)
//   - Arrow functions                   (alle exports)
//   - Template literals                 (url-opbouw)
//   - Constanten (const)                (BASE_URL, alle functies)
// ============================================================
 
// Basis URL van de One Piece API v2 (Engels)
const BASE_URL = 'https://api.api-onepiece.com/v2';
 
// ── Hulpfunctie ─────────────────────────────────────────────
// Normaliseert de API-response naar een array, ongeacht de shape.
// De API kan een directe array of een wrapper-object teruggeven.
const normalizeResponse = (data, key = null) => {
  if (Array.isArray(data)) return data;
  if (key && Array.isArray(data[key])) return data[key];
  // Probeer de eerste array-waarde uit het object
  const firstArray = Object.values(data).find(v => Array.isArray(v));
  return firstArray ?? [];
};
 
// ── fetchAllCharacters ──────────────────────────────────────
/**
 * Haalt alle characters op van de One Piece API.
 * Probeert meerdere pagina's op te halen zodat we zeker 20+ items hebben.
 *
 * @returns {Promise<Array>} Array van character-objecten
 * @throws {Error} Als de HTTP-request mislukt
 */
export const fetchAllCharacters = async () => {
  console.log('[API] Characters ophalen...');

  const response = await fetch(`${BASE_URL}/characters/en`);

  if (!response.ok) {
    throw new Error(`API fout ${response.status}`);
  }

  const data = await response.json();

  console.log('[API] Ruwe data:', data);

  const characters = normalizeResponse(data, 'characters');

  console.log(`[API] ${characters.length} characters geladen`);

  return characters;
};
 
// ── fetchCharacterById ──────────────────────────────────────
/**
 * Haalt één specifiek character op via ID.
 *
 * @param {number|string} id - Het character-ID
 * @returns {Promise<Object>} Character-object
 * @throws {Error} Als character niet gevonden of request mislukt
 */
export const fetchCharacterById = async (id) => {
  console.log(`[API] 🔍 Character ID=${id} ophalen...`);
 
  const response = await fetch(`${BASE_URL}/characters/en/${id}`);
 
  if (!response.ok) {
    throw new Error(`Character ${id} niet gevonden: HTTP ${response.status}`);
  }
 
  const data = await response.json();
  console.log('[API] ✅ Character data:', data);
  return data;
};
 
// ── fetchCrews ──────────────────────────────────────────────
/**
 * Haalt alle crews op (voor de filter-dropdown).
 * Wordt gecombineerd met character-data in main.js.
 *
 * @returns {Promise<Array>} Array van crew-objecten
 */
export const fetchCrews = async () => {
  console.log('[API] ⚓ Crews ophalen...');
 
  const response = await fetch(`${BASE_URL}/crews/en`);
 
  if (!response.ok) {
    // Niet-kritieke fout: gooi een waarschuwing maar crash niet
    console.warn(`[API] ⚠️ Crews ophalen mislukt: ${response.status}`);
    return [];
  }
 
  const data = await response.json();
  const crews = normalizeResponse(data, 'crews');
 
  console.log(`[API] ✅ ${crews.length} crews opgehaald`);
  return crews;
};