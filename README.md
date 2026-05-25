☠️ One Piece Explorer

Een interactieve single-page webapplicatie waarmee je alle personages uit het One Piece-universum kunt verkennen, filteren, sorteren en opslaan in jouw persoonlijke crew.

Gebouwd als eindproject voor het vak Web Advanced aan de Erasmushogeschool Brussel (EHB) – academiejaar 2025–2026.

📖 Projectbeschrijving
One Piece Explorer is een single-page applicatie (SPA) gericht op fans van de manga en anime One Piece. Via de gratis One Piece API worden karakterdata opgehaald en op een visueel aantrekkelijke manier getoond.
De gebruiker kan:

Personages doorzoeken en filteren op naam, status en crew
Personages sorteren op alfabetische volgorde
Een detailmodal openen voor uitgebreide informatie per karakter
Favoriete personages toevoegen aan "Mijn Crew" – opgeslagen in de browser via localStorage
De interface aanpassen via een thema-wisselaar (4 thema's) en een taalkeuze (NL / EN / FR)


✨ Functionaliteiten
🔍 Dataverzameling & -weergave

Haalt meer dan 20 karakterobjecten op via de One Piece API
Toont elk karakter als een visueel kaartje met minstens 6 gegevenskolommen: naam, status, crew, rol, afkomst, leeftijd en duivels fruit
Initiële laadindicator met een themabewust laadscherm
Foutmelding met een "Opnieuw proberen"-knop als de API onbereikbaar is

🎛️ Interactiviteit
FunctieBeschrijvingZoekenRealtime filteren op naam via een zoekveldFilter op statusAlive / Deceased / UnknownFilter op crewDynamisch gevuld op basis van opgehaalde dataSorterenNaam A → Z of Z → AResultaattellerToont het aantal zichtbare resultaten liveDetailmodalKlik op een kaartje voor een uitgebreide weergave
⭐ Personalisatie

Favorieten toevoegen/verwijderen via een ster-icoon per kaartje
Favorieten worden bewaard in localStorage en blijven aanwezig na het herladen van de pagina
Favorieten-teller in de navigatiebalk wordt live bijgewerkt
Alle favorieten tegelijk verwijderen via de "Verwijder alles"-knop

🎨 Gebruikersvoorkeuren
VoorkeurOpgeslagen inThema (4 keuzes)localStorageTaal (NL / EN / FR)localStorageFavorietenlocalStorage
📱 Gebruikerservaring

Responsive design – werkt op desktop, tablet en mobiel
Vier visuele thema's: Straw Hat (rood), Marine (blauw), Blackbeard (donker) en Gold Roger (goud)
Meertalige interface in Nederlands, Engels en Frans
Toegankelijke modal met aria-attributen en een sluitknop
Lege-staat animatie wanneer er geen favorieten zijn


🛠️ Gebruikte technologieën
TechnologieDoelHTML5Semantische structuurCSS3 (Custom Properties, Flexbox, Grid)Styling, thema's en responsive layoutVanilla JavaScript (ES2022+)Alle logica, DOM-manipulatie en API-callsViteBundler en ontwikkelomgevingOne Piece APIBrondata voor karakterslocalStoragePersistente opslag van voorkeuren en favorietenGoogle FontsPirata One (display) & Crimson Pro (body)

🌐 API-informatie

Naam: One Piece API
URL: https://api-onepiece.com/en/documentation
Type: REST API (gratis, geen authenticatie vereist)
Gebruikte endpoint: GET /v2/characters/en – haalt een lijst op van alle personages
Datavelden per karakter: naam, status, crew, rol, afkomst, leeftijd, duivels fruit, avatar-URL


📁 Projectstructuur
one-piece-explorer/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── screenshots/          ← Plaats hier jouw screenshots
│   ├── css/
│   │   └── style.css             ← Alle stijlen, inclusief thema-variabelen
│   └── js/
│       ├── main.js               ← Startpunt – initialisatie en event listeners
│       ├── api.js                ← Fetch-logica en API-communicatie
│       ├── render.js             ← DOM-manipulatie en kaartjes genereren
│       ├── filters.js            ← Filter-, zoek- en sorteerfuncties
│       ├── favorites.js          ← Favorieten beheren via localStorage
│       ├── modal.js              ← Detailmodal openen en sluiten
│       ├── theme.js              ← Thema-wisselaar en persistentie
│       └── i18n.js               ← Meertaligheid (NL / EN / FR)
├── index.html                    ← Hoofd HTML-bestand
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

🚀 Installatie
Vereisten

Node.js v18 of hoger
npm (meegeleverd met Node.js)

Stappen

Clone de repository

bash   git clone https://github.com/jouw-gebruikersnaam/one-piece-explorer.git
   cd one-piece-explorer

Installeer de afhankelijkheden

bash   npm install

Start de ontwikkelserver

bash   npm run dev
De applicatie is beschikbaar op http://localhost:5173

Productie-build aanmaken

bash   npm run build
De geoptimaliseerde bestanden worden gegenereerd in de dist/-map.

Preview van de productie-build

bash   npm run preview

📚 Web Advanced – Technische concepten
Hieronder staat per vereist concept beschreven waar en hoe het is toegepast in de code.
DOM Manipulatie
ConceptLocatieToelichtingElementen selecterenrender.jsdocument.getElementById('cards-grid') om het kaartjesraster op te halenElementen manipulerenrender.jsinnerHTML en classList.toggle om kaartjes dynamisch toe te voegen en de actieve sectie te wisselenEvents koppelenmain.jsaddEventListener('click', ...) op navigatieknoppen, filters, sortering en favorieten-iconen
Modern JavaScript
ConceptLocatieToelichtingConstanten (const)OveralAlle variabelen die niet worden overschreven zijn gedeclareerd met constTemplate literalsrender.jsKaartjes-HTML wordt opgebouwd via `<div class="card">${character.name}</div>`Iteratie over arraysrender.js, filters.jscharacters.forEach(...) om elk karakter te renderenArray methodesfilters.js.filter(), .sort(), .map(), .includes() voor zoeken, filteren en sorterenArrow functionsOveralconst renderCards = (data) => { ... } en callbacks in .filter(c => ...)Ternary operatorrender.jscharacter.status === 'alive' ? 'badge--alive' : 'badge--deceased' voor status-badgesCallback functionsmain.jsEvent listeners die verwijzen naar benoemde callback-functiesPromisesapi.jsfetch() retourneert een Promise, afgehandeld met .then().catch()Async & Awaitapi.jsasync function fetchCharacters() met await fetch(...) en await response.json()Observer APIrender.jsIntersectionObserver voor lazy loading van avatar-afbeeldingen terwijl de gebruiker scrolt
Data & API
ConceptLocatieToelichtingFetchapi.jsfetch('https://api-onepiece.com/v2/characters/en') haalt alle karakterdata opJSON manipulerenapi.js, render.jsResponse wordt geparsed via response.json() en vervolgens gemapped naar UI-elementen
Opslag & Validatie
ConceptLocatieToelichtingFormuliervalidatiemain.jsHet zoekveld wordt gevalideerd: lege of te korte invoer triggert geen onnodige API-callsLocalStoragefavorites.js, theme.js, i18n.jsFavorieten, gekozen thema en taalvoorkeur worden opgeslagen en bij het laden hersteld
Styling & Layout
ConceptLocatieToelichtingCSS Gridstyle.css.cards-grid maakt gebruik van display: grid met auto-fill kolommenFlexboxstyle.css.header-inner, .controls-bar en .modal-header zijn opgezet met FlexboxGebruiksvriendelijke elementenindex.html, style.cssVerwijderknoppen (✕), ster-iconen (★), lege-staat animaties en duidelijke badge-kleuren
Tooling & Structuur
ConceptLocatieToelichtingVitepackage.jsonGeconfigureerd als bundler via "dev": "vite", "build": "vite build"FolderstructuurZie ProjectstructuurGescheiden css/ en js/ mappen onder src/, met een dist/-map voor de build

📎 Bronnen
API

One Piece API – Documentatie

Gebruikte hulpbronnen

MDN Web Docs – Fetch API
MDN Web Docs – localStorage
MDN Web Docs – IntersectionObserver
MDN Web Docs – CSS Custom Properties
Vite – Getting Started
Google Fonts – Pirata One & Crimson Pro

AI-hulp

Gesprekken met Claude (Anthropic) zijn gebruikt als ondersteuning bij het schrijven van deze README en het opzetten van de basisstructuur. De volledige chatgeschiedenis is beschikbaar op verzoek.
