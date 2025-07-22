/**
 * js/flow_validation.js
 * VERSIONE CORRETTA: Aggiunta interfaccia per "Sviluppa Modulo Malware (AI)" e modificato "Automatizza deploy tool".
 */

const dataTypes = {
    'ControlFlow': { color: '#9ca3af', parent: null },
    'Target': { color: '#ef4444', parent: null },
    'IPAddress': { color: '#f87171', parent: 'Target' },
    'Domain': { color: '#fca5a5', parent: 'Target' },
    'System': { color: '#fecaca', parent: 'Target' },
    'Text': { color: '#3b82f6', parent: null },
    'URL': { color: '#60a5fa', parent: 'Text' },
    'EmailAddress': { color: '#93c5fd', parent: 'Text' },
    'Password': { color: '#bfdbfe', parent: 'Text' },
    'Command': { color: '#a5b4fc', parent: 'Text' },
    'Numeric': { color: '#f59e0b', parent: null },
    'Boolean': { color: '#a3e635', parent: null },
    'DataPacket': { color: '#22c55e', parent: null },
    'RawData': { color: '#4ade80', parent: 'DataPacket' },
    'StructuredData': { color: '#86efac', parent: 'DataPacket' },
    'LogFile': { color: '#bbf7d0', parent: 'DataPacket' },
    'Credentials': { color: '#eab308', parent: null },
    'Vulnerability': { color: '#f97316', parent: null },
    'Payload': { color: '#a855f7', parent: 'DataPacket' },
    'Executable': { color: '#c084fc', parent: 'Payload' },
    'Shellcode': { color: '#d8b4fe', parent: 'Payload' },
    'Script': { color: '#e9d5ff', parent: 'Payload' },
    'EncryptedPayload': { color: '#a78bfa', parent: 'Payload' },
    'NetworkTraffic': { color: '#14b8a6', parent: null },
    'Image': { color: '#ec4899', parent: null }
};

function areTypesCompatible(outputType, inputType) {
    if (outputType === inputType) return true;
    
    if (outputType.startsWith('List<') && inputType.startsWith('List<')) {
        const outGeneric = outputType.substring(5, outputType.length - 1);
        const inGeneric = inputType.substring(5, inputType.length - 1);
        return areTypesCompatible(outGeneric, inGeneric);
    }

    if (inputType.startsWith('List<')) {
        const inGeneric = inputType.substring(5, inputType.length - 1);
        if (areTypesCompatible(outputType, inGeneric)) return true;
    }
    
    let currentOutputType = outputType;
    while (currentOutputType) {
        const parent = dataTypes[currentOutputType]?.parent;
        if (parent === inputType) return true;
        currentOutputType = parent;
    }
    return false;
}

const blockInterfaces = {
    'Punto di Ingresso (Target)': {
        inputs: [],
        outputs: [{ type: 'ControlFlow', name: 'Start' }, { type: 'Target', name: 'Target' }]
    },
    'Crea Stringa': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Text', name: 'String' }] },
    'Unisci Stringhe': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'A' }, { type: 'Text', name: 'B' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Text', name: 'Result' }] },
    'Imposta Oggetto Email': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Subject' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Imposta Corpo Email': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Body' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Prendi Info da Archivio': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'DataPacket', name: 'Data' }] },
    'Crea fake login page': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'URL', name: 'Fake URL' }] },
    'Genera Testo Persuasivo (AI)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Topic', optional: true }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Text', name: 'Generated Text' }] },
    'Esporta in dark market': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'DataPacket', name: 'Data' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Include link traccianti': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'URL', name: 'URL' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'URL', name: 'Tracked URL' }] },
    'Crea campagna spear phishing': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'List<EmailAddress>', name: 'Targets' }, { type: 'Text', name: 'Email Body' }, { type: 'URL', name: 'Malicious Link' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Simula attacco vishing/smishing': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'List<Text>', name: 'Phone Numbers' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Baiting/Quid Pro Quo': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Importa file .CSV': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'StructuredData', name: 'CSV Data' }] },
    'Inserisci Variabile in Testo': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Template' }, { type: 'Text', name: 'Variable' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Text', name: 'Result' }] },
    'Variabile (Imposta)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Value' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Variabile (Ottieni)': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Text', name: 'Value' }] },
    'Crea script per automazione base': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Script', name: 'Script' }] },
    'Analizza log file': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'LogFile', name: 'Log File' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'StructuredData', name: 'Analysis' }] },
    'Ricevi segnale trigger': { inputs: [], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Condizione (IF/ELSE)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Boolean', name: 'Condition' }], outputs: [{ type: 'ControlFlow', name: 'Then' }, { type: 'ControlFlow', name: 'Else' }] },
    'Ciclo (LOOP)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Numeric', name: 'Iterations' }], outputs: [{ type: 'ControlFlow', name: 'Loop Body' }, { type: 'ControlFlow', name: 'End' }] },
    'Gestisci eccezioni script': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Try' }, { type: 'ControlFlow', name: 'Catch' }] },
    'Crea keylogger base': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'Keylogger' }] },
    'Sviluppa backdoor semplice': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'Backdoor' }] },
    'Scrivi su Registro di Sistema': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }, { type: 'Text', name: 'Key' }, { type: 'Text', name: 'Value' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Sviluppa ransomware semplice': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'Ransomware' }] },
    'Genera worm di rete': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'Worm' }] },
    'Cattura Screenshot': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Image', name: 'Screenshot' }] },
    'Genera rootkit (base)': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'Rootkit' }] },
    'Crea trojan avanzato': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'Trojan' }] },
    'Trova vulnerabilità software (scanner)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Vulnerability', name: 'Vulnerability Found' }] },
    'Crea shellcode base': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Shellcode', name: 'Shellcode' }] },
    'Crea exploit per buffer overflow': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Vulnerability', name: 'Vulnerability' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'Exploit' }] },
    'Esegui Comando Remoto': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }, { type: 'Command', name: 'Command' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'RawData', name: 'Output' }] },
    'Sviluppa exploit per zero-day': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Vulnerability', name: 'Vulnerability' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: '0-day Exploit' }] },
    'Decompila eseguibile (base)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Executable', name: 'File' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Text', name: 'Source Code' }] },
    'Analizza codice binario': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Executable', name: 'File' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'StructuredData', name: 'Analysis' }] },
    'Ricostruisci protocollo di comunicazione': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'NetworkTraffic', name: 'Traffic' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Text', name: 'Protocol Spec' }] },
    'Compila pacchetto eseguibile': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Script', name: 'Source' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Executable', name: 'Compiled File' }] },
    'Crea tool eseguibile': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Script', name: 'Source' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Executable', name: 'Tool' }] },
    'Ottimizza performance tool': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Payload', name: 'Tool' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'Optimized Tool' }] },
    'Automatizza deploy tool': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'List<Target>', name: 'Target List' }, { type: 'Payload', name: 'Tool' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] }, // CORRETTO
    'Analizza traffico di rete (base)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'NetworkTraffic', name: 'Traffic' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'StructuredData', name: 'Packets' }] },
    'Scansione rete locale': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'List<IPAddress>', name: 'IP List' }] },
    'Invia Email': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'EmailAddress', name: 'Recipient' }, { type: 'Text', name: 'Subject' }, { type: 'Text', name: 'Body' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Costruisci firewall base': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Esegui port scan avanzato': { 
        inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'List<IPAddress>', name: 'Target IP List' }], 
        outputs: [
            { type: 'ControlFlow', name: 'Out' }, 
            { type: 'List<IPAddress>', name: 'Filtered IP List' },
            { type: 'List<Numeric>', name: 'Open Ports' }
        ] 
    },
    'Mappa topologia di rete': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'List<IPAddress>', name: 'IPs' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Image', name: 'Map' }] },
    'Intercetta traffico di rete': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'NetworkTraffic', name: 'Captured Traffic' }] },
    'Deploy honeypot': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'System', name: 'Host' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Configura IDS/IPS': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'System', name: 'Host' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Analizza alert di sicurezza': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'LogFile', name: 'Alert Log' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'StructuredData', name: 'Report' }] },
    'Cracka password Wi-Fi (WEP/WPA)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Wi-Fi AP' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Password', name: 'Wi-Fi Password' }] },
    'Scansiona reti Wi-Fi vicine': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'List<Target>', name: 'Wi-Fi APs' }] },
    'Esegui attacco deautenticazione': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Wi-Fi AP' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Crea fake AP (Evil Twin)': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Lancia attacco SYN Flood': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Genera traffico UDP Flood': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Coordina botnet per DDoS': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Attacco Layer 7 (HTTP Flood)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'URL', name: 'Target URL' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Usa proxy singolo': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Configura catena di proxy': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Bypassa geolocalizzazione': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Integra con rete Tor': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Crea VPN personalizzata': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Estrai email da database': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'DataPacket', name: 'Database' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'List<EmailAddress>', name: 'Email List' }] },
    'Esegui SQL Injection (base)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'DataPacket', name: 'Result Data' }] },
    'Enumera tabelle database': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'List<Text>', name: 'Table Names' }] },
    'Bypassa autenticazione SQL': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Boolean', name: 'Success' }] },
    'Esfiltra intero database': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'DataPacket', name: 'Database Dump' }] },
    'Salva IP raccolti': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'List<Target>', name: 'Target List' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'LogFile', name: 'Saved Log' }] },
    'Pulisci database (rimuovi tracce)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Cerca Stringa in Archivio': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'DataPacket', name: 'Data' }, { type: 'Text', name: 'Search Term' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Boolean', name: 'Found' }] },
    'Filtra Dati per Attributo': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'StructuredData', name: 'Data' }, { type: 'Text', name: 'Filter' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'StructuredData', name: 'Filtered Data' }] },
    'Estrai Pattern (Regex)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Input Text' }, { type: 'Text', name: 'Pattern' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'List<Text>', name: 'Matches' }] },
    'Compara Archivi Dati': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'DataPacket', name: 'Data A' }, { type: 'DataPacket', name: 'Data B' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'StructuredData', name: 'Differences' }] },
    'Crittografa payload': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'DataPacket', name: 'Data' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'EncryptedPayload', name: 'Encrypted Data' }] },
    'Offusca codice sorgente': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Script', name: 'Script' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Script', name: 'Obfuscated Script' }] },
    'Cancella log di sistema': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Nascondi messaggio in immagine': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Message' }, { type: 'Image', name: 'Cover Image' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Image', name: 'Stego Image' }] },
    'Crea canale covert': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }, { type: 'EncryptedPayload', name: 'Data to Hide' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Crea Link Falso': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'URL', name: 'Real URL' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'URL', name: 'Fake URL' }] },
    'Identifica vulnerabilità XSS (base)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Vulnerability', name: 'XSS Vulnerability' }] },
    'Esegui Cross-Site Scripting (XSS)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Credentials', name: 'Stolen Cookies' }] },
    'Sfrutta Cross-Site Request Forgery (CSRF)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Carica shell web': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }, { type: 'Payload', name: 'Web Shell' }], outputs: [{ type: 'ControlFlow', name: 'Out' }] },
    'Intercetta chiamate API': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'NetworkTraffic', name: 'API Traffic' }] },
    'Genera Testo (AI)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Prompt' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Text', name: 'Generated Text' }] },
    'Genera Immagine (AI)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Text', name: 'Prompt' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Image', name: 'Generated Image' }] },
    'Analisi Vulnerabilità (AI)': { inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Vulnerability', name: 'AI Found Vulnerability' }] },
    'Sviluppa Modulo Malware (AI)': { inputs: [{ type: 'ControlFlow', name: 'In' }], outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'Payload', name: 'AI Malware' }] }, // AGGIUNTO
};
