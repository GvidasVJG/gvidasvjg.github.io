# Informatikos laboratorija

Lietuviška mokymosi svetainė: **[gvidasvjg.github.io](https://gvidasvjg.github.io/)**.
Visos priemonės ir jų failai laikomi šioje vienoje saugykloje. Atskirų projektų klonuoti nereikia.

## Priemonės

| Aplankas arba failas | Turinys |
| --- | --- |
| `mastermind/` | Spalvų kodo spėjimo žaidimas |
| `nim.ai/` | Degtukų žaidimas su besimokančiu DI |
| `vdslm/` | Kalbos modelio apmokymas ir teksto generavimas naršyklėje |
| `Simple-CPU/` | Procesoriaus simuliatorius su lietuviška pagalba |
| `septyni-segmentai/` | Ekranėlio segmentai ir dvejetainis kodavimas |
| `modulo-clock.html` | Modulio laikrodis ir laipsnių liekanos |
| `pavyzdys/` | „Python“, dalumo sąlygos ir „Git“ pradmenys |
| `html-pavyzdys/` | Lietuviškas HTML pavyzdys ir jo paaiškinimas |
| `edu-db/` | SQL laboratorija ir originali SQLite bazė |
| `report-template-vjg/` | 13 vaizdinių dokumento formatavimo temų |
| `BD_template/` | Kelių failų „LaTeX“ brandos darbo šablonas |

## Paleidimas kompiuteryje

Reikia „Node.js“ 22 arba naujesnio. Bibliotekų diegti nereikia:

```sh
npm start
```

Atverk **http://127.0.0.1:4173**. SQL ir kalbos modelis naudoja naršyklės skaičiavimo procesus ir turi būti atverti per HTTP, o ne dukart paspaudus HTML failą. Asmeninio serverio ar API rakto nereikia: paskelbtame „GitHub Pages“ puslapyje viskas vyksta naršyklėje.

## Skelbimas

Svetainė yra statinė. „GitHub Pages“ šaltinis: šaka **main**, aplankas **/(root)**. Failas `.nojekyll` užtikrina, kad aplankai, failų vardai ir mokymo medžiaga nebūtų apdorojami „Jekyll“. Įprastai pakeitimai paskelbiami automatiškai atnaujinus `main`.

Nereikia kūrimo žingsnio, duomenų bazių paslaugos, mokamų API ar išorinių CDN. SQL vykdymui reikalinga `sql.js` 1.13.0 biblioteka ir jos WASM failas yra `assets/vendor/` kartu su licencija.

## Keitimas

- Pagrindinis katalogas: `index.html`, stiliai: `assets/site.css`, paieška: `assets/catalog.js`.
- Kiekvieno projekto kodas yra jo aplanke. Nuorodos yra santykinės.
- Kalbos modelio logika: `vdslm/engine.mjs`; skaičiavimai: `vdslm/worker.mjs`; sąsaja: `vdslm/app.js`.
- Rašto darbo temų bendras peržiūros kodas: `assets/tour.js` ir `assets/tour.css`.
- Keisdamas „LaTeX“ šabloną atnaujink ir `downloads/brandos-darbo-sablonas.zip`. Šablono PDF kompiliavimas nepriklauso svetainės paleidimui.

## Patikros

```sh
npm test
npm run check
```

Testai tikrina kalbos modelio žodžių poras, tikimybes, atsitiktinį pasirinkimą, Unicode, nežinomus žodžius ir įvesties ribas. Nuorodų patikra patikrina visus HTML puslapius ir vietinius failus. Automatinė „GitHub Actions“ patikra kartoja abu veiksmus.

Naršyklės patikra: paleidus vietinį serverį, įdiek testavimui `playwright@1.55.1` ir vykdyk `node tests/browser.cjs`. Pagal nutylėjimą naudojamas „Playwright Chromium“; norint naudoti įdiegtą naršyklę, nustatyk `BROWSER_EXECUTABLE`. Ekrano nuotraukos saugomos ignoruojamame `test-results/` aplanke.

## Sujungimo apimtis

Perkeltas nurodytų projektų turinys, išsaugoti originalūs „Python“ failai, SQL bazė, nuotraukos ir „LaTeX“ failai. Lietuviška svetainės sąsaja, pamokų aprašymai ir nauji pavyzdžiai laikomi čia. Pirminis angliškas VDSLM mokymo tekstas ir licencijų tekstai išsaugoti originalo kalba; jie nėra numatytasis svetainės mokymo turinys.

Projektų šaltiniai ir tikslios importuotos versijos: [SALTINIAI.md](SALTINIAI.md). Šaltinių Git istorijos neperrašytos į šią saugyklą. Senos nuotolinės saugyklos neištrintos ir nesuarchyvuotos; tolesnius pakeitimus reikia daryti šioje saugykloje.
