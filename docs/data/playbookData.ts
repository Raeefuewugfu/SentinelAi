import { PlaybookEntry } from '../types';

export const playbook: PlaybookEntry[] = [
    {
        id: 'fake-webshop',
        title: 'De Valse Webshop',
        icon: 'GlobeAltIcon',
        tags: ['E-commerce', 'Phishing', 'Product niet geleverd'],
        explanation: `Een valse webshop is een website die is ontworpen om eruit te zien als een legitieme online winkel, maar die in werkelijkheid is opgezet om slachtoffers op te lichten. Ze lokken klanten met extreem lage prijzen voor populaire producten, maar na betaling wordt het product nooit geleverd. Vaak verdwijnt de hele website na een korte periode.`,
        example: `Je ziet een advertentie op social media voor de nieuwste iPhone voor slechts €350. De website ziet er professioneel uit, maar de enige betaalmethode is een directe bankoverschrijving naar een buitenlandse rekening. Nadat je hebt betaald, hoor je nooit meer iets en is de klantenservice onbereikbaar.`,
        takeaway: `Controleer altijd op keurmerken, bedrijfsgegevens (KvK, adres) en veilige betaalmethoden zoals creditcard of PayPal. Als een deal te mooi lijkt om waar te zijn, is dat het meestal ook.`
    },
    {
        id: 'bank-phishing',
        title: 'Bank Phishing E-mail',
        icon: 'EnvelopeIcon',
        tags: ['Phishing', 'Bankfraude', 'Identiteitsdiefstal'],
        explanation: `Bij deze scam ontvang je een e-mail die zogenaamd van je bank afkomstig is. De e-mail bevat een alarmerend bericht, bijvoorbeeld dat je account geblokkeerd wordt of dat er een verdachte transactie is gedetecteerd. Je wordt aangespoord om op een link te klikken om "in te loggen" en het probleem op te lossen. De link leidt echter naar een perfecte kopie van de bankwebsite, waar de oplichters je inloggegevens stelen.`,
        example: `Een e-mail met het logo van ING Bank in je inbox. Onderwerp: "URGENT: Uw betaalpas vervalt, valideer nu!". De e-mail vraagt je om via een link je gegevens bij te werken. De link gaat naar 'ing-veilig-inloggen.com'. Zodra je inlogt, hebben de criminelen toegang tot je rekening.`,
        takeaway: `Klik nooit op links in e-mails van je bank. Log altijd zelf in door het webadres handmatig in te typen of de officiële app te gebruiken. Een bank zal nooit via e-mail om je inloggegevens of pincode vragen.`
    },
    {
        id: 'whatsapp-vriend-in-nood',
        title: 'WhatsApp Vriend-in-nood Fraude',
        icon: 'ChatBubbleBottomCenterTextIcon',
        tags: ['WhatsApp', 'Social Engineering', 'Voorschotfraude'],
        explanation: `Je ontvangt een WhatsApp-bericht van een onbekend nummer. De afzender doet zich voor als een familielid of goede vriend (vaak je zoon of dochter) en beweert dat zijn/haar telefoon kapot is. Direct daarna volgt een verhaal over een dringende rekening die betaald moet worden en het verzoek of jij het geld kunt voorschieten.`,
        example: `"Hoi pap, dit is mijn nieuwe nummer, mijn telefoon viel in het water. Ik zit in de problemen, ik moet voor 17:00 een rekening betalen anders krijg ik een boete. Kun jij het voor me overmaken? Ik betaal het vanavond meteen terug."`,
        takeaway: `Wees direct achterdochtig. Bel het 'oude' nummer van de persoon om te verifiëren, of stel een persoonlijke vraag die een oplichter onmogelijk kan weten. Maak nooit zomaar geld over op basis van alleen WhatsApp-berichten.`
    },
    {
        id: 'crypto-investment',
        title: 'Crypto Investeringsscam',
        icon: 'CurrencyDollarIcon',
        tags: ['Investeringsfraude', 'Cryptocurrency', 'Social Media'],
        explanation: `Oplichters adverteren op social media met neppe of gemanipuleerde video's van bekende personen die een "uniek" crypto-investeringsplatform aanprijzen. Ze beloven onrealistisch hoge, gegarandeerde winsten. Slachtoffers worden naar een app of website geleid waar ze geld storten. Hun account toont al snel enorme winsten, maar wanneer ze proberen het geld op te nemen, moeten ze eerst allerlei 'belastingen' of 'transactiekosten' betalen. Uiteindelijk krijgen ze nooit iets terug.`,
        example: `Een advertentie op YouTube toont een deepfake van Elon Musk die een nieuwe crypto-app promoot die "gegarandeerd 20% rendement per week" oplevert. Je stort €500 en ziet dit in je account groeien naar €2000. Als je wilt opnemen, moet je eerst €400 "winstbelasting" betalen. Na betaling wordt je account geblokkeerd.`,
        takeaway: `Gegarandeerde hoge winsten bestaan niet in de investeringswereld. Gebruik alleen bekende, gereguleerde crypto exchanges en wees uiterst sceptisch tegenover advertenties op social media.`
    },
];