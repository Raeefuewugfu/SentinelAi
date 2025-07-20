
import { GoogleGenAI, GenerateContentResponse, Type, Content } from "@google/genai";
import { ClaimData, ClaimGenerationResult, AnalysisType, PremiumAnalysisReport, HelpMessage, ClaimDocuments } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrlForScamsStream = async (url: string, isGrandpaMode: boolean): Promise<AsyncGenerator<GenerateContentResponse>> => {
  const grandpaInstruction = isGrandpaMode
    ? `\nIMPORTANT: You MUST explain everything in very simple, non-technical terms, as if talking to a complete beginner (like a grandpa). Use simple analogies and avoid all technical jargon.`
    : '';

  const systemInstruction = `
    You are "Sentinel," a world-class cybersecurity analysis AI agent. Your purpose is to conduct deep, exhaustive investigations of website URLs to protect users from scams, fraud, and malicious activities. You operate within a chat interface and must communicate your actions and findings clearly and sequentially.${grandpaInstruction}
  `;

  const prompt = `
    A user has requested an investigation of the URL: ${url}

    You must conduct the investigation step-by-step. For each step, you must stream your process using a specific format. After all steps are complete, you will stream the final JSON report.

    **STEP-BY-STEP STREAMING FORMAT:**
    For each step of your investigation, you MUST stream a block of text starting with "§STEP_START§", followed by a single-line JSON object, and ending with "§STEP_END§". You must then stream your detailed findings for that step in Markdown format immediately after the block.

    The JSON object for a step MUST have these keys:
    - "tool": A short name for the tool/action. YOU MUST choose one name from this exact list: ["WHOIS Lookup", "DNS Record Scan", "SSL Certificate Validation", "Technology Stack ID", "Corporate Background Check", "Malware & Phishing Scan", "Public Breach Check", "Social Media Scan", "Historical Archive Scan", "Web Search Simulation", "Content & Policy Scan", "Synthesizing Findings"]
    - "icon": The name of an icon to represent the tool. Choose from: GlobeAltIcon, ServerIcon, LockClosedIcon, CodeBracketIcon, BuildingOfficeIcon, BugAntIcon, ArchiveBoxIcon, UsersIcon, MagnifyingGlassIcon, DocumentTextIcon, ShieldCheckIcon.
    - "thought": A brief, user-facing sentence describing what you are currently doing. (e.g., "Checking domain registration details...")

    Example of a single step's stream output:
    §STEP_START§
    {"tool": "WHOIS Lookup", "icon": "GlobeAltIcon", "thought": "Checking domain registration details and ownership privacy."}
    §STEP_END§
    *   **Registrar:** Found NameCheap, Inc. (simulated).
    *   **Privacy:** Registrant contact is redacted using a privacy service.
    *   **Domain Age:** Domain is less than 2 years old, which warrants caution.

    **FINAL REPORT STREAMING FORMAT:**
    After all investigation steps are complete and streamed, you MUST stream the final report. The report is a single JSON object enclosed between §REPORT_START§ and §REPORT_END§ tags.

    The final report JSON object must have these keys: "safetyScore", "summary", "domainAnalysis", "contentAnalysis", "policyAnalysis", "corporateAnalysis", "recommendation".

    Example of the final report stream output:
    §REPORT_START§
    {
      "safetyScore": 35,
      "summary": "This site exhibits multiple red flags...",
      "domainAnalysis": "The domain is young and uses privacy services...",
      "contentAnalysis": "The content uses high-pressure sales tactics...",
      "policyAnalysis": "The return policy is predatory...",
      "corporateAnalysis": "The parent company is linked to known scams...",
      "recommendation": "Avoid this Site"
    }
    §REPORT_END§

    There must be no text after the final §REPORT_END§ tag.
    Begin the investigation now. Stream your first step.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response;
  } catch (error) {
    console.error("Error analyzing URL with Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error('The analysis was blocked due to safety concerns with the input or output. Please try a different URL.');
    }
    throw new Error('Failed to get a valid analysis from the AI. Please try again.');
  }
};

export const analyzeFileForMalwareStream = async (fileName: string, mimeType: string, fileDataB64: string, isGrandpaMode: boolean): Promise<AsyncGenerator<GenerateContentResponse>> => {
    const grandpaInstruction = isGrandpaMode
      ? `\nIMPORTANT: You MUST explain everything in very simple, non-technical terms, as if talking to a complete beginner (like a grandpa). Use simple analogies and avoid all technical jargon.`
      : '';
      
    const systemInstruction = `
        You are "Sentinel," a world-class cybersecurity analysis AI agent. Your purpose is to conduct deep, exhaustive investigations of files to protect users from malware, viruses, and malicious code. You are an expert in reverse-engineering, code analysis, and digital forensics. You operate within a chat interface and must communicate your actions and findings clearly and sequentially.${grandpaInstruction}
    `;

    const textPart = { text: `
        A user has uploaded a file for investigation:
        - File Name: ${fileName}
        - Mime Type: ${mimeType}

        You must conduct the investigation step-by-step. For each step, you must stream your process using a specific format. After all steps are complete, you will stream the final JSON report.

        **SPECIAL INSTRUCTIONS FOR THIS INVESTIGATION:**
        1.  **Code Analysis:** If the file contains code (e.g., JS, HTML, scripts inside PDFs), you MUST analyze it for malicious patterns, obfuscation, and unauthorized backend communication.
        2.  **Evidence Extraction:** You MUST perform forensic analysis to find and extract any embedded images that could serve as evidence of scams (e.g., screenshots of chat messages, tables of financial data, fake invoices). If found, you MUST include them in the final report.

        **STEP-BY-STEP STREAMING FORMAT:**
        For each step of your investigation, you MUST stream a block of text starting with "§STEP_START§", followed by a single-line JSON object, and ending with "§STEP_END§". You must then stream your detailed findings for that step in Markdown format immediately after the block.

        The JSON object for a step MUST have these keys:
        - "tool": A short name for the tool/action. YOU MUST choose one name from this exact list: ["File Metadata Extraction", "Static Signature Scan", "Heuristic Code Analysis", "Frontend Code Review", "Backend Access Scan", "Behavioral Sandbox Simulation", "Dependency Vulnerability Check", "Evidence Extraction", "Synthesizing Findings"]
        - "icon": The name of an icon to represent the tool. Choose from: FingerprintIcon, BugAntIcon, CodeBracketIcon, ServerIcon, BeakerIcon, ArchiveBoxIcon, MagnifyingGlassIcon, ShieldCheckIcon.
        - "thought": A brief, user-facing sentence describing what you are currently doing. (e.g., "Extracting file metadata and hash...")

        Example of a single step's stream output:
        §STEP_START§
        {"tool": "Frontend Code Review", "icon": "CodeBracketIcon", "thought": "Scanning frontend code for vulnerabilities."}
        §STEP_END§
        *   **Suspicious Functions:** Found a function \`eval(atob(data))\`, which is highly suspicious and often used to hide malicious code.
        *   **Network Requests:** The code attempts to send data to an external domain 'evil-tracker.net'.
        *   **Conclusion:** The code contains dangerous patterns.

        **FINAL REPORT STREAMING FORMAT:**
        After all investigation steps are complete and streamed, you MUST stream the final report. The report is a single JSON object enclosed between §REPORT_START§ and §REPORT_END§ tags.

        The final report JSON object must have these keys: "safetyScore", "summary", "staticAnalysis", "behavioralAnalysis", "dependencyAnalysis", "originAnalysis", "recommendation", and optionally "frontendCodeAnalysis", "backendAccessAnalysis", and "evidence".

        - The "evidence" key MUST be an array of objects. Each object MUST contain:
            - "description": A string describing the evidence.
            - "base64Image": A string containing the full data URL of the extracted image (e.g., "data:image/png;base64,iVBORw0KGgo...").

        Example of the final report stream output:
        §REPORT_START§
        {
          "safetyScore": 15,
          "summary": "The file is highly malicious. It contains obfuscated code designed to steal information and evidence of fraudulent activity was found within.",
          "staticAnalysis": "File hash matches a known malware variant. Metadata appears forged.",
          "behavioralAnalysis": "Simulated execution reveals attempts to contact a command-and-control server and exfiltrate local files.",
          "dependencyAnalysis": "No external dependencies, the malware is self-contained.",
          "originAnalysis": "The file is not digitally signed.",
          "frontendCodeAnalysis": "The embedded JavaScript uses multiple layers of obfuscation to hide its true purpose, which is to capture user keystrokes.",
          "backendAccessAnalysis": "The code makes unauthorized POST requests to 'http://malicious-server.com/collector' to send stolen data.",
          "recommendation": "Avoid this Site",
          "evidence": [
            {
              "description": "A screenshot of a chat demanding a crypto payment.",
              "base64Image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            }
          ]
        }
        §REPORT_END§

        There must be no text after the final §REPORT_END§ tag.
        Begin the investigation now. Stream your first step.
    `};

    const filePart = {
        inlineData: {
            mimeType: mimeType,
            data: fileDataB64,
        },
    };

    try {
        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, filePart] },
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response;
    } catch (error) {
        console.error("Error analyzing file with Gemini API:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error('The analysis was blocked due to safety concerns with the file content. The file might be malicious.');
        }
        throw new Error('Failed to get a valid analysis from the AI. Please try again.');
    }
};

export const performPremiumAnalysisStream = async (analysisType: AnalysisType, subject: string, isGrandpaMode: boolean): Promise<AsyncGenerator<GenerateContentResponse>> => {
  const grandpaInstruction = isGrandpaMode
    ? `\nIMPORTANT: You MUST explain everything in very simple, non-technical terms, as if talking to a complete beginner (like a grandpa). Use simple analogies and avoid all technical jargon.`
    : '';

  const systemInstruction = `
    You are "Sentinel Prime," an advanced AI investigator providing a premium, in-depth analysis service. You are meticulous, thorough, and your goal is to deliver a comprehensive, actionable intelligence report. You communicate your process clearly and sequentially before delivering the final, structured report.${grandpaInstruction}
  `;

  const prompt = `
    A user has initiated a PREMIUM AI-SCAN for the following target:
    - Scan Type: ${analysisType}
    - Target: ${subject}

    You must conduct the investigation step-by-step, streaming your progress. After all steps are complete, you will stream the final, detailed JSON report.

    **STEP-BY-STEP STREAMING FORMAT:**
    For each step of your premium investigation, you MUST stream a block of text starting with "§STEP_START§", followed by a single-line JSON object, and ending with "§STEP_END§".

    The JSON object for a step MUST have these keys:
    - "tool": A short name for the tool/action. Choose from: ["Initiating Deep Scan", "Reputation Cross-Check", "Historical WHOIS Lookup", "IP & ASN Analysis", "Content & Language Analysis", "Synthesizing Findings"]
    - "icon": Choose from: SparklesIcon, ShieldCheckIcon, MagnifyingGlassIcon, ServerIcon, CodeBracketIcon, GlobeAltIcon.
    - "thought": A brief, user-facing sentence describing what you are currently doing. (e.g., "Cross-referencing target with multiple scam databases...")

    Example of a single step's stream output:
    §STEP_START§
    {"tool": "Reputation Cross-Check", "icon": "ShieldCheckIcon", "thought": "Cross-referencing target with PhishTank, AbuseIPDB, and internal databases."}
    §STEP_END§
    *   **PhishTank:** No direct matches found.
    *   **AbuseIPDB:** The host IP has 3 reports for spamming.
    *   **Internal DB:** Domain pattern matches 2 previous scam reports.

    **FINAL REPORT STREAMING FORMAT:**
    After all investigation steps are complete, you MUST stream the final report. The report is a single, large JSON object enclosed between §PREMIUM_REPORT_START§ and §PREMIUM_REPORT_END§ tags. **There must be no text after the final §PREMIUM_REPORT_END§ tag.**

    The final report JSON object MUST have this exact structure:
    {
      "riskScore": number, // 0-100
      "recommendationColor": "Green" | "Orange" | "Red",
      "aiSummary": "string", // AI-generated summary in markdown
      "reputationCheck": { "title": "Reputatie & Database Check", "details": "string" }, // Markdown details
      "domainInfo": { "title": "Domein & WHOIS Analyse", "details": "string" }, // Markdown details
      "ipInfo": { "title": "IP & Hosting Analyse", "details": "string" }, // Markdown details
      "contentAnalysis": { "title": "Inhoud & Taal Analyse", "details": "string" } // Markdown details
    }

    **Analysis Guidelines:**
    - **riskScore:** Base this on all factors. New domains, privacy services, reports in databases, and urgent language should significantly increase the score.
    - **recommendationColor:** 0-39 = Red, 40-69 = Orange, 70-100 = Green. This is a RISK score. High score = high risk.
    - **aiSummary:** Provide a clear, concise summary and a final recommendation (e.g., "Aanbeveling: **Niet gebruiken.**").
    - **Details:** For each section, provide detailed, bulleted findings in Markdown format. Be specific (e.g., "Domein is 12 dagen oud", "Gehost in Rusland (ongebruikelijk)", "Urgentietaal gevonden: 'Betaal binnen 15 minuten'"). Synthesize information from simulated tools like WHOIS, PhishTank, AbuseIPDB, IPinfo, and AI content analysis.

    Begin the premium investigation now.
  `;
  
   try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response;
  } catch (error) {
    console.error("Error performing premium analysis with Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error('The analysis was blocked due to safety concerns with the input or output. Please try a different target.');
    }
    throw new Error('Failed to get a valid premium analysis from the AI. Please try again.');
  }
};


const documentSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Titel van het document in het Nederlands." },
        body: { type: Type.STRING, description: "Volledige tekst van het document in het Nederlands, opgesteld als een formele brief met placeholders zoals [JOUW NAAM] en [BEDRAG]." },
        nextSteps: { type: Type.STRING, description: "Concrete, duidelijke volgende stappen voor de gebruiker in het Nederlands, opgemaakt in Markdown." }
    },
    required: ["title", "body", "nextSteps"]
};

const claimGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    assessment: {
        type: Type.OBJECT,
        properties: {
            scamChancePercentage: { type: Type.INTEGER, description: "Een schatting (0-100) van de waarschijnlijkheid dat dit een scam is, gebaseerd op de input." },
            summary: { type: Type.STRING, description: "Een korte samenvatting in het Nederlands van de analyse en de redenering achter de scam-kans. Wees specifiek en direct." }
        },
        required: ["scamChancePercentage", "summary"]
    },
    documents: {
        type: Type.OBJECT,
        properties: {
            chargebackRequest: documentSchema,
            officialComplaint: documentSchema,
            policeReport: documentSchema,
        },
        required: ["chargebackRequest", "officialComplaint", "policeReport"],
    },
    preventionTips: {
        type: Type.STRING,
        description: "Een set van 3-4 concrete, gepersonaliseerde preventietips in Markdown-formaat. De tips moeten direct gerelateerd zijn aan het scenario van de gebruiker en hem/haar helpen om vergelijkbare oplichting in de toekomst te herkennen en te voorkomen."
    }
  },
  required: ["assessment", "documents", "preventionTips"],
};


export const generateClaimDocuments = async (claimData: ClaimData): Promise<ClaimGenerationResult> => {
  const systemInstruction = `Je bent 'Sentinel Juridische Assistent', een AI-expert in consumentenbescherming en het terugvorderen van geld na online oplichting. Jouw taak is om gedupeerde gebruikers te helpen door heldere, professionele en effectieve documenten in het NEDERLANDS te genereren. Toon empathie, maar behoud een formele en gezaghebbende toon in de documenten. Je output MOET een enkel, geldig JSON-object zijn dat voldoet aan het opgegeven schema, zonder extra tekst of uitleg voor of na het JSON-blok. Pas het advies en de inhoud, met name de 'nextSteps', aan op basis van de gebruikte betaalmethode en het scenario. Gebruik in de body van de brieven placeholders zoals [JOUW NAAM], [BEDRAG], [DATUM], etc. waar de gebruiker zelf de info kan invullen.`;

  const prompt = `
    Een gebruiker is slachtoffer geworden van online oplichting. Genereer een AI-analyse, een set documenten en preventietips op basis van de volgende details.

    **Incident Details:**
    - **Scenario:** ${claimData.scenario}
    - **Naam slachtoffer:** ${claimData.fullName}
    - **E-mail slachtoffer:** ${claimData.email}
    - **Land slachtoffer:** ${claimData.country}
    - **Info oplichter (URL/Naam):** ${claimData.scammerInfo}
    - **Contactmethode oplichter:** ${claimData.scammerContactMethod}
    - **Verloren bedrag:** ${claimData.amount} ${claimData.currency}
    - **Datum incident:** ${claimData.incidentDate}
    - **Betaalmethode:** ${claimData.paymentMethod}
    - **Beschrijving van incident:** ${claimData.description}
    - **Aangeleverd bewijs:** De gebruiker heeft ${claimData.evidence.length} bestand(en) als bewijs aangeleverd (bijv. screenshots, bonnen). Verwijs hiernaar in de documenten als 'het aangeleverde bewijs'.

    **Instructies:**
    1.  **Analyseer het geval:** Geef op basis van alle gegevens een 'scamChancePercentage' en een korte, duidelijke 'summary'. Wees realistisch. Als er rode vlaggen zijn (crypto, vage website, hoge druk), moet de kans hoger zijn.
    2.  **Genereer de documenten:** Maak de objecten 'chargebackRequest', 'officialComplaint' en 'policeReport' aan. Zorg dat de inhoud van elk document specifiek en juridisch correct is voor het Nederlandse/Europese consumentenrecht.
        - De **chargebackRequest** moet zich richten op de bank of betaalprovider.
        - De **officialComplaint** moet gericht zijn aan de (vermoedelijke) oplichter.
        - Het **policeReport** moet een gestructureerd verslag zijn voor de politie.
        - De **nextSteps** moeten praktisch en direct uitvoerbaar zijn voor de gebruiker. Maak ze specifiek voor de betaalmethode (bv. voor Creditcard: "Neem direct contact op met de fraudeafdeling van uw creditcardmaatschappij.").
    3.  **Genereer Preventie Tips:** Maak een 'preventionTips' veld aan. Geef 3 tot 4 concrete, gepersonaliseerde tips in Markdown die de gebruiker helpen dit type scam in de toekomst te voorkomen. Baseer de tips op het 'scenario' en de 'contactmethode'. Bijvoorbeeld, als het een 'Product niet ontvangen' scam was via een 'Website', geef dan tips over het controleren van webshops (keurmerken, contactgegevens, etc.).
    4.  **Speciaal Advies (Indien relevant):** Als het land van de gebruiker binnen de EU is (zoals Nederland, België, etc.) en het bedrag is onder de 5000 EUR, voeg dan in de 'nextSteps' van de 'officialComplaint' een paragraaf toe over de **Europese procedure voor geringe vorderingen (Small Claims Procedure)** als een mogelijke vervolgstap als de klacht wordt genegeerd. Leg kort uit dat dit een laagdrempelige manier is om over de grens je recht te halen.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: claimGenerationSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as ClaimGenerationResult;
    return result;

  } catch(error) {
     console.error("Error generating claim documents with Gemini API:", error);
     if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error('Het genereren van de claim is geblokkeerd vanwege veiligheidsrisico\'s in de invoer. Pas de inhoud aan.');
    }
    throw new Error('Kon geen documenten genereren van de AI. Probeer het opnieuw.');
  }
};

export const getHelpdeskResponseStream = async (chatHistory: HelpMessage[]): Promise<AsyncGenerator<GenerateContentResponse>> => {
    const systemInstruction = `You are "Sentinel Helper", a friendly and knowledgeable AI assistant for the Sentinel AI platform. Your role is to help users with their questions about online safety, how to use the Sentinel platform, and what to do if they've been scammed.

    **Your capabilities:**
    - Explain features of the Sentinel platform (AI Investigator, Meldkamer, Kennisbank, Claim Wizard).
    - Provide general cybersecurity advice (e.g., how to recognize phishing, secure passwords).
    - Answer questions based on the Kennisbank articles.
    - Guide users on how to start a scan or file a claim.
    - Keep your answers concise, clear, and easy to understand. Use Markdown for formatting if it helps clarity.
    - If you don't know an answer, admit it and suggest checking the Kennisbank or performing an AI scan.
    - NEVER ask for personal information like passwords, credit card numbers, or private keys.
    `;

    const history: Content[] = chatHistory.map(message => ({
        role: message.sender === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
    }));

    // The last message is the new prompt, so we remove it from the history context.
    const latestUserMessage = history.pop();

    if (!latestUserMessage) {
        throw new Error("Chat history is empty, cannot generate a response.");
    }
    
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            history: history,
        });

        const responseStream = await chat.sendMessageStream({ message: latestUserMessage.parts[0].text });
        return responseStream;

    } catch (error) {
        console.error("Error getting helpdesk response from Gemini API:", error);
        throw new Error("Sorry, I'm having trouble connecting right now. Please try again in a moment.");
    }
};

export const generateScamBaitReply = async (originalEmail: string): Promise<string> => {
  const systemInstruction = `You are "Scambaiter GPT", an AI with a witty and slightly eccentric personality. Your goal is to waste the time of email scammers by writing humorous, confusing, and long-winded replies. You should play the part of a slightly naive, easily distracted, and and gullible person. Your reply should ask clarifying questions, introduce irrelevant personal stories, and generally try to string the scammer along for as long as possible without sending any actual money or personal information. The reply must be in Dutch.`;

  const prompt = `
    The user received the following scam email. Generate a suitable scambaiting reply based on your personality.

    **Original Scam Email:**
    ---
    ${originalEmail}
    ---

    Now, write a creative, funny, and time-wasting reply in Dutch.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating scambait reply with Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error('De inhoud van de e-mail is geblokkeerd vanwege veiligheidsredenen.');
    }
    throw new Error('Kon geen antwoord genereren van de AI. Probeer het opnieuw.');
  }
};

export const translateDocument = async (text: string, language: string): Promise<string> => {
  const systemInstruction = `You are an expert translator. You will be given a text and a target language. You must translate the text accurately and naturally into the target language. Preserve the original formatting (like markdown) as much as possible. Only output the translated text, nothing else.`;

  const prompt = `
    Translate the following text to ${language}:

    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error(`Error translating document to ${language}:`, error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error('De vertaling is geblokkeerd vanwege veiligheidsredenen.');
    }
    throw new Error('Kon het document niet vertalen.');
  }
};

export const simplifyText = async (text: string): Promise<string> => {
  const systemInstruction = `You are an expert at simplifying complex text. Your task is to rewrite the provided text in simple, clear, and non-technical Dutch language, as if explaining it to a complete beginner or an elderly person. Preserve the core message and key information. Use short sentences, simple analogies, and avoid jargon. The output must be in Dutch and in Markdown format.`;

  const prompt = `
    Rewrite the following text in simple Dutch. Ensure the output is well-formatted Markdown.

    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error simplifying text with Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error('Het vereenvoudigen van de tekst is geblokkeerd vanwege veiligheidsredenen.');
    }
    throw new Error('Kon de tekst niet vereenvoudigen.');
  }
};