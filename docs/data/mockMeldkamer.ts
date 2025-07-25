

import { MeldkamerReport } from '../types';

export const mockReports: MeldkamerReport[] = [
    {
        id: '1',
        domain: 'niftystore.uk',
        scamType: 'Product niet geleverd',
        date: '20 Jul 2024',
        reportCount: 23,
        status: 'Active',
        location: { lat: 51.5072, lon: -0.1276, country: 'GB' },
        associatedIPs: ['104.21.29.89', '172.67.170.207'],
        knownAliases: ['swiftrends.com', 'dailydealz.shop'],
        firstSeen: '01 Jun 2024',
        threatLevel: 'High',
        aiSummary: 'Dit domein wordt herhaaldelijk gemeld voor het niet leveren van goederen na betaling. Het gebruikt Cloudflare om de host te verbergen en roteert IP-adressen. De webshop heeft geen legitieme bedrijfsgegevens.',
        relatedReports: [{id: '9', domain: 'limited-sneaker-drop.net', scamType: 'Product niet geleverd'}]
    },
    {
        id: '2',
        domain: 'parcel-tracking-update.com',
        scamType: 'Phishing (pakketdienst)',
        date: '19 Jul 2024',
        reportCount: 152,
        status: 'Active',
        location: { lat: 34.0522, lon: -118.2437, country: 'US' },
        associatedIPs: ['199.59.243.222'],
        knownAliases: ['dhl-newstatus.net', 'postnl-je-pakket.info'],
        firstSeen: '15 Jul 2024',
        threatLevel: 'Critical',
        aiSummary: 'Een grootschalige phishing-operatie die zich voordoet als diverse pakketdiensten. De site probeert creditcardgegevens en persoonlijke informatie te stelen onder het mom van "invoerkosten". Zeer hoog aantal meldingen in korte tijd.',
        relatedReports: []
    },
    {
        id: '3',
        domain: 'crypto-invest-bonanza.io',
        scamType: 'Investeringsfraude',
        date: '15 Jul 2024',
        reportCount: 7,
        status: 'Under Investigation',
        location: { lat: 4.8897, lon: 114.9424, country: 'BN' }, // Brunei
        associatedIPs: ['103.149.236.12'],
        knownAliases: ['getrichfast.xyz'],
        firstSeen: '02 May 2024',
        threatLevel: 'High',
        aiSummary: 'Beloftes van onrealistische rendementen op crypto-investeringen. Slachtoffers wordt gevraagd geld over te maken naar een wallet, waarna de "winst" nooit kan worden opgenomen. Er wordt extra geld gevraagd voor "belastingen" om de winst vrij te geven.',
        relatedReports: [{id: '8', domain: 'getrichfast.xyz', scamType: 'Investeringsfraude'}]
    },
    {
        id: '4',
        domain: 'authentiekbankieren.info',
        scamType: 'Bankhelpdeskfraude',
        date: '12 Jul 2024',
        reportCount: 45,
        status: 'Active',
        location: { lat: 52.3676, lon: 4.9041, country: 'NL' },
        associatedIPs: ['89.105.215.48'],
        knownAliases: ['uw-bank.online-verificatie.org'],
        firstSeen: '20 Jun 2024',
        threatLevel: 'Critical',
        aiSummary: 'Deze site is een exacte kopie van een legitieme bankloginpagina. Slachtoffers worden via SMS-phishing naar de site geleid om "hun rekening te verifiëren", waardoor de oplichters direct toegang krijgen.',
        relatedReports: [{id: '10', domain: 'uw-bank.online-verificatie.org', scamType: 'Bankhelpdeskfraude'}]
    },
    {
        id: '5',
        domain: 'uwbelastingvoordeel.nl',
        scamType: 'Phishing (overheid)',
        date: '05 Jul 2024',
        reportCount: 89,
        status: 'Resolved',
        location: { lat: 50.8503, lon: 4.3517, country: 'BE' },
        associatedIPs: ['-'],
        knownAliases: [],
        firstSeen: '01 Jul 2024',
        threatLevel: 'High',
        aiSummary: 'Deze site, die zich voordeed als de Belastingdienst, is offline gehaald na samenwerking met de hoster. Het probeerde DigiD-gegevens te stelen. De zaak is gesloten.',
        relatedReports: []
    },
     {
        id: '6',
        domain: 'techdealz-outlet.shop',
        scamType: 'Fake webshop',
        date: '21 Jul 2024',
        reportCount: 11,
        status: 'Active',
        location: { lat: 22.3193, lon: 114.1694, country: 'HK' },
        associatedIPs: ['47.245.31.226'],
        knownAliases: [],
        firstSeen: '18 Jul 2024',
        threatLevel: 'High',
        aiSummary: 'Een recent opgezette webshop met onrealistische kortingen op elektronica. Betalingen gaan via directe bankoverschrijving naar een buitenlandse rekening. Geen contactgegevens.',
        relatedReports: []
    },
     {
        id: '7',
        domain: 'marktplaats-betaalverzoek.co',
        scamType: 'Marktplaats oplichting',
        date: '18 Jul 2024',
        reportCount: 34,
        status: 'Active',
        location: { lat: 52.3676, lon: 4.9041, country: 'NL' },
        associatedIPs: ['185.107.56.205'],
        knownAliases: [],
        firstSeen: '10 Jul 2024',
        threatLevel: 'High',
        aiSummary: 'Oplichters op Marktplaats sturen een link naar deze site onder het mom van een "gelijk oversteken" betaalverzoek. De site is een phishingpagina die bankgegevens steelt.',
        relatedReports: []
    },
     {
        id: '8',
        domain: 'getrichfast.xyz',
        scamType: 'Investeringsfraude',
        date: '10 Jul 2024',
        reportCount: 5,
        status: 'Under Investigation',
        location: { lat: 1.3521, lon: 103.8198, country: 'SG' },
        associatedIPs: ['103.149.236.12'],
        knownAliases: ['crypto-invest-bonanza.io'],
        firstSeen: '01 Jun 2024',
        threatLevel: 'High',
        aiSummary: 'Dit domein wordt gebruikt in advertenties op social media en promoot nep-investeringsapps. Het is gelinkt aan andere frauduleuze crypto-operaties.',
        relatedReports: [{id: '3', domain: 'crypto-invest-bonanza.io', scamType: 'Investeringsfraude'}]
    },
    {
        id: '9',
        domain: 'limited-sneaker-drop.net',
        scamType: 'Product niet geleverd',
        date: '08 Jul 2024',
        reportCount: 18,
        status: 'Active',
        location: { lat: 35.6895, lon: 139.6917, country: 'JP' },
        associatedIPs: ['157.7.197.43'],
        knownAliases: ['niftystore.uk'],
        firstSeen: '15 Jun 2024',
        threatLevel: 'Medium',
        aiSummary: 'Webshop gespecialiseerd in gelimiteerde sneakers. De site is een kopie van een legitieme winkel, maar prijzen zijn iets lager. Klanten ontvangen na betaling niets.',
        relatedReports: [{id: '1', domain: 'niftystore.uk', scamType: 'Product niet geleverd'}]
    },
    {
        id: '10',
        domain: 'uw-bank.online-verificatie.org',
        scamType: 'Bankhelpdeskfraude',
        date: '02 Jul 2024',
        reportCount: 112,
        status: 'Resolved',
        location: { lat: 59.9139, lon: 10.7522, country: 'NO' },
        associatedIPs: ['-'],
        knownAliases: ['authentiekbankieren.info'],
        firstSeen: '15 May 2024',
        threatLevel: 'Critical',
        aiSummary: 'Een zeer effectieve phishing-site die nu offline is. Het wist in korte tijd veel slachtoffers te maken. Gelinkt aan een professionele criminele organisatie.',
        relatedReports: [{id: '4', domain: 'authentiekbankieren.info', scamType: 'Bankhelpdeskfraude'}]
    },
];