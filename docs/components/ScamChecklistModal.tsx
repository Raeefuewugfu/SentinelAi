

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { XCircleIcon } from './icons';

interface ScamChecklistModalProps {
  onClose: () => void;
}

const scamChecklistContent = `
### 🔎 Gedrag & Communicatie
*   **Druk zetten / Tijdslimiet**: Je wordt onder druk gezet om "nu meteen" iets te doen, vaak met een deadline (“Nog 10 minuten geldig!”).
*   **Te mooi om waar te zijn**: Als iets té goed klinkt (zoals snel rijk worden, gratis geld, of gigantische kortingen), dan is het meestal niet echt.
*   **Ongevraagd contact**: Iemand neemt uit het niets contact met je op via e-mail, telefoon of DM met een aanbieding of verzoek.
*   **Vreemde taal of grammatica**: Veel scams hebben kromme zinnen, spelfouten of zijn vertaald met een slechte vertaalmachine.
*   **Vage of ontwijkende antwoorden**: Als je kritische vragen stelt en je krijgt geen duidelijke antwoorden, is dat verdacht.
*   **Emotionele manipulatie**: Ze gebruiken angst ("Je account wordt verwijderd!") of medelijden ("Help dit zieke kind!") om je onder druk te zetten.
*   **Zogenaamd autoriteitspersonen**: Ze doen zich voor als politie, banken, overheidsinstanties of grote bedrijven.

### 🌐 Online Gedrag & Websites
*   **Onbetrouwbare URL’s**: De website lijkt op een echte (zoals “www.ing-bankveilig.net” in plaats van “www.ing.nl”).
*   **Geen HTTPS-beveiliging**: Serieuze websites gebruiken altijd een slotje/https in de adresbalk.
*   **Geen contactgegevens of bedrijfsinfo**: Je vindt geen fysiek adres, KvK-nummer, of echte klantenservice.
*   **Nepreviews of geen reviews**: Reviews zijn overduidelijk nep of allemaal overdreven positief (vaak met stockfoto’s of vage namen).
*   **Geen retourbeleid of algemene voorwaarden**: Een legitiem bedrijf heeft altijd juridische documenten beschikbaar op de site.
*   **Vraag om gevoelige gegevens**: Ze vragen om je BSN, wachtwoorden, pincodes of volledige bankgegevens via e-mail of chat.

### 💸 Betalingen en Geldzaken
*   **Vreemde betaalmethodes**: Ze willen betaald worden via crypto, cadeaukaarten, Western Union of obscure methodes.
*   **Je moet betalen om iets te winnen**: Echte loterijen of prijzen vereisen geen betaling om je “prijs” op te halen.
*   **Fake facturen of aanmaningen**: Je krijgt een factuur voor iets wat je nooit hebt besteld.
*   **Geld terug vragen? Alleen via rare stappen**: Bijvoorbeeld eerst iets kopen voordat je je geld “terugkrijgt”.

### 👤 Persoonsinformatie & Identiteit
*   **Neppe profielen op social media**: Profielen met weinig volgers, stockfoto's, vage bio’s of recente aanmaakdatum.
*   **Neppe vacatures / banen**: Ze beloven een baan, maar je moet eerst “investeren” in software of training.
*   **Vragen om verificatie via je account of telefoon**: Ze sturen codes naar je telefoon of e-mail en vragen die om zogenaamd iets te bevestigen – in werkelijkheid kapen ze je account.

### ✅ Bonus Tips
*   Google het altijd. Zoek op “[bedrijf/website] + scam” of “[naam persoon] + review”.
*   Check op ScamAdviser of Trustpilot hoe betrouwbaar iets is.
*   Gebruik je gezonde verstand. Als je twijfelt, doe het niet.
`;

const ScamChecklistModal: React.FC<ScamChecklistModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-surface-1 w-full h-full sm:rounded-2xl sm:shadow-2xl sm:border sm:border-surface-2 sm:max-w-3xl sm:h-[80vh] flex flex-col m-0 sm:m-4 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-surface-2 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-text-primary">Een Scam Herkennen: De Checklist</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-accent transition-colors">
            <XCircleIcon className="w-7 h-7" />
          </button>
        </header>
        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
          <div className="prose prose-sm md:prose-base max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:font-semibold prose-headings:text-text-primary prose-strong:text-text-primary prose-a:text-accent">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{scamChecklistContent}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScamChecklistModal;