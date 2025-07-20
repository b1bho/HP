// File: js/data.js
// VERSIONE RIBILANCIATA: Le statistiche dei blocchi sono state potenziate.

const talentData = {
    "Ramo 1: Ingegneria Sociale": {
        icon: "fas fa-user-secret",
        talents: {
            "Social Engineering (SocEng)": {
                description: "Migliora la capacità di creare contenuti persuasivi e ingannevoli.",
                levels: [
                    { name: "SocEng LV1", cost: 1, unlocks: ["Crea fake login page"], studyTime: 30 },
                    { name: "SocEng LV2", cost: 1, unlocks: ["Genera Testo Persuasivo (AI)", "Esporta in dark market"], studyTime: 60 },
                    { name: "SocEng LV3", cost: 1, unlocks: ["Include link traccianti", "Crea campagna spear phishing"], studyTime: 120 },
                    { name: "SocEng LV4", cost: 1, unlocks: ["Simula attacco vishing/smishing", "Baiting/Quid Pro Quo"], studyTime: 240 }
                ]
            }
        }
    },
    "Ramo 2: Sviluppo Software": {
        icon: "fas fa-code",
        talents: {
            "Python": {
                description: "Abilita la creazione e manipolazione di script Python.",
                levels: [
                    { name: "Python LV1", cost: 1, unlocks: ["Importa file .CSV", "Inserisci Variabile in Testo", "Variabile (Imposta)", "Variabile (Ottieni)"], studyTime: 30 },
                    { name: "Python LV2", cost: 1, unlocks: ["Crea script per automazione base", "Analizza log file"], studyTime: 60 }
                ]
            },
            "Script Automation": {
                description: "Permette di automatizzare processi e creare tool che rispondono a eventi specifici.",
                levels: [
                    { name: "Script Automation LV1", cost: 1, unlocks: ["Ricevi segnale trigger", "Condizione (IF/ELSE)", "Ciclo (LOOP)"], studyTime: 45 },
                    { name: "Script Automation LV2", cost: 1, unlocks: ["Imposta loop di esecuzione", "Gestisci eccezioni script"], studyTime: 90 }
                ]
            },
            "Malware Development": {
                description: "Competenze nella creazione di software malevoli.",
                levels: [
                    { name: "Malware Dev LV1", cost: 1, unlocks: ["Crea keylogger base", "Sviluppa backdoor semplice", "Scrivi su Registro di Sistema"], studyTime: 60 },
                    { name: "Malware Dev LV2", cost: 1, unlocks: ["Sviluppa ransomware semplice", "Genera worm di rete", "Cattura Screenshot"], studyTime: 180 },
                    { name: "Malware Dev LV3", cost: 1, unlocks: ["Genera rootkit (base)", "Crea trojan avanzato"], studyTime: 360 }
                ]
            },
            "Exploit Development": {
                description: "Creazione di exploit personalizzati per sfruttare vulnerabilità.",
                levels: [
                    { name: "Exploit Dev LV1", cost: 1, unlocks: ["Trova vulnerabilità software (scanner)", "Crea shellcode base"], studyTime: 120 },
                    { name: "Exploit Dev LV2", cost: 1, unlocks: ["Crea exploit per buffer overflow", "Esegui Comando Remoto"], studyTime: 400 },
                    { name: "Exploit Dev LV3", cost: 1, unlocks: ["Sviluppa exploit per zero-day"], studyTime: 400 }
                ]
            },
            "Reverse Engineering": {
                description: "Analisi di software e sistemi per comprenderne il funzionamento interno.",
                levels: [
                    { name: "Rev Eng LV1", cost: 1, unlocks: ["Decompila eseguibile (base)", "Analizza traffico di rete (base)"], studyTime: 150 },
                    { name: "Rev Eng LV2", cost: 1, unlocks: ["Analizza codice binario", "Ricostruisci protocollo di comunicazione"], studyTime: 300 }
                ]
            },
            "DevOps": {
                description: "Competenze nello sviluppo e gestione di software.",
                levels: [
                    { name: "DevOps LV1", cost: 1, unlocks: ["Compila pacchetto eseguibile", "Crea tool eseguibile"], studyTime: 45 },
                    { name: "DevOps LV2", cost: 1, unlocks: ["Ottimizza performance tool", "Automatizza deploy tool"], studyTime: 90 }
                ]
            }
        }
    },
    "Ramo 3: Networking & Infrastruttura": {
        icon: "fas fa-network-wired",
        talents: {
            "Networking (Net)": {
                description: "Migliora la capacità di interagire con le reti, scansionare dispositivi e gestire le comunicazioni.",
                levels: [
                    { name: "Net LV1", cost: 1, unlocks: ["Scansione rete locale", "Invia Email", "Costruisci firewall base"], studyTime: 45 },
                    { name: "Net LV2", cost: 1, unlocks: ["Esegui port scan avanzato", "Mappa topologia di rete", "Intercetta traffico di rete"], studyTime: 90 }
                ]
            },
            "Network Security": {
                description: "Competenze avanzate nella difesa delle reti e nella creazione di trappole.",
                levels: [
                    { name: "Network Security LV1", cost: 1, unlocks: ["Deploy honeypot"], studyTime: 120 },
                    { name: "Network Security LV2", cost: 1, unlocks: ["Configura IDS/IPS", "Analizza alert di sicurezza"], studyTime: 240 },
                    { name: "Network Security LV3", cost: 1, unlocks: ["Crea honeynet complessa", "Implementa segmentazione di rete"], studyTime: 480 }
                ]
            },
            "Wireless Hacking": {
                description: "Attacchi specifici alle reti wireless.",
                levels: [
                    { name: "Wireless LV1", cost: 1, unlocks: ["Cracka password Wi-Fi (WEP/WPA)", "Scansiona reti Wi-Fi vicine"], studyTime: 100 },
                    { name: "Wireless LV2", cost: 1, unlocks: ["Esegui attacco deautenticazione", "Crea fake AP (Evil Twin)"], studyTime: 200 }
                ]
            },
            "DDoS Attacks": {
                description: "Lanciare attacchi di Distributed Denial of Service.",
                levels: [
                    { name: "DDoS LV1", cost: 1, unlocks: ["Lancia attacco SYN Flood", "Genera traffico UDP Flood"], studyTime: 80 },
                    { name: "DDoS LV2", cost: 1, unlocks: ["Coordina botnet per DDoS", "Attacco Layer 7 (HTTP Flood)"], studyTime: 250 }
                ]
            },
            "Anonymity & Proxy": {
                description: "Tecniche per nascondere la propria identità online.",
                levels: [
                    { name: "Anonymity LV1", cost: 1, unlocks: ["Usa proxy singolo"], studyTime: 40 },
                    { name: "Anonymity LV2", cost: 1, unlocks: ["Configura catena di proxy", "Bypassa geolocalizzazione"], studyTime: 80 },
                    { name: "Anonymity LV3", cost: 1, unlocks: ["Integra con rete Tor", "Crea VPN personalizzata"], studyTime: 160 }
                ]
            }
        }
    },
    "Ramo 4: Database & Dati": {
        icon: "fas fa-database",
        talents: {
            "SQL": {
                description: "Abilità nell'interrogare, manipolare e sfruttare vulnerabilità nei database SQL.",
                levels: [
                    { name: "SQL LV1", cost: 1, unlocks: ["Estrai email da database"], studyTime: 50 },
                    { name: "SQL LV2", cost: 1, unlocks: ["Esegui SQL Injection (base)", "Enumera tabelle database"], studyTime: 100 },
                    { name: "SQL LV3", cost: 1, unlocks: ["Bypassa autenticazione SQL", "Esfiltra intero database"], studyTime: 200 }
                ]
            },
            "Database (DB)": {
                description: "Gestione, protezione e recupero dei dati raccolti.",
                levels: [
                    { name: "DB LV1", cost: 1, unlocks: ["Salva IP raccolti"], studyTime: 40 },
                    { name: "DB LV2", cost: 1, unlocks: ["Esfiltra dati da database", "Pulisci database (rimuovi tracce)"], studyTime: 80 },
                    { name: "DB LV3", cost: 1, unlocks: ["Ripara database compromesso", "Ottimizza query database"], studyTime: 160 }
                ]
            },
            "Analisi Dati": {
            description: "Sviluppa tool avanzati per cercare, filtrare e analizzare grandi quantità di dati.",
            levels: [
                { name: "Analisi Dati LV1", cost: 2, unlocks: ["Cerca Stringa in Archivio", "Filtra Dati per Attributo"], studyTime: 180 },
                { name: "Analisi Dati LV2", cost: 3, unlocks: ["Estrai Pattern (Regex)"], studyTime: 360 },
                { name: "Analisi Dati LV3", cost: 3, unlocks: ["Compara Archivi Dati"], studyTime: 500 }
            ]
        }
        }
    },
    "Ramo 5: Stealth & Evasione": {
        icon: "fas fa-user-ninja",
        talents: {
            "Stealth": {
                description: "Migliora le tecniche per nascondere il codice e proteggere le informazioni.",
                levels: [
                    { name: "Stealth LV1", cost: 1, unlocks: ["Crittografa payload"], studyTime: 90 },
                    { name: "Stealth LV2", cost: 1, unlocks: ["Crittografa database clan", "Offusca codice sorgente"], studyTime: 180 },
                    { name: "Stealth LV3", cost: 1, unlocks: ["Implementa tecniche anti-analisi", "Bypassa sandbox"], studyTime: 360 }
                ]
            },
            "Anti-Forensics": {
                description: "Abilità nell'eliminare le tracce digitali.",
                levels: [
                    { name: "Anti-Forensics LV1", cost: 1, unlocks: ["Cancella log di sistema", "Modifica timestamp file"], studyTime: 70 },
                    { name: "Anti-Forensics LV2", cost: 1, unlocks: ["Sovrascrivi dati (sicurezza)", "Pulizia spazio non allocato"], studyTime: 140 }
                ]
            },
            "Steganography": {
                description: "Nascondere dati sensibili all'interno di altri file.",
                levels: [
                    { name: "Steganography LV1", cost: 1, unlocks: ["Nascondi messaggio in immagine", "Estrai dati nascosti"], studyTime: 110 },
                    { name: "Steganography LV2", cost: 1, unlocks: ["Crea canale covert"], studyTime: 220 }
                ]
            }
        }
    },
    "Ramo 6: Web Exploitation": {
        icon: "fas fa-globe",
        talents: {
            "Web Exploit": {
                description: "Competenze nell'identificare e sfruttare le vulnerabilità comuni nelle applicazioni web.",
                levels: [
                    { name: "Web Exploit LV1", cost: 1, unlocks: ["Crea Link Falso", "Identifica vulnerabilità XSS (base)"], studyTime: 60 },
                    { name: "Web Exploit LV2", cost: 1, unlocks: ["Esegui Cross-Site Scripting (XSS)", "Sfrutta Cross-Site Request Forgery (CSRF)"], studyTime: 120 },
                    { name: "Web Exploit LV3", cost: 1, unlocks: ["Bypassa WAF (Web Application Firewall)", "Sfrutta Insecure Direct Object Reference (IDOR)"], studyTime: 240 }
                ]
            },
            "Server-Side Attacks": {
                description: "Attacchi diretti ai server web e alle loro configurazioni.",
                levels: [
                    { name: "Server-Side LV1", cost: 1, unlocks: ["Esegui Local/Remote File Inclusion (LFI/RFI)", "Inietta comandi su server"], studyTime: 130 },
                    { name: "Server-Side LV2", cost: 1, unlocks: ["Sfrutta vulnerabilità di deserializzazione", "Carica shell web"], studyTime: 260 }
                ]
            },
            "API Exploitation": {
                description: "Sfruttare vulnerabilità nelle Application Programming Interfaces (API).",
                levels: [
                    { name: "API Exploit LV1", cost: 1, unlocks: ["Intercetta chiamate API", "Analizza endpoint API"], studyTime: 100 },
                    { name: "API Exploit LV2", cost: 1, unlocks: ["Manipola richieste API", "Bypassa autenticazione API"], studyTime: 200 }
                ]
            }
        }
    },
    "Ramo 7: Intelligenza Artificiale": {
        icon: "fas fa-brain",
        talents: {
            "Artificial Intelligence (AI)": {
                description: "Abilità nell'integrare e sfruttare modelli di intelligenza artificiale per migliorare le capacità di attacco e difesa.",
                levels: [
                    { name: "AI LV1", cost: 2, unlocks: ["Genera Testo (AI)", "Genera Immagine (AI)"], studyTime: 150 },
                    { name: "AI LV2", cost: 2, unlocks: ["Crea Contenuto Personalizzato (AI)", "Genera Snippet Codice (AI)", "Crea Immagine Inganno (AI)"], studyTime: 300 },
                    { name: "AI LV3", cost: 3, unlocks: ["Sviluppa Modulo Malware (AI)", "Analisi Vulnerabilità (AI)", "Ottimizza Flusso (AI)"], studyTime: 600 }
                ]
            }
        }
    }
};

const blockIcons = {
    // Base
    "Crea Stringa": "fa-quote-left", "Unisci Stringhe": "fa-link", "Imposta Oggetto Email": "fa-heading", "Imposta Corpo Email": "fa-file-alt", "Prendi Info da Archivio": "fa-database",
    // Social Engineering
    "Crea fake login page": "fa-file-invoice", "Genera Testo Persuasivo (AI)": "fa-magic", "Esporta in dark market": "fa-store", "Include link traccianti": "fa-link", "Crea campagna spear phishing": "fa-crosshairs", "Simula attacco vishing/smishing": "fa-phone-alt", "Baiting/Quid Pro Quo": "fa-gift",
    // Development
    "Importa file .CSV": "fa-file-csv", "Inserisci Variabile in Testo": "fa-pen-fancy", "Variabile (Imposta)": "fa-equals", "Variabile (Ottieni)": "fa-question", "Crea script per automazione base": "fa-robot", "Analizza log file": "fa-file-alt", "Ricevi segnale trigger": "fa-satellite-dish", "Condizione (IF/ELSE)": "fa-code-branch", "Ciclo (LOOP)": "fa-sync-alt", "Imposta loop di esecuzione": "fa-redo", "Gestisci eccezioni script": "fa-bug", "Crea keylogger base": "fa-keyboard", "Sviluppa backdoor semplice": "fa-door-open", "Scrivi su Registro di Sistema": "fa-book-medical", "Sviluppa ransomware semplice": "fa-skull-crossbones", "Genera worm di rete": "fa-bug", "Cattura Screenshot": "fa-camera", "Genera rootkit (base)": "fa-user-secret", "Crea trojan avanzato": "fa-horse-trojan", "Trova vulnerabilità software (scanner)": "fa-search", "Crea shellcode base": "fa-code", "Crea exploit per buffer overflow": "fa-memory", "Esegui Comando Remoto": "fa-terminal", "Sviluppa exploit per zero-day": "fa-star", "Decompila eseguibile (base)": "fa-cogs", "Analizza traffico di rete (base)": "fa-network-wired", "Analizza codice binario": "fa-microchip", "Ricostruisci protocollo di comunicazione": "fa-comments", "Compila pacchetto eseguibile": "fa-box-open", "Crea tool eseguibile": "fa-save", "Ottimizza performance tool": "fa-tachometer-alt", "Automatizza deploy tool": "fa-rocket",
    // Networking
    "Scansione rete locale": "fa-broadcast-tower", "Invia Email": "fa-paper-plane", "Costruisci firewall base": "fa-fire-alt", "Esegui port scan avanzato": "fa-search-location", "Mappa topologia di rete": "fa-project-diagram", "Intercetta traffico di rete": "fa-satellite-dish", "Deploy honeypot": "fa-spider", "Configura IDS/IPS": "fa-shield-alt", "Analizza alert di sicurezza": "fa-exclamation-triangle", "Crea honeynet complessa": "fa-dungeon", "Implementa segmentazione di rete": "fa-sitemap", "Cracka password Wi-Fi (WEP/WPA)": "fa-wifi", "Scansiona reti Wi-Fi vicine": "fa-wifi", "Esegui attacco deautenticazione": "fa-ban", "Crea fake AP (Evil Twin)": "fa-broadcast-tower", "Lancia attacco SYN Flood": "fa-water", "Genera traffico UDP Flood": "fa-bolt", "Coordina botnet per DDoS": "fa-users", "Attacco Layer 7 (HTTP Flood)": "fa-server", "Usa proxy singolo": "fa-user-shield", "Configura catena di proxy": "fa-link", "Bypassa geolocalizzazione": "fa-globe-americas", "Integra con rete Tor": "fa-onion", "Crea VPN personalizzata": "fa-lock",
    // Database
     "Cerca Stringa in Archivio": "fa-search","Filtra Dati per Attributo": "fa-filter","Estrai Pattern (Regex)": "fa-project-diagram","Compara Archivi Dati": "fa-exchange-alt","Analisi Comportamentale (AI)": "fa-brain","Estrai email da database": "fa-at", "Esegui SQL Injection (base)": "fa-database", "Enumera tabelle database": "fa-table", "Bypassa autenticazione SQL": "fa-key", "Esfiltra intero database": "fa-file-export", "Salva IP raccolti": "fa-map-marker-alt", "Esfiltra dati da database": "fa-file-download", "Pulisci database (rimuovi tracce)": "fa-eraser", "Ripara database compromesso": "fa-wrench", "Ottimizza query database": "fa-running",
    // Stealth
    "Crittografa payload": "fa-lock", "Crittografa database clan": "fa-users-cog", "Offusca codice sorgente": "fa-mask", "Implementa tecniche anti-analisi": "fa-microscope", "Bypassa sandbox": "fa-box", "Cancella log di sistema": "fa-trash-alt", "Modifica timestamp file": "fa-clock", "Sovrascrivi dati (sicurezza)": "fa-hdd", "Pulizia spazio non allocato": "fa-broom", "Nascondi messaggio in immagine": "fa-image", "Estrai dati nascosti": "fa-eye", "Crea canale covert": "fa-comment-slash",
    // Web Exploit
    "Crea Link Falso": "fa-link", "Identifica vulnerabilità XSS (base)": "fa-code", "Esegui Cross-Site Scripting (XSS)": "fa-code", "Sfrutta Cross-Site Request Forgery (CSRF)": "fa-user-edit", "Bypassa WAF (Web Application Firewall)": "fa-shield-virus", "Sfrutta Insecure Direct Object Reference (IDOR)": "fa-fingerprint", "Esegui Local/Remote File Inclusion (LFI/RFI)": "fa-file-import", "Inietta comandi su server": "fa-terminal", "Sfrutta vulnerabilità di deserializzazione": "fa-cookie-bite", "Carica shell web": "fa-upload", "Intercetta chiamate API": "fa-satellite-dish", "Analizza endpoint API": "fa-search-dollar", "Manipola richieste API": "fa-random", "Bypassa autenticazione API": "fa-key",
    // AI
    "Genera Testo (AI)": "fa-comment-dots", "Genera Immagine (AI)": "fa-image", "Crea Contenuto Personalizzato (AI)": "fa-user-edit", "Genera Snippet Codice (AI)": "fa-code", "Crea Immagine Inganno (AI)": "fa-mask", "Sviluppa Modulo Malware (AI)": "fa-robot", "Analisi Vulnerabilità (AI)": "fa-search", "Ottimizza Flusso (AI)": "fa-lightbulb"
};

// STATS RIBILANCIATE
const blockStats = {
    'Estrai email da database': { lso: 4, rc: 2.5, lcs: 0, an: 3, eo: 4, rl: 2 },
    'Importa file .CSV': { lso: 1, rc: 2, lcs: 0, an: 1, eo: 2, rl: 0 },
    'Scansione rete locale': { lso: 3, rc: 2.2, lcs: 0, an: 2, eo: 3, rl: 1 },
    'Ricevi segnale trigger': { lso: 1, rc: 3, lcs: 0, an: 1, eo: 1, rl: 0 },
    'Trova vulnerabilità software (scanner)': { lso: 6, rc: 3.5, lcs: 0, an: 4, eo: 5, rl: 2 },
    'Intercetta chiamate API': { lso: 5, rc: 3, lcs: 0, an: 4, eo: 4, rl: 3 },
    'Analizza endpoint API': { lso: 4, rc: 2.8, lcs: 0, an: 3, eo: 3, rl: 2 },
    'Decompila eseguibile (base)': { lso: 2, rc: 3.2, lcs: 0, an: 1, eo: 2, rl: 1 },
    'Analizza codice binario': { lso: 3, rc: 4.0, lcs: 0, an: 2, eo: 3, rl: 1 },
    'Ricostruisci protocollo di comunicazione': { lso: 4, rc: 4.2, lcs: 0, an: 3, eo: 4, rl: 2 },
    'Analizza log file': { lso: 2, rc: 3.0, lcs: 0, an: 1, eo: 2, rl: 0 },
    'Crea fake AP (Evil Twin)': { lso: 8, rc: 3.0, lcs: 0, an: 6, eo: 5, rl: 4 },
    'Cracka password Wi-Fi (WEP/WPA)': { lso: 7, rc: 3.5, lcs: 0, an: 5, eo: 6, rl: 3 },
    'Scansiona reti Wi-Fi vicine': { lso: 4, rc: 2.5, lcs: 0, an: 2, eo: 3, rl: 1 },
    'Crea fake login page': { lso: 6, rc: 2.8, lcs: 0, an: 5, eo: 4, rl: 3 },
    'Crittografa payload': { lso: 2, rc: 3.5, lcs: 8, an: 4, eo: 2, rl: -2 },
    'Compila pacchetto eseguibile': { lso: 1, rc: 4.0, lcs: 0, an: 0, eo: 2, rl: 0 },
    'Imposta loop di esecuzione': { lso: 3, rc: 3.0, lcs: 0, an: 2, eo: 2, rl: 1 },
    'Gestisci eccezioni script': { lso: 1, rc: 4.5, lcs: 0, an: 0, eo: 1, rl: 0 },
    'Crea campagna spear phishing': { lso: 7, rc: 3.2, lcs: 0, an: 6, eo: 6, rl: 4 },
    'Simula attacco vishing/smishing': { lso: 7, rc: 3.0, lcs: 0, an: 7, eo: 5, rl: 5 },
    'Baiting/Quid Pro Quo': { lso: 5, rc: 2.5, lcs: 0, an: 4, eo: 4, rl: 3 },
    'Crea script per automazione base': { lso: 2, rc: 3.5, lcs: 0, an: 1, eo: 3, rl: 1 },
    'Sviluppa keylogger base': { lso: 6, rc: 3.0, lcs: 2, an: 5, eo: 4, rl: 4 },
    'Sviluppa backdoor semplice': { lso: 8, rc: 3.2, lcs: 3, an: 7, eo: 5, rl: 5 },
    'Sviluppa ransomware semplice': { lso: 9, rc: 3.8, lcs: 8, an: 6, eo: 7, rl: 7 },
    'Genera worm di rete': { lso: 10, rc: 4.0, lcs: 2, an: 7, eo: 8, rl: 6 },
    'Genera rootkit (base)': { lso: 12, rc: 4.5, lcs: 5, an: 10, eo: 6, rl: 8 },
    'Crea trojan avanzato': { lso: 8, rc: 3.5, lcs: 4, an: 7, eo: 6, rl: 6 },
    'Crea shellcode base': { lso: 7, rc: 3.8, lcs: 0, an: 5, eo: 5, rl: 4 },
    'Crea exploit per buffer overflow': { lso: 10, rc: 4.2, lcs: 0, an: 6, eo: 7, rl: 6 },
    'Sviluppa exploit per zero-day': { lso: 14, rc: 4.8, lcs: 2, an: 8, eo: 9, rl: 8 },
    'Esegui port scan avanzato': { lso: 5, rc: 2.8, lcs: 0, an: 3, eo: 4, rl: 2 },
    'Mappa topologia di rete': { lso: 3, rc: 3.0, lcs: 0, an: 2, eo: 3, rl: 1 },
    'Intercetta traffico di rete': { lso: 7, rc: 3.5, lcs: 0, an: 6, eo: 5, rl: 4 },
    'Esegui attacco deautenticazione': { lso: 6, rc: 3.0, lcs: 0, an: 4, eo: 4, rl: 3 },
    'Lancia attacco SYN Flood': { lso: 8, rc: 2.5, lcs: 0, an: 5, eo: 8, rl: 5 },
    'Genera traffico UDP Flood': { lso: 8, rc: 2.5, lcs: 0, an: 5, eo: 8, rl: 5 },
    'Coordina botnet per DDoS': { lso: 10, rc: 4.0, lcs: 0, an: 8, eo: 10, rl: 7 },
    'Attacco Layer 7 (HTTP Flood)': { lso: 9, rc: 3.5, lcs: 0, an: 7, eo: 9, rl: 6 },
    'Usa proxy singolo': { lso: 2, rc: 2.0, lcs: 0, an: 5, eo: 1, rl: 0 },
    'Configura catena di proxy': { lso: 3, rc: 2.5, lcs: 0, an: 8, eo: 2, rl: 0 },
    'Bypassa geolocalizzazione': { lso: 4, rc: 2.2, lcs: 0, an: 7, eo: 3, rl: 1 },
    'Integra con rete Tor': { lso: 5, rc: 3.0, lcs: 4, an: 12, eo: 4, rl: -2 },
    'Crea VPN personalizzata': { lso: 4, rc: 3.8, lcs: 6, an: 10, eo: 3, rl: -1 },
    'Esegui SQL Injection (base)': { lso: 8, rc: 3.5, lcs: 0, an: 6, eo: 6, rl: 4 },
    'Enumera tabelle database': { lso: 5, rc: 2.5, lcs: 0, an: 4, eo: 4, rl: 2 },
    'Bypassa autenticazione SQL': { lso: 10, rc: 4.0, lcs: 0, an: 8, eo: 7, rl: 6 },
    'Esfiltra intero database': { lso: 9, rc: 3.8, lcs: 0, an: 7, eo: 8, rl: 5 },
    'Offusca codice sorgente': { lso: 3, rc: 3.0, lcs: 6, an: 4, eo: 2, rl: -3 },
    'Implementa tecniche anti-analisi': { lso: 4, rc: 4.0, lcs: 8, an: 6, eo: 3, rl: -4 },
    'Bypassa sandbox': { lso: 5, rc: 4.2, lcs: 7, an: 7, eo: 4, rl: -3 },
    'Cancella log di sistema': { lso: 2, rc: 2.5, lcs: 0, an: 4, eo: 2, rl: -5 },
    'Modifica timestamp file': { lso: 1, rc: 2.0, lcs: 0, an: 3, eo: 1, rl: -4 },
    'Sovrascrivi dati (sicurezza)': { lso: 3, rc: 3.0, lcs: 0, an: 5, eo: 3, rl: -6 },
    'Pulizia spazio non allocato': { lso: 3, rc: 3.2, lcs: 0, an: 5, eo: 3, rl: -6 },
    'Nascondi messaggio in immagine': { lso: 4, rc: 2.8, lcs: 7, an: 6, eo: 2, rl: -2 },
    'Estrai dati nascosti': { lso: 3, rc: 3.0, lcs: 7, an: 5, eo: 3, rl: -1 },
    'Crea canale covert': { lso: 6, rc: 3.5, lcs: 9, an: 9, eo: 4, rl: -1 },
    'Identifica vulnerabilità XSS (base)': { lso: 4, rc: 2.2, lcs: 0, an: 3, eo: 3, rl: 1 },
    'Esegui Cross-Site Scripting (XSS)': { lso: 7, rc: 3.0, lcs: 0, an: 5, eo: 5, rl: 3 },
    'Sfrutta Cross-Site Request Forgery (CSRF)': { lso: 8, rc: 3.2, lcs: 0, an: 6, eo: 6, rl: 4 },
    'Bypassa WAF (Web Application Firewall)': { lso: 9, rc: 3.8, lcs: 2, an: 7, eo: 6, rl: 3 },
    'Sfrutta Insecure Direct Object Reference (IDOR)': { lso: 8, rc: 3.5, lcs: 0, an: 6, eo: 5, rl: 3 },
    'Esegui Local/Remote File Inclusion (LFI/RFI)': { lso: 9, rc: 3.2, lcs: 0, an: 6, eo: 6, rl: 5 },
    'Inietta comandi su server': { lso: 10, rc: 3.5, lcs: 0, an: 7, eo: 7, rl: 6 },
    'Sfrutta vulnerabilità di deserializzazione': { lso: 11, rc: 4.2, lcs: 1, an: 8, eo: 8, rl: 7 },
    'Carica shell web': { lso: 11, rc: 4.0, lcs: 2, an: 8, eo: 8, rl: 7 },
    'Manipola richieste API': { lso: 7, rc: 3.0, lcs: 0, an: 6, eo: 5, rl: 3 },
    'Bypassa autenticazione API': { lso: 9, rc: 3.8, lcs: 0, an: 8, eo: 6, rl: 5 },
    'Salva IP raccolti': { lso: 2, rc: 2.0, lcs: 0, an: 2, eo: 2, rl: 1 },
    'Pulisci database (rimuovi tracce)': { lso: 3, rc: 2.8, lcs: 0, an: 4, eo: 3, rl: -5 },
    'Esporta in dark market': { lso: 2, rc: 1.5, lcs: 0, an: 3, eo: 2, rl: 1 },
    'Crea tool eseguibile': { lso: 1, rc: 3.5, lcs: 0, an: 0, eo: 2, rl: 0 },
    'Costruisci firewall base': { lso: 1, rc: 3.0, lcs: 0, an: 1, eo: 3, rl: 0 },
    'Configura IDS/IPS': { lso: 2, rc: 4.0, lcs: 0, an: 2, eo: 4, rl: 0 },
    'Ripara database compromesso': { lso: 1, rc: 3.5, lcs: 0, an: 1, eo: 4, rl: 0 },
    'Ottimizza query database': { lso: 1, rc: 2.5, lcs: 0, an: 1, eo: 3, rl: 0 },
    'Implementa segmentazione di rete': { lso: 2, rc: 4.2, lcs: 0, an: 2, eo: 5, rl: 0 },
    'Automatizza deploy tool': { lso: 3, rc: 3.8, lcs: 0, an: 2, eo: 4, rl: 1 },
};

const marketData = {
    personalHardware: [
        { id: 'cpu1', name: 'CPU Base', description: 'Riduce tempo studio del 5%.', costUSD: 500, bonus: { type: 'studyTime', value: 0.95 } },
        { id: 'cpu2', name: 'CPU Avanzata', description: 'Riduce tempo studio del 15%.', costUSD: 2500, bonus: { type: 'studyTime', value: 0.85 } },
        { id: 'ram1', name: 'RAM 16GB', description: 'Migliora EO dei tool di 1.', costUSD: 750, bonus: { type: 'toolStat', stat: 'eo', value: -1 } },
        { id: 'ram2', name: 'RAM 32GB', description: 'Migliora EO dei tool di 2.', costUSD: 3000, bonus: { type: 'toolStat', stat: 'eo', value: -2 } },
        { id: 'storage1', name: 'SSD 1TB', description: 'Spazio di archiviazione veloce.', costUSD: 400, bonus: null },
        { id: 'storage2', name: 'SSD 4TB NVMe', description: 'Archiviazione ultra-veloce.', costUSD: 2000, bonus: null },
    ],
    personalInfrastructure: [
        { id: 'vpn1', name: 'Servizio VPN Base', description: 'Maschera il tuo IP.', costUSD: 1000, bonus: null },
        { id: 'vpn2', name: 'Servizio VPN Multi-Hop', description: 'Aumenta l\'anonimato.', costUSD: 4000, bonus: null },
        { id: 'server1', name: 'VPS Noleggiato', description: 'Un server virtuale per i tuoi servizi.', costUSD: 1500, bonus: null },
    ],
    clanInfrastructure: {
        'clanServer': { id: 'c_server', name: 'Server Clan Dedicato', icon: 'fa-server', description: 'Un server dedicato per le operazioni del clan. Aumenta la capacità di archiviazione dati e la potenza di calcolo. Un clan può possederne fino a 5.', costUSD: 15000, points: { capacity: 20, security: 5 }, flowSlots: 2 },
        'c_firewall': { id: 'c_firewall', name: 'Firewall Clan', icon: 'fa-shield-halved', tiers: [ { id: 'c_firewall_t1', name: 'Firewall Base', description: 'Protezione di base contro attacchi esterni.', costUSD: 7500, bonus: { type: 'toolStat', stat: 'rl', value: -1 }, flowSlots: 1, points: { security: 15 } }, { id: 'c_firewall_t2', name: 'Firewall Avanzato', description: 'Filtri avanzati e IDS.', costUSD: 40000, bonus: { type: 'toolStat', stat: 'rl', value: -3 }, flowSlots: 2, points: { security: 35 } } ] },
        'c_network': { id: 'c_network', name: 'Rete Clan', icon: 'fa-network-wired', tiers: [ { id: 'c_network_t1', name: 'Rete Fibra', description: 'Aumenta la banda per le operazioni.', costUSD: 12000, bonus: { type: 'toolStat', stat: 'eo', value: 1 }, flowSlots: 0, points: { capacity: 10, security: 5 } }, { id: 'c_network_t2', name: 'Rete Globale', description: 'Routing ottimizzato e banda massiccia.', costUSD: 60000, bonus: { type: 'toolStat', stat: 'eo', value: 3 }, flowSlots: 0, points: { capacity: 25, security: 10 } } ] },
        'c_vpn': { id: 'c_vpn', name: 'VPN Privata Clan', icon: 'fa-user-secret', tiers: [ { id: 'c_vpn_t1', name: 'VPN Base', description: 'Anonimato per le operazioni del clan.', costUSD: 15000, bonus: { type: 'toolStat', stat: 'an', value: 2 }, flowSlots: 1, points: { security: 20 } }, { id: 'c_vpn_t2', name: 'VPN Multi-Hop', description: 'Anonimato e sicurezza di livello superiore.', costUSD: 70000, bonus: { type: 'toolStat', stat: 'an', value: 5 }, flowSlots: 2, points: { security: 50 } } ] },
        'c_ai': { id: 'c_ai', name: 'IA Privata Clan', icon: 'fa-brain', tiers: [ { id: 'c_ai_t1', name: 'IA Base', description: 'Modello AI per automazioni semplici.', costUSD: 50000, bonus: { type: 'toolStat', stat: 'rc', value: 0.5 }, flowSlots: 2, points: { capacity: 15, security: 10 } }, { id: 'c_ai_t2', name: 'IA Avanzata', description: 'Modello AI avanzato per analisi e attacchi.', costUSD: 250000, bonus: { type: 'toolStat', stat: 'rc', value: 1.5 }, flowSlots: 4, points: { capacity: 40, security: 25 } } ] }
    }
};



const nationsData = {
    "USA": {
        lat: 39.8283, lon: -98.5795, flag: '🇺🇸',
        security: 90, economy: 95, population: 330,
        vulnerabilities: ["Rete elettrica centralizzata", "Sistemi finanziari complessi"],
        alignment: 'White Hat',
        targets: [
            { id: 'usa_pentagon', name: 'Pentagono', type: 'Infrastruttura Governativa', req: { lso: 15, rc: 4.5, lcs: 10, an: 12, eo: 8, rl: 0 } },
            { id: 'usa_wallstreet', name: 'Wall Street', type: 'Finanziario', req: { lso: 12, rc: 4.0, lcs: 8, an: 10, eo: 10, rl: 2 } },
            { id: 'usa_population', name: 'Popolazione Generale', type: 'Civile', req: { lso: 5, rc: 2.0, lcs: 2, an: 4, eo: 5, rl: 5 } }
        ]
    },
    "Regno Unito": {
        lat: 55.3781, lon: -3.4360, flag: '🇬🇧',
        security: 85, economy: 80, population: 67,
        vulnerabilities: ["Sorveglianza CCTV estesa", "Infrastrutture critiche datate"],
        alignment: 'Grey Hat',
        targets: [
            { id: 'uk_mi6', name: 'MI6 HQ', type: 'Infrastruttura Governativa', req: { lso: 14, rc: 4.2, lcs: 9, an: 11, eo: 9, rl: 1 } },
            { id: 'uk_nhs', name: 'Database Sanitario (NHS)', type: 'Dati Sensibili', req: { lso: 8, rc: 3.0, lcs: 7, an: 8, eo: 6, rl: 4 } },
            { id: 'uk_population', name: 'Popolazione Generale', type: 'Civile', req: { lso: 6, rc: 2.2, lcs: 3, an: 5, eo: 5, rl: 5 } }
        ]
    },
    "Italia": {
        lat: 41.8719, lon: 12.5674, flag: '🇮🇹',
        security: 65, economy: 70, population: 59,
        vulnerabilities: ["Burocrazia digitale frammentata", "Sistemi bancari regionali"],
        alignment: 'Grey Hat',
        targets: [
            { id: 'it_gov', name: 'Server Governativi', type: 'Infrastruttura Governativa', req: { lso: 7, rc: 2.5, lcs: 5, an: 6, eo: 4, rl: 3 } },
            { id: 'it_population', name: 'Popolazione Generale', type: 'Civile', req: { lso: 4, rc: 1.8, lcs: 2, an: 3, eo: 4, rl: 6 } }
        ]
    },
    "Giappone": {
        lat: 36.2048, lon: 138.2529, flag: '🇯🇵',
        security: 88, economy: 92, population: 125,
        vulnerabilities: ["Dipendenza da tecnologia importata", "Popolazione anziana suscettibile al vishing"],
        alignment: 'White Hat',
        targets: [
            { id: 'jp_bank', name: 'Banca di Tokyo', type: 'Finanziario', req: { lso: 10, rc: 3.5, lcs: 8, an: 9, eo: 8, rl: 2 } },
            { id: 'jp_population', name: 'Popolazione Generale', type: 'Civile', req: { lso: 5, rc: 2.0, lcs: 4, an: 4, eo: 5, rl: 5 } }
        ]
    },
     "Germania": {
        lat: 51.1657, lon: 10.4515, flag: '🇩🇪',
        security: 85, economy: 93, population: 83,
        vulnerabilities: ["Industria 4.0 interconnessa", "Leggi sulla privacy stringenti"],
        alignment: 'White Hat',
        targets: [
            { id: 'de_datacenter', name: 'Datacenter Francoforte', type: 'Infrastruttura Dati', req: { lso: 9, rc: 3.8, lcs: 8, an: 8, eo: 7, rl: 2 } },
            { id: 'de_population', name: 'Popolazione Generale', type: 'Civile', req: { lso: 6, rc: 2.5, lcs: 5, an: 6, eo: 5, rl: 4 } }
        ]
    }
};


// MAPPA CATEGORIE AGGIORNATA
const blockToCategoryMap = {};
const baseBlocks = ["Crea Stringa", "Unisci Stringhe", "Imposta Oggetto Email", "Imposta Corpo Email", "Prendi Info da Archivio"];
baseBlocks.forEach(b => blockToCategoryMap[b] = "Base");

// NUOVA CATEGORIA
const logicBlocks = ["Punto di Ingresso (Target)"];
logicBlocks.forEach(b => blockToCategoryMap[b] = "Logica di Flusso");

for (const branchName in talentData) {
    const categoryName = branchName.split(': ')[1];
    const branch = talentData[branchName];
    for (const talentName in branch.talents) {
        const talent = branch.talents[talentName];
        talent.levels.forEach(level => {
            if (Array.isArray(level.unlocks)) {
                level.unlocks.forEach(blockName => {
                    blockToCategoryMap[blockName] = categoryName;
                });
            }
        });
    }
}