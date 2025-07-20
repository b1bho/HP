const worldData = {
    "USA": {
        "lat": 39.8283, "lon": -98.5795, "flag": "🇺🇸", "security": 90, "economy": 95, "population": 330,
        "vulnerabilities": ["Rete elettrica centralizzata", "Sistemi finanziari complessi"], "alignment": "White Hat",
        "targets": [
            { "id": "usa_pentagon", "name": "Pentagono", "type": "Infrastruttura Governativa", "req": { "lso": 15, "rc": 4.5, "lcs": 10, "an": 12, "eo": 8, "rl": 0 }, "rewardType": "Informazioni Governative Riservate", "rewardScale": 1, "sensitivity": 10, "baseExecutionTime": 86400 },
            { "id": "usa_wallstreet", "name": "Wall Street", "type": "Finanziario", "req": { "lso": 12, "rc": 4.0, "lcs": 8, "an": 10, "eo": 10, "rl": 2 }, "rewardType": "Dati Finanziari Top-Tier", "rewardScale": 500, "sensitivity": 9, "baseExecutionTime": 43200 },
            { "id": "usa_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 0, "rc": 0, "lcs": 0, "an": 0, "eo": 0, "rl": 0 }, "rewardType": "Profili Utente", "rewardScale": 50000, "sensitivity": 5, "baseExecutionTime": 600 }
        ]
    },
    "Regno Unito": {
        "lat": 55.3781, "lon": -3.4360, "flag": "🇬🇧", "security": 85, "economy": 80, "population": 67,
        "vulnerabilities": ["Sorveglianza CCTV estesa", "Infrastrutture critiche datate"], "alignment": "Grey Hat",
        "targets": [
            { "id": "uk_mi6", "name": "MI6 HQ", "type": "Infrastruttura Governativa", "req": { "lso": 14, "rc": 4.2, "lcs": 9, "an": 11, "eo": 9, "rl": 1 }, "rewardType": "Dossier di Intelligence", "rewardScale": 3, "sensitivity": 10, "baseExecutionTime": 72000 },
            { "id": "uk_nhs", "name": "Database Sanitario (NHS)", "type": "Dati Sensibili", "req": { "lso": 8, "rc": 3.0, "lcs": 7, "an": 8, "eo": 6, "rl": 4 }, "rewardType": "Cartelle Cliniche", "rewardScale": 10000, "sensitivity": 8, "baseExecutionTime": 14400 },
            { "id": "uk_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 6, "rc": 2.2, "lcs": 3, "an": 5, "eo": 5, "rl": 5 }, "rewardType": "Dati Personali", "rewardScale": 40000, "sensitivity": 5, "baseExecutionTime": 720 }
        ]
    },
    "Italia": {
        "lat": 41.8719, "lon": 12.5674, "flag": "🇮🇹", "security": 65, "economy": 70, "population": 59,
        "vulnerabilities": ["Burocrazia digitale frammentata", "Sistemi bancari regionali"], "alignment": "Grey Hat",
        "targets": [
            { "id": "it_gov", "name": "Server Governativi", "type": "Infrastruttura Governativa", "req": { "lso": 7, "rc": 2.5, "lcs": 5, "an": 6, "eo": 4, "rl": 3 }, "rewardType": "Comunicazioni Ministeriali", "rewardScale": 5, "sensitivity": 7, "baseExecutionTime": 10800 },
            { "id": "it_telecom", "name": "Rete Telecomunicazioni", "type": "Infrastruttura Critica", "req": { "lso": 8, "rc": 2.8, "lcs": 4, "an": 5, "eo": 6, "rl": 4 }, "rewardType": "Log di Traffico", "rewardScale": 1000, "sensitivity": 6, "baseExecutionTime": 7200 },
            { "id": "it_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 4, "rc": 1.8, "lcs": 2, "an": 3, "eo": 4, "rl": 6 }, "rewardType": "Dati Anagrafici", "rewardScale": 30000, "sensitivity": 4, "baseExecutionTime": 600 }
        ]
    },
    "Giappone": {
        "lat": 36.2048, "lon": 138.2529, "flag": "🇯🇵", "security": 88, "economy": 92, "population": 125,
        "vulnerabilities": ["Dipendenza da tecnologia importata", "Popolazione anziana suscettibile al vishing"], "alignment": "White Hat",
        "targets": [
            { "id": "jp_bank", "name": "Banca di Tokyo", "type": "Finanziario", "req": { "lso": 10, "rc": 3.5, "lcs": 8, "an": 9, "eo": 8, "rl": 2 }, "rewardType": "Transazioni Internazionali", "rewardScale": 2000, "sensitivity": 8, "baseExecutionTime": 21600 },
            { "id": "jp_tech", "name": "Industria Robotica", "type": "Proprietà Intellettuale", "req": { "lso": 11, "rc": 3.8, "lcs": 7, "an": 8, "eo": 9, "rl": 3 }, "rewardType": "Progetti di Robotica", "rewardScale": 10, "sensitivity": 9, "baseExecutionTime": 28800 },
            { "id": "jp_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 5, "rc": 2.0, "lcs": 4, "an": 4, "eo": 5, "rl": 5 }, "rewardType": "Account Social Media", "rewardScale": 60000, "sensitivity": 4, "baseExecutionTime": 900 }
        ]
    },
    "Germania": {
        "lat": 51.1657, "lon": 10.4515, "flag": "🇩🇪", "security": 85, "economy": 93, "population": 83,
        "vulnerabilities": ["Industria 4.0 interconnessa", "Leggi sulla privacy stringenti"], "alignment": "White Hat",
        "targets": [
            { "id": "de_datacenter", "name": "Datacenter Francoforte", "type": "Infrastruttura Dati", "req": { "lso": 9, "rc": 3.8, "lcs": 8, "an": 8, "eo": 7, "rl": 2 }, "rewardType": "Credenziali Cloud Aziendali", "rewardScale": 500, "sensitivity": 8, "baseExecutionTime": 18000 },
            { "id": "de_auto", "name": "Industria Automobilistica", "type": "Proprietà Intellettuale", "req": { "lso": 10, "rc": 3.5, "lcs": 6, "an": 7, "eo": 8, "rl": 3 }, "rewardType": "Progetti Auto Elettriche", "rewardScale": 15, "sensitivity": 9, "baseExecutionTime": 25200 },
            { "id": "de_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 6, "rc": 2.5, "lcs": 5, "an": 6, "eo": 5, "rl": 4 }, "rewardType": "Dati Fiscali", "rewardScale": 45000, "sensitivity": 6, "baseExecutionTime": 1200 }
        ]
    },
    "Cina": {
        "lat": 35.8617, "lon": 104.1954, "flag": "🇨🇳", "security": 92, "economy": 98, "population": 1440,
        "vulnerabilities": ["Great Firewall centralizzato", "Vasta rete di sorveglianza"], "alignment": "Black Hat",
        "targets": [
            { "id": "cn_gfw", "name": "Great Firewall", "type": "Infrastruttura Governativa", "req": { "lso": 18, "rc": 4.8, "lcs": 12, "an": 10, "eo": 10, "rl": 1 }, "rewardType": "Chiavi di Cifratura GFW", "rewardScale": 1, "sensitivity": 10, "baseExecutionTime": 172800 },
            { "id": "cn_bank", "name": "Bank of China", "type": "Finanziario", "req": { "lso": 13, "rc": 4.2, "lcs": 9, "an": 11, "eo": 9, "rl": 2 }, "rewardType": "Registri Transazioni Partito", "rewardScale": 1000, "sensitivity": 9, "baseExecutionTime": 54000 },
            { "id": "cn_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 7, "rc": 2.5, "lcs": 3, "an": 2, "eo": 6, "rl": 6 }, "rewardType": "Dati Social Credit", "rewardScale": 200000, "sensitivity": 7, "baseExecutionTime": 600 }
        ]
    },
    "Russia": {
        "lat": 61.5240, "lon": 105.3188, "flag": "🇷🇺", "security": 89, "economy": 75, "population": 145,
        "vulnerabilities": ["Infrastrutture energetiche estese", "Dipendenza da software straniero"], "alignment": "Black Hat",
        "targets": [
            { "id": "ru_kremlin", "name": "Reti del Cremlino", "type": "Infrastruttura Governativa", "req": { "lso": 16, "rc": 4.6, "lcs": 10, "an": 12, "eo": 9, "rl": 1 }, "rewardType": "Comunicazioni Diplomatiche", "rewardScale": 4, "sensitivity": 10, "baseExecutionTime": 129600 },
            { "id": "ru_energy", "name": "Gazprom Network", "type": "Infrastruttura Critica", "req": { "lso": 12, "rc": 4.0, "lcs": 7, "an": 9, "eo": 8, "rl": 3 }, "rewardType": "Mappe Gasdotti", "rewardScale": 20, "sensitivity": 8, "baseExecutionTime": 36000 },
            { "id": "ru_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 6, "rc": 2.3, "lcs": 2, "an": 3, "eo": 5, "rl": 6 }, "rewardType": "Dati Passaporti", "rewardScale": 80000, "sensitivity": 5, "baseExecutionTime": 720 }
        ]
    },
    "Israele": {
        "lat": 31.0461, "lon": 34.8516, "flag": "🇮🇱", "security": 95, "economy": 85, "population": 9,
        "vulnerabilities": ["Alta concentrazione di startup tech", "Costante stato di allerta cyber"], "alignment": "Grey Hat",
        "targets": [
            { "id": "il_mossad", "name": "Server del Mossad", "type": "Intelligence", "req": { "lso": 19, "rc": 5.0, "lcs": 14, "an": 15, "eo": 10, "rl": 0 }, "rewardType": "Identità Agenti Sotto Copertura", "rewardScale": 1, "sensitivity": 10, "baseExecutionTime": 259200 },
            { "id": "il_tech", "name": "Silicon Wadi Startups", "type": "Proprietà Intellettuale", "req": { "lso": 11, "rc": 3.9, "lcs": 8, "an": 9, "eo": 8, "rl": 3 }, "rewardType": "Codice Sorgente Startup", "rewardScale": 30, "sensitivity": 8, "baseExecutionTime": 21600 },
            { "id": "il_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 7, "rc": 2.8, "lcs": 6, "an": 7, "eo": 6, "rl": 4 }, "rewardType": "Dati Militari di Leva", "rewardScale": 5000, "sensitivity": 7, "baseExecutionTime": 1800 }
        ]
    },
    "Brasile": {
        "lat": -14.2350, "lon": -51.9253, "flag": "🇧🇷", "security": 55, "economy": 65, "population": 212,
        "vulnerabilities": ["Disparità di accesso digitale", "Reti bancarie vulnerabili a frodi"], "alignment": "Grey Hat",
        "targets": [
            { "id": "br_bank", "name": "Sistema Bancario Centrale", "type": "Finanziario", "req": { "lso": 8, "rc": 2.9, "lcs": 5, "an": 6, "eo": 7, "rl": 5 }, "rewardType": "Dati Carte di Credito Clonate", "rewardScale": 15000, "sensitivity": 6, "baseExecutionTime": 7200 },
            { "id": "br_gov", "name": "Dati Elettorali", "type": "Dati Sensibili", "req": { "lso": 9, "rc": 3.1, "lcs": 6, "an": 7, "eo": 6, "rl": 4 }, "rewardType": "Registri di Voto", "rewardScale": 20000, "sensitivity": 7, "baseExecutionTime": 10800 },
            { "id": "br_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 4, "rc": 1.5, "lcs": 1, "an": 2, "eo": 4, "rl": 7 }, "rewardType": "Account Social Media", "rewardScale": 100000, "sensitivity": 3, "baseExecutionTime": 300 }
        ]
    },
    "India": {
        "lat": 20.5937, "lon": 78.9629, "flag": "🇮n", "security": 68, "economy": 88, "population": 1380,
        "vulnerabilities": ["Vasta infrastruttura IT (Outsourcing)", "Rapida digitalizzazione senza sicurezza adeguata"], "alignment": "Grey Hat",
        "targets": [
            { "id": "in_tech", "name": "Hub IT di Bangalore", "type": "Infrastruttura Dati", "req": { "lso": 9, "rc": 3.2, "lcs": 6, "an": 7, "eo": 8, "rl": 4 }, "rewardType": "Dati Clienti Internazionali", "rewardScale": 8000, "sensitivity": 7, "baseExecutionTime": 14400 },
            { "id": "in_aadhaar", "name": "Database Biometrico (Aadhaar)", "type": "Dati Sensibili", "req": { "lso": 14, "rc": 4.0, "lcs": 9, "an": 10, "eo": 7, "rl": 2 }, "rewardType": "Dati Biometrici", "rewardScale": 500000, "sensitivity": 9, "baseExecutionTime": 86400 },
            { "id": "in_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 5, "rc": 1.9, "lcs": 2, "an": 3, "eo": 5, "rl": 6 }, "rewardType": "Numeri di Telefono", "rewardScale": 1000000, "sensitivity": 3, "baseExecutionTime": 480 }
        ]
    },
    "Australia": {
        "lat": -25.2744, "lon": 133.7751, "flag": "🇦🇺", "security": 82, "economy": 85, "population": 25,
        "vulnerabilities": ["Infrastrutture remote e isolate", "Dipendenza da cavi sottomarini"], "alignment": "White Hat",
        "targets": [
            { "id": "au_gov", "name": "Parlamento (Canberra)", "type": "Infrastruttura Governativa", "req": { "lso": 10, "rc": 3.6, "lcs": 8, "an": 9, "eo": 7, "rl": 3 }, "rewardType": "Legislazioni in Bozza", "rewardScale": 10, "sensitivity": 6, "baseExecutionTime": 32400 },
            { "id": "au_mining", "name": "Industria Mineraria", "type": "Infrastruttura Critica", "req": { "lso": 9, "rc": 3.3, "lcs": 6, "an": 8, "eo": 8, "rl": 4 }, "rewardType": "Mappe Risorse Naturali", "rewardScale": 50, "sensitivity": 8, "baseExecutionTime": 18000 },
            { "id": "au_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 6, "rc": 2.4, "lcs": 5, "an": 6, "eo": 5, "rl": 4 }, "rewardType": "Dati Sanitari", "rewardScale": 15000, "sensitivity": 6, "baseExecutionTime": 1500 }
        ]
    },
    "Corea del Sud": {
        "lat": 35.9078, "lon": 127.7669, "flag": "🇰🇷", "security": 91, "economy": 90, "population": 51,
        "vulnerabilities": ["Altissima densità di connessione", "Tensione geopolitica costante"], "alignment": "White Hat",
        "targets": [
            { "id": "sk_samsung", "name": "R&D Samsung", "type": "Proprietà Intellettuale", "req": { "lso": 12, "rc": 4.1, "lcs": 9, "an": 10, "eo": 9, "rl": 2 }, "rewardType": "Prototipi Smartphone", "rewardScale": 5, "sensitivity": 9, "baseExecutionTime": 43200 },
            { "id": "sk_gov", "name": "Blue House Network", "type": "Infrastruttura Governativa", "req": { "lso": 13, "rc": 4.3, "lcs": 10, "an": 11, "eo": 8, "rl": 2 }, "rewardType": "Strategie Difesa Nazionale", "rewardScale": 3, "sensitivity": 10, "baseExecutionTime": 64800 },
            { "id": "sk_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 7, "rc": 2.9, "lcs": 6, "an": 7, "eo": 6, "rl": 3 }, "rewardType": "Dati di Gioco Online", "rewardScale": 35000, "sensitivity": 4, "baseExecutionTime": 1200 }
        ]
    },
    "Svizzera": {
        "lat": 46.8182, "lon": 8.2275, "flag": "🇨🇭", "security": 94, "economy": 96, "population": 8,
        "vulnerabilities": ["Hub finanziario globale", "Neutralità politica"], "alignment": "White Hat",
        "targets": [
            { "id": "ch_banks", "name": "Caveau Banche Svizzere", "type": "Finanziario", "req": { "lso": 15, "rc": 4.7, "lcs": 13, "an": 14, "eo": 8, "rl": 1 }, "rewardType": "Numeri Conti Segreti", "rewardScale": 100, "sensitivity": 10, "baseExecutionTime": 172800 },
            { "id": "ch_cern", "name": "Datacenter CERN", "type": "Ricerca Scientifica", "req": { "lso": 14, "rc": 4.5, "lcs": 11, "an": 12, "eo": 9, "rl": 2 }, "rewardType": "Dati Esperimenti Fisici", "rewardScale": 2, "sensitivity": 9, "baseExecutionTime": 108000 },
            { "id": "ch_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 8, "rc": 3.0, "lcs": 7, "an": 8, "eo": 6, "rl": 3 }, "rewardType": "Dati Assicurativi", "rewardScale": 6000, "sensitivity": 6, "baseExecutionTime": 2700 }
        ]
    },
    "Iran": {
        "lat": 32.4279, "lon": 53.6880, "flag": "🇮🇷", "security": 75, "economy": 50, "population": 84,
        "vulnerabilities": ["Rete nazionale isolata (Halal Internet)", "Infrastrutture nucleari"], "alignment": "Black Hat",
        "targets": [
            { "id": "ir_nuclear", "name": "Programma Nucleare", "type": "Infrastruttura Critica", "req": { "lso": 17, "rc": 4.8, "lcs": 11, "an": 13, "eo": 10, "rl": 0 }, "rewardType": "Dati Arricchimento Uranio", "rewardScale": 1, "sensitivity": 10, "baseExecutionTime": 216000 },
            { "id": "ir_gov", "name": "Guardiani della Rivoluzione", "type": "Intelligence", "req": { "lso": 16, "rc": 4.6, "lcs": 10, "an": 12, "eo": 9, "rl": 1 }, "rewardType": "Piani Operativi Esterni", "rewardScale": 3, "sensitivity": 10, "baseExecutionTime": 144000 },
            { "id": "ir_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 6, "rc": 2.1, "lcs": 3, "an": 4, "eo": 5, "rl": 6 }, "rewardType": "Log Accesso Internet", "rewardScale": 50000, "sensitivity": 5, "baseExecutionTime": 900 }
        ]
    },
    "Nigeria": {
        "lat": 9.0820, "lon": 8.6753, "flag": "🇳🇬", "security": 40, "economy": 60, "population": 206,
        "vulnerabilities": ["Infrastruttura internet in via di sviluppo", "Alta incidenza di frodi online (419 scams)"], "alignment": "Grey Hat",
        "targets": [
            { "id": "ng_oil", "name": "Industria Petrolifera", "type": "Infrastruttura Critica", "req": { "lso": 7, "rc": 2.5, "lcs": 4, "an": 5, "eo": 6, "rl": 5 }, "rewardType": "Dati Produzione Petrolio", "rewardScale": 100, "sensitivity": 7, "baseExecutionTime": 5400 },
            { "id": "ng_banks", "name": "Sistemi Bancari Locali", "type": "Finanziario", "req": { "lso": 6, "rc": 2.2, "lcs": 3, "an": 4, "eo": 5, "rl": 6 }, "rewardType": "Liste Clienti Vulnerabili", "rewardScale": 25000, "sensitivity": 6, "baseExecutionTime": 3600 },
            { "id": "ng_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 3, "rc": 1.2, "lcs": 1, "an": 2, "eo": 3, "rl": 8 }, "rewardType": "Contatti Email per Scam", "rewardScale": 150000, "sensitivity": 4, "baseExecutionTime": 300 }
        ]
    },
    "Francia": {
        "lat": 46.2276, "lon": 2.2137, "flag": "🇫🇷", "security": 84, "economy": 88, "population": 65,
        "vulnerabilities": ["Industria del lusso (target di spionaggio)", "Rete TGV centralizzata"], "alignment": "Grey Hat",
        "targets": [
            { "id": "fr_dgse", "name": "DGSE (Intelligence Estera)", "type": "Intelligence", "req": { "lso": 15, "rc": 4.4, "lcs": 11, "an": 13, "eo": 9, "rl": 1 }, "rewardType": "Operazioni in Africa", "rewardScale": 5, "sensitivity": 10, "baseExecutionTime": 79200 },
            { "id": "fr_aerospace", "name": "Airbus R&D", "type": "Proprietà Intellettuale", "req": { "lso": 12, "rc": 4.0, "lcs": 8, "an": 10, "eo": 9, "rl": 3 }, "rewardType": "Progetti Aerei di Nuova Generazione", "rewardScale": 8, "sensitivity": 9, "baseExecutionTime": 50400 },
            { "id": "fr_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 6, "rc": 2.4, "lcs": 5, "an": 6, "eo": 5, "rl": 4 }, "rewardType": "Dati Turistici", "rewardScale": 40000, "sensitivity": 5, "baseExecutionTime": 1080 }
        ]
    },
    "Canada": {
        "lat": 56.1304, "lon": -106.3468, "flag": "🇨🇦", "security": 86, "economy": 87, "population": 38,
        "vulnerabilities": ["Vaste aree a bassa densità", "Infrastrutture energetiche critiche (idroelettrico)"], "alignment": "White Hat",
        "targets": [
            { "id": "ca_csis", "name": "CSIS (Intelligence)", "type": "Intelligence", "req": { "lso": 13, "rc": 4.2, "lcs": 10, "an": 12, "eo": 8, "rl": 2 }, "rewardType": "Dati di Controspionaggio", "rewardScale": 6, "sensitivity": 9, "baseExecutionTime": 72000 },
            { "id": "ca_hydro", "name": "Hydro-Québec", "type": "Infrastruttura Critica", "req": { "lso": 10, "rc": 3.5, "lcs": 7, "an": 9, "eo": 8, "rl": 4 }, "rewardType": "Controllo Rete Elettrica", "rewardScale": 1, "sensitivity": 8, "baseExecutionTime": 28800 },
            { "id": "ca_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 5, "rc": 2.3, "lcs": 5, "an": 7, "eo": 5, "rl": 4 }, "rewardType": "Dati Immigrazione", "rewardScale": 25000, "sensitivity": 6, "baseExecutionTime": 1800 }
        ]
    },
    "Spagna": {
        "lat": 40.4637, "lon": -3.7492, "flag": "🇪🇸", "security": 70, "economy": 75, "population": 47,
        "vulnerabilities": ["Settore turistico altamente digitalizzato", "Infrastrutture portuali"], "alignment": "Grey Hat",
        "targets": [
            { "id": "es_cni", "name": "CNI (Intelligence)", "type": "Intelligence", "req": { "lso": 12, "rc": 3.8, "lcs": 8, "an": 10, "eo": 7, "rl": 3 }, "rewardType": "Informazioni sul Narcotraffico", "rewardScale": 10, "sensitivity": 8, "baseExecutionTime": 57600 },
            { "id": "es_tourism", "name": "Database Turistico Nazionale", "type": "Dati Sensibili", "req": { "lso": 7, "rc": 2.6, "lcs": 5, "an": 6, "eo": 6, "rl": 5 }, "rewardType": "Dati Carte di Credito Turisti", "rewardScale": 30000, "sensitivity": 6, "baseExecutionTime": 9000 },
            { "id": "es_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 5, "rc": 2.0, "lcs": 3, "an": 4, "eo": 5, "rl": 6 }, "rewardType": "Dati Anagrafici", "rewardScale": 35000, "sensitivity": 4, "baseExecutionTime": 600 }
        ]
    },
    "Svezia": {
        "lat": 60.1282, "lon": 18.6435, "flag": "🇸🇪", "security": 88, "economy": 91, "population": 10,
        "vulnerabilities": ["Società altamente digitalizzata (cashless)", "Industria della difesa avanzata"], "alignment": "White Hat",
        "targets": [
            { "id": "se_saab", "name": "SAAB Defence Systems", "type": "Proprietà Intellettuale", "req": { "lso": 13, "rc": 4.3, "lcs": 9, "an": 11, "eo": 9, "rl": 2 }, "rewardType": "Progetti Caccia Gripen", "rewardScale": 4, "sensitivity": 9, "baseExecutionTime": 54000 },
            { "id": "se_bankid", "name": "Sistema BankID", "type": "Infrastruttura Critica", "req": { "lso": 14, "rc": 4.5, "lcs": 11, "an": 12, "eo": 8, "rl": 2 }, "rewardType": "Chiavi di Autenticazione", "rewardScale": 1000, "sensitivity": 8, "baseExecutionTime": 86400 },
            { "id": "se_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 7, "rc": 2.8, "lcs": 6, "an": 8, "eo": 6, "rl": 3 }, "rewardType": "Dati Personali (Personnummer)", "rewardScale": 8000, "sensitivity": 7, "baseExecutionTime": 2400 }
        ]
    },
    "Sudafrica": {
        "lat": -30.5595, "lon": 22.9375, "flag": "🇿🇦", "security": 50, "economy": 62, "population": 59,
        "vulnerabilities": ["Disuguaglianza digitale", "Infrastruttura elettrica instabile (Eskom)"], "alignment": "Grey Hat",
        "targets": [
            { "id": "za_eskom", "name": "Rete Elettrica Eskom", "type": "Infrastruttura Critica", "req": { "lso": 8, "rc": 2.7, "lcs": 4, "an": 5, "eo": 7, "rl": 5 }, "rewardType": "Schemi di Load Shedding", "rewardScale": 1, "sensitivity": 7, "baseExecutionTime": 10800 },
            { "id": "za_mining", "name": "Industria Diamanti e Oro", "type": "Finanziario", "req": { "lso": 9, "rc": 3.0, "lcs": 6, "an": 7, "eo": 8, "rl": 4 }, "rewardType": "Registri di Spedizione", "rewardScale": 200, "sensitivity": 8, "baseExecutionTime": 14400 },
            { "id": "za_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 4, "rc": 1.6, "lcs": 2, "an": 3, "eo": 4, "rl": 7 }, "rewardType": "Dati Bancari", "rewardScale": 40000, "sensitivity": 5, "baseExecutionTime": 900 }
        ]
    },
    "Egitto": {
        "lat": 26.8206, "lon": 30.8025, "flag": "🇪🇬", "security": 60, "economy": 55, "population": 102,
        "vulnerabilities": ["Controllo statale su internet", "Infrastrutture turistiche critiche"], "alignment": "Black Hat",
        "targets": [
            { "id": "eg_suez", "name": "Controllo Canale di Suez", "type": "Infrastruttura Critica", "req": { "lso": 11, "rc": 3.4, "lcs": 6, "an": 8, "eo": 9, "rl": 4 }, "rewardType": "Log di Transito Navi", "rewardScale": 500, "sensitivity": 8, "baseExecutionTime": 36000 },
            { "id": "eg_gov", "name": "Intelligence Generale (Mukhabarat)", "type": "Intelligence", "req": { "lso": 13, "rc": 4.0, "lcs": 8, "an": 10, "eo": 8, "rl": 3 }, "rewardType": "Dati di Sorveglianza Interna", "rewardScale": 10000, "sensitivity": 9, "baseExecutionTime": 64800 },
            { "id": "eg_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 5, "rc": 1.8, "lcs": 2, "an": 4, "eo": 4, "rl": 7 }, "rewardType": "Profili Social Media", "rewardScale": 70000, "sensitivity": 4, "baseExecutionTime": 720 }
        ]
    },
    "Arabia Saudita": {
        "lat": 23.8859, "lon": 45.0792, "flag": "🇸🇦", "security": 78, "economy": 94, "population": 35,
        "vulnerabilities": ["Dipendenza totale dal petrolio", "Censura di internet"], "alignment": "Black Hat",
        "targets": [
            { "id": "sa_aramco", "name": "Saudi Aramco", "type": "Infrastruttura Critica", "req": { "lso": 14, "rc": 4.4, "lcs": 9, "an": 11, "eo": 10, "rl": 2 }, "rewardType": "Dati Riserve Petrolifere", "rewardScale": 1, "sensitivity": 10, "baseExecutionTime": 108000 },
            { "id": "sa_gov", "name": "Ministero degli Interni", "type": "Infrastruttura Governativa", "req": { "lso": 13, "rc": 4.1, "lcs": 8, "an": 12, "eo": 8, "rl": 3 }, "rewardType": "Liste Dissidenti", "rewardScale": 500, "sensitivity": 9, "baseExecutionTime": 72000 },
            { "id": "sa_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 7, "rc": 2.6, "lcs": 4, "an": 5, "eo": 5, "rl": 5 }, "rewardType": "Dati Censura Web", "rewardScale": 20000, "sensitivity": 6, "baseExecutionTime": 1500 }
        ]
    },
    "Messico": {
        "lat": 23.6345, "lon": -102.5528, "flag": "🇲🇽", "security": 52, "economy": 68, "population": 128,
        "vulnerabilities": ["Guerra tra cartelli della droga", "Corruzione governativa"], "alignment": "Grey Hat",
        "targets": [
            { "id": "mx_cartel", "name": "Reti di Comunicazione Cartelli", "type": "Intelligence", "req": { "lso": 9, "rc": 3.2, "lcs": 7, "an": 8, "eo": 7, "rl": 5 }, "rewardType": "Rotta del Narcotraffico", "rewardScale": 50, "sensitivity": 8, "baseExecutionTime": 3600 },
            { "id": "mx_pemex", "name": "Pemex (Compagnia Petrolifera)", "type": "Infrastruttura Critica", "req": { "lso": 8, "rc": 2.8, "lcs": 5, "an": 6, "eo": 8, "rl": 6 }, "rewardType": "Dati di Esplorazione", "rewardScale": 100, "sensitivity": 7, "baseExecutionTime": 5400 },
            { "id": "mx_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 4, "rc": 1.7, "lcs": 2, "an": 3, "eo": 4, "rl": 8 }, "rewardType": "Dati Estorsioni", "rewardScale": 80000, "sensitivity": 5, "baseExecutionTime": 1200 }
        ]
    },
    "Argentina": {
        "lat": -38.4161, "lon": -63.6167, "flag": "🇦🇷", "security": 58, "economy": 52, "population": 45,
        "vulnerabilities": ["Instabilità economica cronica", "Infrastrutture datate"], "alignment": "Grey Hat",
        "targets": [
            { "id": "ar_bank", "name": "Banca Centrale", "type": "Finanziario", "req": { "lso": 9, "rc": 3.0, "lcs": 5, "an": 7, "eo": 8, "rl": 5 }, "rewardType": "Dati Riserve Valutarie", "rewardScale": 1, "sensitivity": 8, "baseExecutionTime": 14400 },
            { "id": "ar_agri", "name": "Industria Agricola", "type": "Proprietà Intellettuale", "req": { "lso": 7, "rc": 2.5, "lcs": 4, "an": 6, "eo": 6, "rl": 6 }, "rewardType": "Dati Genetica Soia", "rewardScale": 50, "sensitivity": 6, "baseExecutionTime": 7200 },
            { "id": "ar_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 4, "rc": 1.8, "lcs": 2, "an": 4, "eo": 4, "rl": 7 }, "rewardType": "Dati Fiscali", "rewardScale": 30000, "sensitivity": 5, "baseExecutionTime": 600 }
        ]
    },
    "Turchia": {
        "lat": 38.9637, "lon": 35.2433, "flag": "🇹🇷", "security": 72, "economy": 65, "population": 84,
        "vulnerabilities": ["Posizione geopolitica strategica", "Controllo dei media"], "alignment": "Grey Hat",
        "targets": [
            { "id": "tr_mit", "name": "MIT (Intelligence Nazionale)", "type": "Intelligence", "req": { "lso": 14, "rc": 4.2, "lcs": 9, "an": 11, "eo": 8, "rl": 2 }, "rewardType": "Operazioni in Siria", "rewardScale": 8, "sensitivity": 9, "baseExecutionTime": 90000 },
            { "id": "tr_drones", "name": "Industria Droni Bayraktar", "type": "Proprietà Intellettuale", "req": { "lso": 12, "rc": 4.0, "lcs": 8, "an": 10, "eo": 9, "rl": 3 }, "rewardType": "Schemi Droni Militari", "rewardScale": 5, "sensitivity": 9, "baseExecutionTime": 57600 },
            { "id": "tr_population", "name": "Popolazione Generale", "type": "Civile", "req": { "lso": 6, "rc": 2.2, "lcs": 3, "an": 5, "eo": 5, "rl": 6 }, "rewardType": "Dati Censura Social Media", "rewardScale": 60000, "sensitivity": 5, "baseExecutionTime": 900 }
        ]
    }
};
