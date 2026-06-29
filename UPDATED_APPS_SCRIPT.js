/**
 * Stefan Buitenhuis Website Evenementen Updater - BIJGEWERKT
 * Dit script leest evenementen uit een Google Sheet en update de GitHub repository
 * met nieuwe evenementeninformatie voor de website.
 * 
 * BELANGRIJK: Vervang het oude token door een nieuw Personal Access Token!
 */

// Configuratie
const GITHUB_TOKEN = 'JE_NIEUWE_TOKEN_HIER'; // ⚠️ Vervang dit met je nieuwe GitHub Personal Access Token
const REPO_OWNER = 'BoLans1';
const REPO_NAME = 'Stefan_Buitenhuis';
const EVENTS_FILE_PATH = 'data/events.json';
const EVENTS_SHEET_NAME = 'Events';
const NEWS_SHEET_NAME = 'Nieuws';
const BRANCH_NAME = 'main';

// De bladstructuur bevat naar verwachting kolommen:
// Datum | Titel | Locatie | Stad | Beschrijving | URL | Afbeelding URL | Categorie

/**
 * Hoofdfunctie om de evenementen op de website te updaten
 */
function updateWebsiteEvenementen() {
    try {
        // Evenementen ophalen uit het spreadsheet
        const evenementen = getEvenementenFromSheet();
        Logger.log("Evenementen: " + JSON.stringify(evenementen));

        // Nieuws ophalen uit het spreadsheet
        const nieuws = getNieuwsFromSheet();
        Logger.log("Nieuws: " + JSON.stringify(nieuws));

        // Huidige bestand ophalen van GitHub
        const currentFileData = getFileFromGitHub();

        // Het bestandsinhoud in GitHub bijwerken
        updateFileInGitHub(evenementen, nieuws, currentFileData);

        // Toon een succesbericht
        SpreadsheetApp.getActiveSpreadsheet().toast('Evenementen en nieuws zijn succesvol bijgewerkt!', 'Succes', 5);

        Logger.log('Evenementen en nieuws succesvol bijgewerkt!');
    } catch (error) {
        SpreadsheetApp.getActiveSpreadsheet().toast('Fout bij het updaten: ' + error.message, 'Fout', 5);
        Logger.log('Fout bij het updaten: ' + error.message);
    }
}

/**
 * Leest evenementendata uit het actieve spreadsheet
 * en converteert naar het juiste formaat voor de website
 */
function getEvenementenFromSheet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(EVENTS_SHEET_NAME);

    // Als het tabblad niet bestaat, return een lege array
    if (!sheet) return [];

    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    // Header-rij overslaan
    const evenementen = [];
    for (let i = 1; i < values.length; i++) {
        const row = values[i];

        // Lege rijen overslaan
        if (!row[0] || !row[1]) continue;

        // Datum omzetten naar standaard formaat dat de website verwacht
        let date;
        if (row[0] instanceof Date) {
            // Als het een Date object is, formatteer het naar YYYY-MM-DD
            const d = row[0];
            date = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        } else {
            // Als het een string is, gebruik het zoals het is
            date = row[0].toString();
        }

        // Maak het evenement met Engelse veldnamen + NIEUW: category veld
        const evenement = {
            date: date,
            title: row[1] || '',          // Titel
            venue: row[2] || '',          // Locatie / venue
            city: row[3] || '',           // Stad
            description: row[4] || '',    // Beschrijving
            ticketLink: row[5] || '',     // URL
            imageUrl: row[6] || '',       // Afbeelding URL
            category: row[7] || ''        // ⭐ NIEUW: Categorie (pro, wedstrijd, eigen, openmic)
        };

        evenementen.push(evenement);
    }

    // Evenementen sorteren op datum
    evenementen.sort((a, b) => new Date(a.date) - new Date(b.date));

    return evenementen;
}

/**
 * Leest nieuwsdata uit het spreadsheet
 * en converteert naar het juiste formaat voor de website
 */
function getNieuwsFromSheet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NEWS_SHEET_NAME);

    // Als het tabblad niet bestaat, return een lege array
    if (!sheet) return [];

    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    // Header-rij overslaan
    const nieuwsItems = [];
    for (let i = 1; i < values.length; i++) {
        const row = values[i];

        // Lege rijen overslaan
        if (!row[0]) continue;

        // Maak het nieuwsitem
        const nieuwsItem = {
            title: row[0] || '',          // Titel
            text: row[1] || '',           // Tekst
            ctaText: row[2] || '',        // Call-to-action tekst
            ctaLink: row[3] || ''         // Call-to-action link
        };

        nieuwsItems.push(nieuwsItem);
    }

    return nieuwsItems;
}

/**
 * Haalt de huidige bestandsinhoud op uit GitHub repository
 */
function getFileFromGitHub() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}?ref=${BRANCH_NAME}`;

    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + GITHUB_TOKEN,
            'Accept': 'application/vnd.github.v3+json'
        },
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 200) {
        return JSON.parse(response.getContentText());
    } else if (responseCode === 404) {
        // Bestand bestaat nog niet
        return null;
    } else {
        throw new Error(`Fout bij ophalen bestand. Responsecode: ${responseCode}, Bericht: ${response.getContentText()}`);
    }
}

/**
 * Update het evenementenbestand in GitHub met nieuwe inhoud
 */
function updateFileInGitHub(evenementen, nieuws, currentFileData) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}`;

    // Inhoud voorbereiden - gebruik "events" als sleutel en "news" voor nieuws
    const content = JSON.stringify({
        events: evenementen,
        news: nieuws
    }, null, 2);

    const encodedContent = Utilities.base64Encode(content);

    // Request body voorbereiden
    const requestBody = {
        message: 'Update evenementen en nieuws via Google Apps Script',
        content: encodedContent,
        branch: BRANCH_NAME
    };

    // Als het bestand al bestaat, voeg de SHA toe
    if (currentFileData && currentFileData.sha) {
        requestBody.sha = currentFileData.sha;
    }

    const options = {
        method: 'PUT',
        headers: {
            'Authorization': 'token ' + GITHUB_TOKEN,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        payload: JSON.stringify(requestBody),
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode !== 200 && responseCode !== 201) {
        throw new Error(`Fout bij updaten bestand. Responsecode: ${responseCode}, Bericht: ${response.getContentText()}`);
    }

    return JSON.parse(response.getContentText());
}

/**
 * Maakt menu-items aan in de Google Sheets UI wanneer het spreadsheet wordt geopend
 */
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Website Evenementen')
        .addItem('Publiceer Evenementen & Nieuws', 'updateWebsiteEvenementen')
        .addItem('Toon Publicatie Tool', 'toonPublicatieSidebar')
        .addToUi();
}

/**
 * Voegt een knop toe aan de werkbalk
 */
function onInstall() {
    onOpen();
}

/**
 * Maakt een aangepaste zijbalk met een publicatieknop
 */
function toonPublicatieSidebar() {
    const html = HtmlService.createHtmlOutput(`
    <div style="padding: 10px; font-family: Arial, sans-serif;">
      <h3>Stefan Buitenhuis</h3>
      <p>Klik op de knop om evenementen en nieuws te publiceren naar de website.</p>
      <button onclick="publiceerEvenementen()" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Publiceer Evenementen & Nieuws</button>
      <p id="resultaat"></p>
      
      <script>
        function publiceerEvenementen() {
          document.getElementById('resultaat').innerHTML = '<em>Bezig met publiceren...</em>';
          google.script.run
            .withSuccessHandler(function(result) {
              document.getElementById('resultaat').innerHTML = '<strong style="color: green;">Evenementen en nieuws succesvol gepubliceerd!</strong>';
            })
            .withFailureHandler(function(error) {
              document.getElementById('resultaat').innerHTML = '<strong style="color: red;">Fout: ' + error + '</strong>';
            })
            .updateWebsiteEvenementen();
        }
      </script>
    </div>
  `)
        .setTitle('Publicatie Tool')
        .setWidth(300);

    SpreadsheetApp.getUi().showSidebar(html);
}
