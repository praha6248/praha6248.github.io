# Portfolio 3D — Natalia Płocha

Interaktywne portfolio w formie trójwymiarowego biurka renderowanego w przeglądarce.
Zamiast klasycznej strony z listą projektów odwiedzający „siada przy biurku”:
klika w monitor, żeby przeglądać projekty, albo w kartki, żeby zobaczyć i pobrać CV.

**▶ Wersja online: [praha6248.github.io](https://praha6248.github.io/)**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r183-000000?logo=threedotjs)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-222?logo=github)

## Funkcje

- **Scena 3D** — biurko z akcesoriami wczytywane z modeli `.glb`, oświetlenie środowiskowe i cienie.
- **Nawigacja kamerą** — płynne przejścia między widokami (*Home*, *Projects*, *Resume*), sterowane
  z menu u góry albo kliknięciem w obiekt na scenie.
- **Podświetlanie obiektów** — po najechaniu kursorem monitor i kartki dostają obrys (postprocessing `Outline`).
- **Ekran monitora jako okno HTML** — lista projektów z miniaturami, stosem technologii i linkami do GitHuba,
  osadzona w scenie 3D (`<Html transform>` z drei).
- **CV do pobrania** — po przybliżeniu kartek pojawia się przycisk *Download CV*.

## Uruchomienie lokalne

Wymagany Node.js 20+.

```bash
npm install
npm run dev        # serwer deweloperski Vite: http://localhost:5173/
```

Inne skrypty:

```bash
npm run build      # build produkcyjny do dist/
npm run preview    # podgląd builda
npm run lint       # ESLint
npm run deploy     # build + publikacja dist/ na gałąź gh-pages
```

Repo nazywa się `praha6248.github.io`, więc strona działa w katalogu głównym domeny (`base: '/'` w `vite.config.js`).

## Struktura

```
src/
  App.jsx        scena 3D, kamera, ekran monitora, ekran ładowania, awaryjny widok bez 3D
  projects.js    lista projektów na monitorze i linki kontaktowe
  App.css        style okna „Projects”, nagłówka i kart projektów
  main.jsx       punkt wejścia React
public/
  obj/*.glb      modele 3D (biurko, monitor, kartki, akcesoria…)
  projects/      miniatury projektów (WebP, 1600×744)
  Natalia_Plocha_CV.pdf, og.png, favicon.svg
scripts/
  replace-cv-texture.mjs   podmienia obraz CV na kartkach (kartki.glb)
```

Żeby dodać projekt do „monitora”, dopisz obiekt w `src/projects.js` i wrzuć miniaturę
1600×744 do `public/projects/`.

Lista projektów jest zwykłą warstwą HTML ustawianą nad ekranem monitora (pozycja liczona
z projekcji rogów ekranu), więc tekst i obrazki są ostre na każdym ekranie. Na telefonie
otwiera się jako panel na całą szerokość. Adresy `#projects` i `#resume` otwierają od razu
odpowiedni widok.

Po zmianie CV: wygeneruj PDF, wyrenderuj stronę do JPG (portret obrócony o 90° w prawo,
ok. 2800×1980) i uruchom `node scripts/replace-cv-texture.mjs cv.jpg`.

## Technologie

React 19 · Three.js · @react-three/fiber · @react-three/drei (CameraControls, Environment + Lightformer) ·
@react-three/postprocessing · Vite · gh-pages

## Licencja

Kod: [MIT](LICENSE). Treść CV i modele 3D nie są objęte licencją.
