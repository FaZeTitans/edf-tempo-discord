const axios = require('axios');
const schedule = require('node-schedule');
const puppeteer = require('puppeteer');


const API_URL = 'https://www.api-couleur-tempo.fr/api/jourTempo/tomorrow';
const EDF_CALENDAR_URL = 'https://particulier.edf.fr/fr/accueil/gestion-contrat/options/tempo.html#/';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

if (!DISCORD_WEBHOOK) {
    console.error('Erreur : La variable d\'environnement DISCORD_WEBHOOK n\'est pas définie.');
    process.exit(1);
}

async function getDaysLeft() {
    const browser = await puppeteer.launch({
        headless: true, // Mode headless (sans interface)
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Ajout des arguments nécessaires
    });
    const page = await browser.newPage();

    await page.goto(EDF_CALENDAR_URL);

    await page.waitForFunction(() => {
        const blue = document.querySelector('#a11y-blue-days span');
        const white = document.querySelector('#a11y-white-days span');
        const red = document.querySelector('#a11y-red-days span');
        return (
            blue &&
            blue.innerText !== '/' &&
            white &&
            white.innerText !== '/' &&
            red &&
            red.innerText !== '/'
        );
    });

    const data = await page.evaluate(() => {
        return [
            document.querySelector('#a11y-blue-days span').innerText,
            document.querySelector('#a11y-white-days span').innerText,
            document.querySelector('#a11y-red-days span').innerText,
        ];
    });

    await browser.close();

    return {
        blue: data[0],
        white: data[1],
        red: data[2],
    };
}

function getEmoji(code) {
    switch (code) {
        case 1:
            return ':blue_circle:';
        case 2:
            return ':white_circle:';
        case 3:
            return ':red_circle:';
        default:
            return ':black_circle:';
    }
}

function getColorName(code) {
    switch (code) {
        case 1:
            return 'Jour Bleu';
        case 2:
            return 'Jour Blanc';
        case 3:
            return 'Jour Rouge';
        default:
            return 'Information Inconnu';
    }
}

function getPrices(code) {
    switch (code) {
        case 1:
            return {
                hp: 16.09,
                hc: 12.96,
            };
        case 2:
            return {
                hp: 18.94,
                hc: 14.86,
            };
        case 3:
            return {
                hp: 75.62,
                hc: 15.68,
            };
        default:
            return {
                hp: -1,
                hc: -1,
            };
    }
}

function getColor(code) {
    switch (code) {
        case 1:
            return 0x0000ff;
        case 2:
            return 0xffffff;
        case 3:
            return 0xff0000;
        default:
            return 0x000000;
    }
}

async function fetchAndSendData() {
    const debugDate = new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
    });
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        const date = data.dateJour.split('-').reverse().join('/');

        const code = data.codeJour;
        const prices = getPrices(code);

        const daysLeft = await getDaysLeft();

        await axios.post(DISCORD_WEBHOOK, {
            content: null,
            embeds: [
                {
                    title: `EDF Tempo du ${date}`,
                    description: `**${getEmoji(code)} ${getColorName(
                        code
                    )}**\n\n**Tarif :**\n- Heures Pleines : ${
                        prices.hp
                    }\n- Heures Creuses : ${
                        prices.hc
                    }\n\n**Restants :**\n- Rouge : ${daysLeft.red}\n- Blanc : ${
                        daysLeft.white
                    }\n- Bleu: ${daysLeft.blue}`,
                    url: 'https://particulier.edf.fr/fr/accueil/gestion-contrat/options/tempo.html#/',
                    color: getColor(code),
                },
            ],
            attachments: [],
        });

        console.info(`${date} - Données envoyées à Discord avec succès.`);
    } catch (error) {
        console.error(
            `${debugDate} - Erreur lors de la récupération ou l’envoi des données :`,
            error
        );
    }
}

// Planification quotidienne à 12h
schedule.scheduleJob('0 12 * * *', fetchAndSendData);
console.info('Script initialisé avec succès.');

if (process.env.RUN_ON_STARTUP === 'true') {
    console.log(
        'Variable RUN_ON_STARTUP détectée. Exécution immédiate (debug)'
    );

    fetchAndSendData().catch((error) =>
        console.error("Erreur lors de l'exécution immédiate :", error)
    );
}