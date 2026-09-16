# Passordgenerator PWA

En Progressive Web App for å generere lett-å-huske passord.

## Funksjoner

- 📱 Kan installeres på mobil og desktop
- 🔌 Fungerer offline
- 🎨 Responsivt design
- 📋 Klikk for å kopiere passord
- ⚡ Rask og lett
- 🔑 Oversikt over fysiske nøkler fra `nokler.csv`

## Oppsett

### 1. Lag ikoner

PWA-en trenger to PNG-ikoner. Du kan bruke `icon.svg` som mal:

**Alternativ A: Bruk nettbasert konverter**
1. Åpne `icon.svg` i en nettleser
2. Ta et skjermbilde eller bruk en SVG-til-PNG konverter
3. Lag to versjoner:
   - `icon-192.png` (192x192 piksler)
   - `icon-512.png` (512x512 piksler)

**Alternativ B: Bruk ImageMagick (hvis installert)**
```bash
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
```

**Alternativ C: Bruk et online verktøy**
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

### 2. Start en lokal server

PWA-er krever HTTPS (eller localhost). For testing:

**Python 3:**
```bash
cd passord-pwa
python3 -m http.server 8000
```

**Node.js (npx):**
```bash
cd passord-pwa
npx serve
```

Åpne deretter nettleseren på `http://localhost:8000`

### 3. Test installasjonen

1. Åpne appen i Chrome, Edge eller Safari
2. Du skal se en installasjonsprompt, eller:
   - **Chrome/Edge**: Klikk på installasjons-ikonet i adressefeltet
   - **Safari (iOS)**: Del > Legg til på hovedskjermen
   - **Safari (Mac)**: Fil > Legg til i Dock

## Deployment

For produksjon, må appen hostes på HTTPS. Alternativer:

### GitHub Pages
1. Legg filene i et GitHub repo
2. Aktiver GitHub Pages i Settings
3. Appen vil være tilgjengelig på `https://brukernavn.github.io/repo-navn/`

### Netlify/Vercel
1. Opprett konto på Netlify eller Vercel
2. Dra og slipp `passord-pwa` mappen
3. Gratis HTTPS inkludert

### Egen server
- Krever HTTPS (Let's Encrypt er gratis)
- Konfigurer webserver til å serve filene

## Filstruktur

```
passord-pwa/
├── index.html          # Hovedside
├── styles.css          # Styling
├── passord.js          # Passordlogikk
├── nokler.js           # CSV-parser for nøkler
├── nokler-ui.js        # Viser nøkkeloversikten
├── nokler.csv          # Nøkkeldata (rediger denne)
├── nokler.test.js      # Tester (node --test)
├── app.js              # App-logikk, faner og PWA-håndtering
├── sw.js               # Service Worker (offline-funksjonalitet)
├── manifest.json       # PWA metadata
├── icon.svg            # Ikon-mal
├── icon-192.png        # App-ikon 192x192 (må lages)
├── icon-512.png        # App-ikon 512x512 (må lages)
└── README.md           # Denne filen
```

## Bruk

1. Åpne appen
2. Klikk 'Generer passord' for å lage nye passord
3. Velg antall passord fra nedtrekkslisten
4. Klikk på et passord for å kopiere det til utklippstavlen

### Nøkler

Fanen «Nøkler» viser innholdet i `nokler.csv`. Rediger filen, commit og push, så oppdateres appen ved neste lasting.

```csv
navn,beskrivelse
Hovednøkkel,Ytterdør hjemme
Hytta,"Nøkkelknippe med tre nøkler:
- Ytterdør
- Anneks
- Bod
Henger i skapet i gangen."
```

Beskrivelsen kan settes i anførselstegn og gå over flere linjer. Merk at repoet er offentlig, så ikke legg inn sensitiv informasjon.

## Tester

```bash
node --test
```

## Teknologi

- Vanilla JavaScript (ingen dependencies)
- Service Worker for offline-funksjonalitet
- Web App Manifest for installerbarhet
- Responsive CSS Grid/Flexbox

## Lisens

Hobby-prosjekt, bruk fritt!
