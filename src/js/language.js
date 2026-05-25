// ============================================================
// language.js — Taalwisselaar (NL / EN / FR)
// Enkel UI-teksten — geen API-data vertaald.
// ============================================================

const LANG_KEY = 'one_piece_lang';

const translations = {
  nl: {
    btn_characters:     '⛵ Characters',
    btn_favorites:      '★ Favorieten',
    h2_characters:      'Characters',
    h2_favorites:       '★ Mijn Crew',
    sub_characters:     'Verken alle personages uit het One Piece universum',
    sub_favorites:      'Jouw opgeslagen characters',
    search_placeholder: 'Zoek een character...',
    filter_all_status:  'Alle statussen',
    filter_alive:       'Alive',
    filter_deceased:    'Deceased',
    filter_unknown:     'Unknown',
    filter_all_crews:   'Alle crews',
    sort_name_asc:      'Naam A → Z',
    sort_name_desc:     'Naam Z → A',
    loader_text:        'Plundering data van de Grand Line...',
    error_text:         '⚠ Er ging iets mis bij het ophalen van data. Controleer je verbinding.',
    retry_btn:          'Opnieuw proberen',
    clear_btn:          '🗑 Alle favorieten verwijderen',
    empty_title:        'Je hebt nog geen crew!',
    empty_sub:          'Klik op het ster-icoon op een character-kaartje om ze toe te voegen.',
    footer_sub:         'Gemaakt voor het vak Web Advanced • EHB • 2025–2026',
    label_role:         'Rol',
    label_crew:         'Crew',
    label_bounty:       'Bounty',
    label_origin:       'Afkomst',
    label_age:          'Leeftijd',
    label_fruit:        'Duivels Fruit',
    fav_add:            'Voeg toe aan favorieten',
    fav_remove:         'Verwijder uit favorieten',
    results:            (s, total) => `${s} van ${total} characters getoond`,
  },
  en: {
    btn_characters:     '⛵ Characters',
    btn_favorites:      '★ Favorites',
    h2_characters:      'Characters',
    h2_favorites:       '★ My Crew',
    sub_characters:     'Explore all characters from the One Piece universe',
    sub_favorites:      'Your saved characters',
    search_placeholder: 'Search a character...',
    filter_all_status:  'All statuses',
    filter_alive:       'Alive',
    filter_deceased:    'Deceased',
    filter_unknown:     'Unknown',
    filter_all_crews:   'All crews',
    sort_name_asc:      'Name A → Z',
    sort_name_desc:     'Name Z → A',
    loader_text:        'Plundering data from the Grand Line...',
    error_text:         '⚠ Something went wrong fetching data. Check your connection.',
    retry_btn:          'Try again',
    clear_btn:          '🗑 Remove all favorites',
    empty_title:        'No crew yet!',
    empty_sub:          'Click the star icon on a character card to add them.',
    footer_sub:         'Made for the Web Advanced course • EHB • 2025–2026',
    label_role:         'Role',
    label_crew:         'Crew',
    label_bounty:       'Bounty',
    label_origin:       'Origin',
    label_age:          'Age',
    label_fruit:        'Devil Fruit',
    fav_add:            'Add to favorites',
    fav_remove:         'Remove from favorites',
    results:            (s, total) => `${s} of ${total} characters shown`,
  },
  fr: {
    btn_characters:     '⛵ Personnages',
    btn_favorites:      '★ Favoris',
    h2_characters:      'Personnages',
    h2_favorites:       '★ Mon Équipage',
    sub_characters:     "Explorez tous les personnages de l'univers One Piece",
    sub_favorites:      'Vos personnages sauvegardés',
    search_placeholder: 'Rechercher un personnage...',
    filter_all_status:  'Tous les statuts',
    filter_alive:       'Vivant',
    filter_deceased:    'Décédé',
    filter_unknown:     'Inconnu',
    filter_all_crews:   'Tous les équipages',
    sort_name_asc:      'Nom A → Z',
    sort_name_desc:     'Nom Z → A',
    loader_text:        'Pillage des données de la Grand Line...',
    error_text:         "⚠ Une erreur s'est produite. Vérifiez votre connexion.",
    retry_btn:          'Réessayer',
    clear_btn:          '🗑 Supprimer tous les favoris',
    empty_title:        "Pas encore d'équipage !",
    empty_sub:          "Cliquez sur l'étoile d'une carte pour ajouter un personnage.",
    footer_sub:         'Créé pour le cours Web Advanced • EHB • 2025–2026',
    label_role:         'Rôle',
    label_crew:         'Équipage',
    label_bounty:       'Prime',
    label_origin:       'Origine',
    label_age:          'Âge',
    label_fruit:        'Fruit du Démon',
    fav_add:            'Ajouter aux favoris',
    fav_remove:         'Retirer des favoris',
    results:            (s, total) => `${s} sur ${total} personnages affichés`,
  },
};

// Geeft de opgeslagen taal terug (default: nl)
export const getLang = () => localStorage.getItem(LANG_KEY) || 'nl';

// Slaat de gekozen taal op in LocalStorage
export const setLang = (lang) => localStorage.setItem(LANG_KEY, lang);

// Geeft de vertaling terug voor de huidige taal
// Gebruik: t('label_age') → 'Leeftijd' / 'Age' / 'Âge'
export const t = (key, ...args) => {
  const val = translations[getLang()]?.[key] ?? translations['nl'][key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
};

// Past alle statische UI-teksten aan op basis van de huidige taal
export const updateLanguage = () => {

  // Nav knoppen
  document.getElementById('btn-characters').textContent = t('btn_characters');

  // Favorieten-knop: text node apart updaten zodat de fav-count span intact blijft
  const favBtn = document.getElementById('btn-favorites');
  favBtn.childNodes[0].nodeValue = t('btn_favorites') + ' ';

  // Section headers (h2 en sub — IDs toegevoegd in index.html, zie stap 2)
  const h2Ch = document.getElementById('h2-characters');
  if (h2Ch) h2Ch.textContent = t('h2_characters');

  const h2Fv = document.getElementById('h2-favorites');
  if (h2Fv) h2Fv.textContent = t('h2_favorites');

  const subCh = document.getElementById('sub-chars');
  if (subCh) subCh.textContent = t('sub_characters');

  const subFv = document.getElementById('sub-favs');
  if (subFv) subFv.textContent = t('sub_favorites');

  // Zoek input placeholder
  document.getElementById('search-input').placeholder = t('search_placeholder');

  // Filter status opties (vaste volgorde: alle, alive, deceased, unknown)
  const statusSel = document.getElementById('filter-status');
  statusSel.options[0].text = t('filter_all_status');
  statusSel.options[1].text = t('filter_alive');
  statusSel.options[2].text = t('filter_deceased');
  statusSel.options[3].text = t('filter_unknown');

  // Filter crew: enkel de eerste "alle" optie — rest is dynamisch gevuld
  document.getElementById('filter-crew').options[0].text = t('filter_all_crews');

  // Sorteer opties
  const sortSel = document.getElementById('sort-select');
  sortSel.options[0].text = t('sort_name_asc');
  sortSel.options[1].text = t('sort_name_desc');

  // Loader tekst
  const loaderP = document.querySelector('#loader p');
  if (loaderP) loaderP.textContent = t('loader_text');

  // Foutmelding
  const errorP = document.querySelector('#error-message p');
  if (errorP) errorP.textContent = t('error_text');

  // Knoppen
  document.getElementById('retry-btn').textContent = t('retry_btn');
  document.getElementById('clear-favorites-btn').textContent = t('clear_btn');

  // Empty state
  const emptyTitle = document.querySelector('.empty-title');
  if (emptyTitle) emptyTitle.textContent = t('empty_title');

  const emptySub = document.querySelector('#empty-favorites p:last-child');
  if (emptySub) emptySub.textContent = t('empty_sub');

  // Footer
  const footerSub = document.querySelector('.footer-sub');
  if (footerSub) footerSub.textContent = t('footer_sub');

  // Modal detail labels (volgorde: Crew, Rol, Afkomst, Leeftijd, Duivels Fruit)
  const modalKeys = ['label_crew', 'label_role', 'label_origin', 'label_age', 'label_fruit'];
  document.querySelectorAll('.modal-detail-row .detail-label').forEach((el, i) => {
    if (modalKeys[i]) el.textContent = t(modalKeys[i]);
  });
};