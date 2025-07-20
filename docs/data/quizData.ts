import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
    {
        question: "U ontvangt een e-mail van 'ABN AMRO' met als onderwerp 'BELANGRIJK: Uw account is beperkt'. De e-mail vraagt u op een link te klikken om uw identiteit te verifiëren. Wat is het grootste rode vlag?",
        options: [
            "Het onderwerp is in hoofdletters geschreven.",
            "De e-mail creëert een gevoel van urgentie en dreiging.",
            "De bank stuurt u een e-mail.",
            "De e-mail heeft een logo van de bank."
        ],
        correctOptionIndex: 1,
        explanation: "Oplichters gebruiken urgentie ('Uw account wordt geblokkeerd!') om u in paniek te laten handelen zonder na te denken. Banken zullen dit zelden op deze manier doen. Klik nooit op de link, maar log zelf in via de officiële website of app."
    },
    {
        question: "U ziet een advertentie voor een nieuwe PlayStation 5 voor €250, terwijl deze overal anders minstens €500 kost. De webshop ziet er goed uit. Wat zou u als eerste moeten controleren?",
        options: [
            "Of de website wel een .nl domein heeft.",
            "Of ze wel gratis verzending aanbieden.",
            "De betaalmethoden en of er bedrijfsgegevens (KvK, adres) op de site staan.",
            "Hoeveel volgers ze op Instagram hebben."
        ],
        correctOptionIndex: 2,
        explanation: "Een extreem lage prijs is een enorme rode vlag. Legitieme webshops hebben altijd duidelijke contact- en bedrijfsgegevens en bieden veilige, verzekerde betaalmethoden aan zoals iDEAL, creditcard of PayPal. Als alleen 'bankoverschrijving' een optie is, is het bijna zeker een scam."
    },
    {
        question: "U krijgt een WhatsApp-bericht van een onbekend nummer: 'Hoi mam, mijn telefoon is in de wc gevallen. Dit is mijn tijdelijke nummer. Kun je een rekening voor me betalen?'. Wat is de veiligste actie?",
        options: [
            "Het geld overmaken, uw kind zit in de problemen.",
            "Terug-appen en vragen welke rekening het is.",
            "Direct het 'oude', bekende nummer van uw kind bellen om het verhaal te verifiëren.",
            "Het nieuwe nummer opslaan en wachten tot uw kind weer contact opneemt."
        ],
        correctOptionIndex: 2,
        explanation: "Dit is een klassieke 'vriend-in-nood' scam. De veiligste methode is altijd om via een andere weg contact te zoeken. Bel het nummer dat u al had, of stel een persoonlijke vraag die alleen uw echte kind kan weten."
    },
    {
        question: "Een website vraagt u om in te loggen met uw DigiD om uw 'belastingteruggave te claimen'. De URL is 'mijn-overheid.info'. Is dit veilig?",
        options: [
            "Ja, want de site heeft het over Mijn Overheid.",
            "Ja, zolang er een slotje (HTTPS) in de adresbalk staat.",
            "Nee, de officiële URL's van de overheid eindigen nooit op .info en je moet nooit via een link inloggen.",
            "Misschien, ik moet eerst mijn BSN-nummer invullen om te checken."
        ],
        correctOptionIndex: 2,
        explanation: "De URL is de belangrijkste weggever. Officiële Nederlandse overheidswebsites eindigen op .nl (zoals mijn.overheid.nl of belastingdienst.nl). Een slotje zegt alleen iets over de verbinding, niet over de betrouwbaarheid van de site zelf."
    }
];