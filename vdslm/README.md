# Mažasis kalbos modelis (VDSLM)

Atverk svetainės /vdslm/ puslapį. Įrašyk arba įkelk tekstą, spausk „Apmokyti modelį“, pasirink pradinį žodį ir generuok seką. Modelis mokomas vietoje, naršyklėje, naudojant atskirą skaičiavimo procesą (Web Worker). Serverio, paskyros ir API rakto nereikia.

## Veikimo principas
Vieno ankstesnio žodžio Markovo grandinė, paremta pradinio projekto žodžių porų skaičiavimu. Tekstas paverčiamas mažosiomis raidėmis, atskiriami kableliai, taškai, brūkšneliai, brūkšniai ir skliaustai. Pabaiga susiejama su pradžia. Nežinomas pradinis žodis pakeičiamas artimiausiu pagal Levenšteino atstumą. Naršyklėje papildomai normalizuojami Unicode ženklai ir ribojama įvesties apimtis. Tai nėra neuroninis kalbos modelis.

## Pradinė Python versija
Išsaugoti failai vdslm.py, vdslm_train.py, vdslm_generate.py, data.txt ir vdslm_model.bin. Originalus angliškų kūrinių mokymo tekstas (pagal pradinį projektą – Project Gutenberg) ir senas modelis yra pirminio projekto medžiaga; svetainė jų automatiškai nenaudoja. Naujajam lietuviškam pavyzdžiui jie nereikalingi.

Pradinės komandos: python vdslm.py -t data.txt – apmokyti; python vdslm.py -g 50 – generuoti. Pradinis terminalo atvaizdavimas pritaikytas Unix aplinkai. Naršyklės versija veikia ir Windows.
