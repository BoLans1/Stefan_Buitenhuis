# Google Sheet Instructies voor Event Categorie Badge Systeem

## Wat moet je doen in je Google Sheet?

### Stap 1: Voeg een nieuwe kolom toe
In je Google Sheet waar je events beheert:
1. Ga naar kolom **H** (de 8e kolom)
2. Voeg een kolomtitel toe in rij 1: **Categorie**

### Stap 2: Vul de categorie in voor elk event
Voor elk event in je spreadsheet, vul in kolom H één van deze 4 categorieën in:

| Categorie | Wanneer te gebruiken | Badge kleur |
|-----------|---------------------|-------------|
| **pro** | Voor professionele shows, A-materiaal optredens | Blauw (primary color) |
| **wedstrijd** | Voor competities, wedstrijden met spanning | Oranje |
| **eigen** | Voor eigen shows, toekomstige voorstellingen | Paars |
| **openmic** | Voor open mic nights, try-out optredens | Grijs |

### Voorbeeld van je Google Sheet structuur:

```
A          B           C       D              E                 F        G       H
Datum      Titel       Locatie Stad           Ticket Link       Type     Time    Categorie
-----------------------------------------------------------------------------------------
15 mei     Comedy Show Theater Amsterdam      http://...        event    20:00   pro
22 mei     Keistad     Theater Den Haag       http://...        event    19:30   wedstrijd
5 juni     Open Mic    Cafe    Utrecht        http://...        event    21:00   openmic
```

### Stap 3: Update je Google Apps Script
1. Open je Google Apps Script editor (Extensions → Apps Script)
2. Vervang de oude code met de code uit het bestand `UPDATED_APPS_SCRIPT.js`
3. **BELANGRIJK**: Vervang `'JE_NIEUWE_TOKEN_HIER'` met je nieuwe GitHub Personal Access Token

### Stap 4: Genereer een nieuwe GitHub Token
1. Ga naar: https://github.com/settings/tokens
2. Klik op "Generate new token" → "Generate new token (classic)"
3. Geef een beschrijving: bijv. "Stefan Buitenhuis Website Sync"
4. Selecteer de scope: **repo** (volledige controle over repositories)
5. Klik "Generate token"
6. **Kopieer de token onmiddellijk** (je ziet hem daarna niet meer!)
7. Plak de token in je Apps Script op de plaats van `'JE_NIEUWE_TOKEN_HIER'`

### Stap 5: Test de synchronisatie
1. Sla je Apps Script op
2. Klik op "Run" → selecteer `syncToGitHub`
3. De eerste keer moet je toestemming geven
4. Check of je events.json bestand in GitHub is bijgewerkt

## Hoe werkt het badge systeem?

Wanneer je een categorie invult in je Google Sheet:
- De Google Apps Script leest kolom H (categorie)
- Het synchroniseert dit naar `data/events.json` in je GitHub repository
- Je website leest dit JSON bestand
- De JavaScript code in `js/events.js` maakt een gekleurd badge aan
- Het badge verschijnt naast de titel van het event

**Voorbeeld:**
- Event: "Keistad Cabaret Festival"
- Categorie: `wedstrijd`
- Resultaat: Oranje badge met tekst "WEDSTRIJD" naast de eventnaam

## Veelvoorkomende vragen

**Q: Wat als ik geen categorie invul?**
A: Dan wordt er geen badge getoond. Het event verschijnt gewoon zonder badge.

**Q: Kan ik andere categorieën gebruiken?**
A: Technisch wel, maar dan moet je ook `js/events.js` en `css/style.css` aanpassen om nieuwe badge kleuren toe te voegen.

**Q: Werken hoofdletters/kleine letters?**
A: Het systeem verwacht kleine letters: `pro`, `wedstrijd`, `eigen`, `openmic`

**Q: Hoe vaak synchroniseert het?**
A: Handmatig wanneer je de functie uitvoert in Apps Script, of automatisch als je een trigger instelt (bijv. elk uur).

## Hulp nodig?

Als er iets niet werkt:
1. Check de browser console (F12) voor foutmeldingen
2. Controleer of je token nog geldig is
3. Verifieer dat de categorie correct gespeld is (kleine letters!)
4. Check of `data/events.json` in GitHub correct is bijgewerkt
