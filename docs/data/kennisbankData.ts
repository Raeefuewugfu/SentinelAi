
import { KennisbankArticle } from '../types';

export const articles: KennisbankArticle[] = [
    {
        id: 'fake-webshops',
        title: 'Fake Webshops Ontmaskeren',
        icon: 'GlobeAltIcon',
        description: 'Leer de rode vlaggen van nepwinkels te herkennen voordat u een aankoop doet.',
        content: `
### Hoe Herken Je Een Fake Webshop?

Oplichters worden steeds beter in het maken van professioneel ogende webshops. Let op deze signalen om te voorkomen dat je in de val trapt.

**1. Ongeloofwaardige Aanbiedingen**
*   **"Te mooi om waar te zijn":** Producten van bekende merken (Apple, Dyson, Nike) worden aangeboden voor een fractie van de normale prijs. Wees sceptisch bij kortingen van meer dan 50-70%.
*   **Altijd uitverkoop:** De hele site staat vol met schreeuwerige kortingen en "OP=OP" banners.

**2. Controleer de URL en Beveiliging**
*   **Vreemde domeinnaam:** De URL is vaak een vreemde combinatie van woorden, eindigt op .shop, .xyz, .online, of probeert een bekend merk na te bootsen (bv. \`nike-sale-nederland.com\`).
*   **Geen slotje (HTTPS):** Hoewel veel nepshops tegenwoordig wél een slotje hebben, is het ontbreken ervan een absolute no-go. Een slotje betekent alleen dat de verbinding beveiligd is, niet dat de shop betrouwbaar is.

**3. Bedrijfs- en Contactgegevens**
*   **Geen of vage informatie:** Zoek naar een "Over Ons" en "Contact" pagina. Ontbreken een KvK-nummer, BTW-nummer, fysiek adres en telefoonnummer? Grote rode vlag.
*   **Contact via formulier of Gmail:** De enige contactmogelijkheid is een anoniem formulier of een gratis e-mailadres (bv. \`klantenservice.webshop@gmail.com\`).

**4. Betaalmethoden**
*   **Alleen directe overschrijving:** De enige optie is geld overmaken naar een bankrekening. Er zijn geen veilige, verzekerde opties zoals Creditcard, PayPal of achteraf betalen (Klarna/Afterpay).
*   **Vage betaalpagina:** De betaalpagina ziet er anders uit dan de rest van de site of leidt je naar een onbekende betaalprovider.

**5. Reviews en Sociale Media**
*   **Geen of neppe reviews:** Zoek de naam van de webshop op Google + "reviews" of "ervaringen". Geen resultaten is verdacht. Extreem positieve, algemene reviews zonder details zijn vaak nep.
*   **Dode social media links:** De icoontjes voor Facebook of Instagram op de site werken niet of leiden naar lege profielen.

**Wat te doen als je toch besteld hebt?**
1.  **Neem direct contact op met je bank/creditcardmaatschappij:** Vraag of de betaling gestorneerd kan worden (chargeback).
2.  **Doe aangifte bij de politie:** Verzamel al het bewijs (URL, screenshots, betaalbewijs).
3.  **Meld de website:** Rapporteer de site via de Sentinel AI Investigator en bij de Fraudehelpdesk.
`
    },
    {
        id: 'phishing',
        title: 'Phishing E-mails Herkennen',
        icon: 'EnvelopeIcon',
        description: 'Ontdek de trucs die cybercriminelen gebruiken om u via e-mail op te lichten.',
        content: `
### Hoe Herken Je Een Phishing E-mail?

Phishing is een poging om je persoonlijke gegevens te "hengelen" door je naar een valse website te lokken. Ze doen zich vaak voor als een bekend bedrijf of instantie.

**1. De Afzender**
*   **Vreemd e-mailadres:** Het adres lijkt op dat van een bekend bedrijf, maar is net anders. Kijk goed naar de domeinnaam (alles na de @). \`@rabobank-veilig.nl\` is nep, het moet \`@rabobank.nl\` zijn.
*   **Naam en adres komen niet overeen:** De weergavenaam kan "PostNL" zijn, maar het daadwerkelijke adres is iets als \`xvy123@hotmail.com\`.

**2. De Inhoud en Toon**
*   **Urgentie en dreigementen:** "Uw account wordt geblokkeerd!", "Uw pakket wordt teruggestuurd!", "Laatste kans om uw boete te betalen!". Ze creëren paniek zodat je niet rustig nadenkt.
*   **Slechte taal en grammatica:** Veel phishingmails bevatten spel- en grammaticafouten.
*   **Algemene aanhef:** "Geachte klant" of "Beste gebruiker" in plaats van je eigen naam. Echte bedrijven weten wie je bent.

**3. De Links en Bijlages**
*   **Verdachte links:** Ga met je muis over een link (niet klikken!). De URL die verschijnt is vaak lang, onbegrijpelijk of leidt naar een heel ander domein dan je zou verwachten.
*   **Gevaarlijke bijlages:** Open nooit zomaar bijlages, zeker geen .zip, .exe, of vage Word/PDF-bestanden. Deze kunnen malware bevatten. Banken en overheidsinstanties sturen zelden belangrijke documenten als bijlage.

**4. Het Verzoek**
*   **Inloggen via een link:** Je wordt gevraagd om via een link in te loggen om "gegevens te bevestigen" of "een probleem op te lossen". Log altijd zelf in door naar de officiële website te gaan.
*   **Vragen om persoonlijke codes:** Ze vragen om pincodes, wachtwoorden, of verificatiecodes. **Een echte instantie zal hier NOOIT om vragen.**

**Checklist:**
- [ ] Controleer het e-mailadres van de afzender.
- [ ] Wees alert op een dwingende of alarmerende toon.
- [ ] Ga met je muis over de link om het echte webadres te zien.
- [ ] Klik niet zomaar op links of bijlages.
- [ ] Geef nooit persoonlijke codes of wachtwoorden.

**Twijfel je?** Neem zelf contact op met het bedrijf via de officiële contactgegevens op hun website.
`
    },
    {
        id: 'marktplaats-scams',
        title: 'Marktplaats & WhatsApp Fraude',
        icon: 'ChatBubbleBottomCenterTextIcon',
        description: 'Veilig handelen op online marktplaatsen en veelvoorkomende WhatsApp-trucs.',
        content: `
### Hoe Herken Je Oplichting op Marktplaats en via WhatsApp?

Handelsplatformen zoals Marktplaats en Vinted zijn populair, maar ook een jachtterrein voor oplichters.

**Veelvoorkomende Marktplaats Trucs**

**1. De "Gelijk Oversteken" Vervalstruc**
*   **Hoe het werkt:** De koper stelt voor "Gelijk Oversteken" te gebruiken, maar stuurt een valse link die lijkt op de echte service. Via deze link wordt je naar een nep-betaalpagina geleid om je bankgegevens te stelen.
*   **Hoe te voorkomen:** Gebruik ALLEEN de "Gelijk Oversteken" feature binnen de officiële app of website van Marktplaats zelf. Klik nooit op links van de koper.

**2. De "Even €0,01 Overmaken" Verificatietruc**
*   **Hoe het werkt:** De koper of verkoper vraagt je om 1 cent over te maken om "je identiteit te verifiëren". De link leidt naar een phishingsite die je bankgegevens buitmaakt.
*   **Hoe te voorkomen:** Maak nooit geld over ter verificatie. Gebruik de ingebouwde tools van het platform of spreek af om persoonlijk af te handelen.

**3. Druk om buiten het platform te handelen**
*   **Hoe het werkt:** De tegenpartij wil de communicatie snel verplaatsen naar WhatsApp om buiten de beveiligde omgeving van het platform te handelen.
*   **Hoe te voorkomen:** Houd de communicatie en betaling binnen het platform. Dit biedt meer bescherming als er iets misgaat.

**WhatsApp Fraude (Vriend-in-nood)**

*   **Hoe het werkt:** Je ontvangt een appje van een onbekend nummer. De persoon doet zich voor als je zoon, dochter, of een andere bekende. Ze beweren een nieuw nummer te hebben omdat hun telefoon kapot is en vragen je met spoed geld voor te schieten.
*   **Hoe te voorkomen:**
    *   **Bel!** Vraag de persoon je te bellen of bel het "oude", bekende nummer. Oplichters zullen met smoesjes komen waarom ze niet kunnen bellen.
    *   **Stel een persoonlijke vraag:** Vraag iets wat alleen de echte persoon kan weten (bv. "Wat aten we gisteren?" of "Hoe heet onze kat?").
    *   Maak nooit zomaar geld over op basis van alleen een appje.

**Algemene Tips voor Veilig Handelen**
*   **Check het profiel:** Hoe lang is de gebruiker actief? Heeft hij/zij reviews?
*   **Ophalen is het veiligst:** Spreek indien mogelijk af om het product persoonlijk op te halen en ter plekke te betalen.
*   **Gebruik kopersbescherming:** Maak gebruik van de beschermingsdiensten van platforms zoals PayPal of de ingebouwde services.
*   **Vertrouw je onderbuikgevoel:** Als iets niet goed voelt, doe het dan niet.
`
    },
    {
        id: 'investment-scams',
        title: 'Investerings- & Cryptofraude',
        icon: 'CurrencyDollarIcon',
        description: 'Herken de valse beloftes van snel rijk worden met crypto en andere investeringen.',
        content: `
### Hoe Herken Je Investeringsfraude?

Investeringsfraude lokt slachtoffers met de belofte van hoge rendementen met weinig risico. Vooral in de wereld van cryptocurrency is dit een groot probleem.

**1. Onrealistische Rendementen**
*   **Gegarandeerd hoog rendement:** De oplichter belooft wekelijkse of maandelijkse winsten die veel hoger zijn dan de marktstandaard (bv. "10% winst per week, gegarandeerd!"). Echte investeringen hebben altijd risico's en geen garanties.
*   **"Verdubbel je crypto":** Veel scams vragen je om een klein bedrag aan crypto te sturen, met de belofte dat je het dubbele terugkrijgt. Dit gebeurt nooit.

**2. Druk en Exclusiviteit**
*   **Tijdsdruk:** "Deze kans is alleen vandaag beschikbaar!" Ze geven je geen tijd om onderzoek te doen.
*   **Exclusieve groep:** Je wordt uitgenodigd voor een "geheime" Telegram- of WhatsApp-groep waar zogenaamd winstgevende tips worden gedeeld. Vaak is dit bedoeld om je te overtuigen te investeren in een nep-platform.

**3. Vage en Onprofessionele Platforms**
*   **Geen officiële registratie:** Het platform is niet geregistreerd bij financiële toezichthouders zoals de AFM (Autoriteit Financiële Markten) in Nederland.
*   **Anoniem team:** Het is onduidelijk wie er achter het bedrijf zit. De website heeft geen informatie over het team of gebruikt stockfoto's.
*   **Vragen om je wallet keys:** Een legitieme exchange of broker zal NOOIT om je private keys of de herstelzin (seed phrase) van je crypto wallet vragen. Geef deze aan niemand!

**4. Social Media en Influencers**
*   **Neppe advertenties:** Je ziet advertenties op Facebook, Instagram of YouTube met bekende personen (zoals Elon Musk of Nederlandse beroemdheden) die een investeringsplatform aanprijzen. Deze beelden zijn vaak gestolen of gemanipuleerd (deepfakes).
*   **"Get-rich-quick" goeroes:** Influencers die een luxueuze levensstijl tonen en beweren dat dit allemaal te danken is aan een bepaald platform. Vaak krijgen ze betaald om volgers naar een scam te lokken.

**5. Problemen bij opnemen van geld**
*   **Eerst 'belasting' betalen:** Als je je "winst" wilt opnemen, moet je eerst een percentage aan belasting, administratie- of transactiekosten betalen. Dit is een truc om nog meer geld van je te stelen.
*   **Account geblokkeerd:** Zodra je probeert geld op te nemen, wordt je account plotseling geblokkeerd of verdwijnt het platform van de aardbodem.

**Hoe Blijf Je Veilig?**
*   **Onderzoek:** Doe altijd je eigen onderzoek (DYOR - Do Your Own Research). Gebruik alleen bekende, gereguleerde exchanges en brokers.
*   **Geloof niet in gratis geld:** Als het te mooi klinkt om waar te zijn, is dat het ook.
*   **Houd je private keys geheim:** Deel je wallet-informatie met niemand.
`
    }
];
