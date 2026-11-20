# Portfolio 3D — Natalia Płocha

Interaktywne portfolio w formie trójwymiarowego biurka renderowanego w przeglądarce.
Zamiast klasycznej strony z listą projektów odwiedzający „siada przy biurku”:
klika w monitor, żeby przeglądać projekty, albo w kartki, żeby zobaczyć i pobrać CV.

**▶ Wersja online: [praha6248.github.io/strona_portfolio](https://praha6248.github.io/strona_portfolio/)**

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
npm run dev        # serwer deweloperski Vite: http://localhost:5173/strona_portfolio/
```

Inne skrypty:

```bash
npm run build      # build produkcyjny do dist/
npm run preview    # podgląd builda
npm run lint       # ESLint
npm run deploy     # build + publikacja dist/ na gałąź gh-pages
```

`base` w `vite.config.js` jest ustawione na `/strona_portfolio/`, żeby ścieżki działały na GitHub Pages.

## Struktura

```
src/
  App.jsx        scena 3D, kamera, monitor z projektami, przycisk CV
  App.css        style okna „Projects”, nagłówka i kart projektów
  main.jsx       punkt wejścia React
public/
  obj/*.glb      modele 3D (biurko, monitor, kartki, akcesoria…)
  *.png          miniatury projektów i kursory
  Natalia_Plocha_CV.pdf
```

Żeby dodać projekt do „monitora”, dopisz kolejny blok `.project` w komponencie `MonitorScreen`
w `src/App.jsx` i wrzuć miniaturę do `public/`.

## Technologie

React 19 · Three.js · @react-three/fiber · @react-three/drei (CameraControls, Environment, Html) ·
@react-three/postprocessing · Vite · gh-pages

## Licencja

[MIT](LICENSE)
