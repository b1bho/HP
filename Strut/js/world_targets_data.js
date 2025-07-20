/**
 * js/world_targets_data.js
 * NUOVO FILE: Contiene il database espanso di tutti i target attaccabili,
 * suddivisi per categorie e con nodi di rete globali.
 */

const targetCategories = {
    "financial": { name: "Istituzioni Finanziarie", icon: "fas fa-landmark" },
    "energy": { name: "Infrastrutture Energetiche", icon: "fas fa-bolt" },
    "transport": { name: "Infrastrutture di Trasporto", icon: "fas fa-plane-departure" },
    "communication": { name: "Infrastrutture di Comunicazione", icon: "fas fa-satellite-dish" },
    "public": { name: "Servizi Pubblici Essenziali", icon: "fas fa-hospital" },
    "government": { name: "Enti Governativi e Difesa", icon: "fas fa-shield-alt" },
    "industry": { name: "Ricerca e Industria", icon: "fas fa-industry" },
    "population": { name: "Popolazione Civile", icon: "fas fa-users" },
    "network_nodes": { name: "Nodi di Rete Globali", icon: "fas fa-globe" }
};

const worldTargets = {
    // --- TARGET GENERICI (Disponibili per quasi tutte le nazioni) ---
    "generic_regional_bank": {
        id: "generic_regional_bank",
        name: "Banca Commerciale Regionale",
        category: "financial",
        req: { lso: 6, rc: 2.5, lcs: 4, an: 5, eo: 6, rl: 5 },
        rewardType: "Dati Carte di Credito",
        rewardScale: 10000,
        sensitivity: 6,
        baseExecutionTime: 3600
    },
    "generic_power_plant": {
        id: "generic_power_plant",
        name: "Centrale Elettrica Locale",
        category: "energy",
        req: { lso: 8, rc: 3.0, lcs: 5, an: 6, eo: 7, rl: 4 },
        rewardType: "Controllo Rete Elettrica Locale",
        rewardScale: 1,
        sensitivity: 7,
        baseExecutionTime: 7200
    },
    "generic_isp": {
        id: "generic_isp",
        name: "Provider Internet Nazionale",
        category: "communication",
        req: { lso: 7, rc: 2.8, lcs: 4, an: 6, eo: 8, rl: 4 },
        rewardType: "Log di Traffico Utenti",
        rewardScale: 5000,
        sensitivity: 6,
        baseExecutionTime: 5400
    },
    "generic_hospital": {
        id: "generic_hospital",
        name: "Sistema Sanitario Regionale",
        category: "public",
        req: { lso: 8, rc: 3.0, lcs: 7, an: 8, eo: 6, rl: 4 },
        rewardType: "Cartelle Cliniche",
        rewardScale: 10000,
        sensitivity: 8,
        baseExecutionTime: 14400
    },
    "generic_population": {
        id: "generic_population",
        name: "Popolazione Generale",
        category: "population",
        req: { lso: 4, rc: 1.8, lcs: 2, an: 3, eo: 4, rl: 6 },
        rewardType: "Dati Anagrafici",
        rewardScale: 30000,
        sensitivity: 4,
        baseExecutionTime: 600
    },

    // --- TARGET SPECIFICI PER NAZIONE ---
    // Cina
"cn_gfw": { id: "cn_gfw", name: "Great Firewall", category: "government", req: { lso: 18, rc: 4.8, lcs: 12, an: 10, eo: 10, rl: 1 }, rewardType: "Chiavi di Cifratura GFW", rewardScale: 1, sensitivity: 10, baseExecutionTime: 172800 },
"cn_shanghai_port": { id: "cn_shanghai_port", name: "Porto di Shanghai", category: "transport", req: { lso: 11, rc: 3.8, lcs: 6, an: 8, eo: 9, rl: 3 }, rewardType: "Dati Logistici Globali", rewardScale: 8000, sensitivity: 8, baseExecutionTime: 45000 },
"cn_bank_of_china": { id: "cn_bank_of_china", name: "Bank of China", category: "financial", req: { lso: 13, rc: 4.2, lcs: 9, an: 11, eo: 9, rl: 2 }, rewardType: "Registri Transazioni Partito", rewardScale: 1000, sensitivity: 9, baseExecutionTime: 54000 },

// Giappone
"jp_tokyo_stock_exchange": { id: "jp_tokyo_stock_exchange", name: "Borsa di Tokyo", category: "financial", req: { lso: 12, rc: 4.1, lcs: 8, an: 10, eo: 11, rl: 2 }, rewardType: "Algoritmi di High-Frequency Trading", rewardScale: 750, sensitivity: 9, baseExecutionTime: 60000 },
"jp_shinkansen_control": { id: "jp_shinkansen_control", name: "Rete Shinkansen", category: "transport", req: { lso: 10, rc: 3.9, lcs: 7, an: 8, eo: 8, rl: 3 }, rewardType: "Dati Controllo Treni", rewardScale: 200, sensitivity: 8, baseExecutionTime: 32000 },

// Francia
"fr_dgse_hq": { id: "fr_dgse_hq", name: "DGSE (Intelligence Estera)", category: "government", req: { lso: 15, rc: 4.4, lcs: 11, an: 13, eo: 9, rl: 1 }, rewardType: "Operazioni in Africa", rewardScale: 5, sensitivity: 10, baseExecutionTime: 79200 },
"fr_nuclear_plant": { id: "fr_nuclear_plant", name: "Centrale Nucleare", category: "energy", req: { lso: 18, rc: 4.9, lcs: 13, an: 12, eo: 10, rl: 0 }, rewardType: "Dati Controllo Reattore", rewardScale: 1, sensitivity: 10, baseExecutionTime: 250000 },

// Canada
"ca_hydro_dam": { id: "ca_hydro_dam", name: "Diga Idroelettrica (Quebec)", category: "energy", req: { lso: 10, rc: 3.5, lcs: 7, an: 9, eo: 8, rl: 4 }, rewardType: "Controllo Rete Elettrica", rewardScale: 1, sensitivity: 8, baseExecutionTime: 28800 },
"ca_csis_hq": { id: "ca_csis_hq", name: "CSIS (Intelligence)", category: "government", req: { lso: 13, rc: 4.2, lcs: 10, an: 12, eo: 8, rl: 2 }, rewardType: "Dati di Controspionaggio", rewardScale: 6, sensitivity: 9, baseExecutionTime: 72000 },

// Brasile
"br_election_system": { id: "br_election_system", name: "Sistema di Voto Elettronico", category: "government", req: { lso: 9, rc: 3.1, lcs: 6, an: 7, eo: 6, rl: 4 }, rewardType: "Registri di Voto", rewardScale: 20000, sensitivity: 7, baseExecutionTime: 10800 },

// India
"in_aadhaar_db": { id: "in_aadhaar_db", name: "Database Biometrico (Aadhaar)", category: "public", req: { lso: 14, rc: 4.0, lcs: 9, an: 10, eo: 7, rl: 2 }, rewardType: "Dati Biometrici", rewardScale: 500000, sensitivity: 9, baseExecutionTime: 86400 },

// Israele
"il_mossad_hq": { id: "il_mossad_hq", name: "Quartier Generale Mossad", category: "government", req: { lso: 19, rc: 5.0, lcs: 14, an: 15, eo: 10, rl: 0 }, rewardType: "Identità Agenti Sotto Copertura", rewardScale: 1, sensitivity: 10, baseExecutionTime: 259200 },
"il_iron_dome": { id: "il_iron_dome", name: "Sistema Iron Dome", category: "government", req: { lso: 17, rc: 4.8, lcs: 12, an: 13, eo: 11, rl: 0 }, rewardType: "Codici di Tracciamento Missilistico", rewardScale: 2, sensitivity: 10, baseExecutionTime: 220000 },

// Arabia Saudita
"sa_aramco_refinery": { id: "sa_aramco_refinery", name: "Raffineria Saudi Aramco", category: "energy", req: { lso: 14, rc: 4.4, lcs: 9, an: 11, eo: 10, rl: 2 }, rewardType: "Dati Riserve Petrolifere", rewardScale: 1, sensitivity: 10, baseExecutionTime: 108000 },

// Turchia
"tr_bayraktar_hq": { id: "tr_bayraktar_hq", name: "Industria Droni Bayraktar", category: "industry", req: { lso: 12, rc: 4.0, lcs: 8, an: 10, eo: 9, rl: 3 }, rewardType: "Schemi Droni Militari", rewardScale: 5, sensitivity: 9, baseExecutionTime: 57600 },

// Sudafrica
"za_eskom_grid": { id: "za_eskom_grid", name: "Rete Elettrica Eskom", category: "energy", req: { lso: 8, rc: 2.7, lcs: 4, an: 5, eo: 7, rl: 5 }, rewardType: "Schemi di Load Shedding", rewardScale: 1, sensitivity: 7, baseExecutionTime: 10800 },

// Australia
"au_mining_corp": { id: "au_mining_corp", name: "Compagnia Mineraria (Pilbara)", category: "industry", req: { lso: 9, rc: 3.3, lcs: 6, an: 8, eo: 8, rl: 4 }, rewardType: "Mappe Risorse Naturali", rewardScale: 50, sensitivity: 8, baseExecutionTime: 18000 },

// Corea del Sud
"sk_samsung_rd": { id: "sk_samsung_rd", name: "Centro R&D Samsung", category: "industry", req: { lso: 12, rc: 4.1, lcs: 9, an: 10, eo: 9, rl: 2 }, rewardType: "Prototipi Smartphone", rewardScale: 5, sensitivity: 9, baseExecutionTime: 43200 },

// Taiwan
"tw_tsmc_fab": { id: "tw_tsmc_fab", name: "Fabbrica Semiconduttori (TSMC)", category: "industry", req: { lso: 15, rc: 4.6, lcs: 11, an: 12, eo: 10, rl: 1 }, rewardType: "Schemi Chip di Nuova Generazione", rewardScale: 3, sensitivity: 10, baseExecutionTime: 160000 },

// Iran
"ir_nuclear_program": { id: "ir_nuclear_program", name: "Programma Nucleare", category: "energy", req: { lso: 17, rc: 4.8, lcs: 11, an: 13, eo: 10, rl: 0 }, rewardType: "Dati Arricchimento Uranio", rewardScale: 1, sensitivity: 10, baseExecutionTime: 216000 },

// Generici di alto livello
"generic_swift_node": { id: "generic_swift_node", name: "Nodo SWIFT", category: "financial", req: { lso: 15, rc: 4.6, lcs: 12, an: 14, eo: 10, rl: 1 }, rewardType: "Log Transazioni Internazionali", rewardScale: 5000, sensitivity: 10, baseExecutionTime: 190000 },
"generic_pharma_lab": { id: "generic_pharma_lab", name: "Laboratorio Farmaceutico", category: "industry", req: { lso: 11, rc: 3.7, lcs: 8, an: 9, eo: 8, rl: 3 }, rewardType: "Formule Farmaceutiche", rewardScale: 100, sensitivity: 9, baseExecutionTime: 65000 },

    // USA
    "usa_pentagon": { id: "usa_pentagon", name: "Pentagono", category: "government", req: { lso: 15, rc: 4.5, lcs: 10, an: 12, eo: 8, rl: 0 }, rewardType: "Informazioni Governative Riservate", rewardScale: 1, sensitivity: 10, baseExecutionTime: 86400 },
    "usa_wallstreet": { id: "usa_wallstreet", name: "Borsa di Wall Street", category: "financial", req: { lso: 12, rc: 4.0, lcs: 8, an: 10, eo: 10, rl: 2 }, rewardType: "Dati Finanziari Top-Tier", rewardScale: 500, sensitivity: 9, baseExecutionTime: 43200 },
    "usa_faa_atc": { id: "usa_faa_atc", name: "Controllo Traffico Aereo (FAA)", category: "transport", req: { lso: 13, rc: 4.2, lcs: 8, an: 11, eo: 9, rl: 1 }, rewardType: "Dati di Volo Nazionali", rewardScale: 100, sensitivity: 9, baseExecutionTime: 64800 },

    // UK
    "uk_mi6": { id: "uk_mi6", name: "MI6 HQ", category: "government", req: { lso: 14, rc: 4.2, lcs: 9, an: 11, eo: 9, rl: 1 }, rewardType: "Dossier di Intelligence", rewardScale: 3, sensitivity: 10, baseExecutionTime: 72000 },
    
    // Italia
    "it_gov": { id: "it_gov", name: "Server Governativi", category: "government", req: { lso: 7, rc: 2.5, lcs: 5, an: 6, eo: 4, rl: 3 }, rewardType: "Comunicazioni Ministeriali", rewardScale: 5, sensitivity: 7, baseExecutionTime: 10800 },
    "it_telecom": { id: "it_telecom", name: "Rete Telecomunicazioni Nazionale", category: "communication", req: { lso: 8, rc: 2.8, lcs: 4, an: 5, eo: 6, rl: 4 }, rewardType: "Log di Traffico", rewardScale: 1000, sensitivity: 6, baseExecutionTime: 7200 },

    // Germania
    "de_datacenter_frankfurt": { id: "de_datacenter_frankfurt", name: "Datacenter Hub (Francoforte)", category: "communication", req: { lso: 9, rc: 3.8, lcs: 8, an: 8, eo: 7, rl: 2 }, rewardType: "Credenziali Cloud Aziendali", rewardScale: 500, sensitivity: 8, baseExecutionTime: 18000 },
    "de_automotive_scada": { id: "de_automotive_scada", name: "Industria Automobilistica (SCADA)", category: "industry", req: { lso: 10, rc: 3.5, lcs: 6, an: 7, eo: 8, rl: 3 }, rewardType: "Progetti Auto Elettriche", rewardScale: 15, sensitivity: 9, baseExecutionTime: 25200 },

    // Russia
    "ru_kremlin": { id: "ru_kremlin", name: "Reti del Cremlino", category: "government", req: { lso: 16, rc: 4.6, lcs: 10, an: 12, eo: 9, rl: 1 }, rewardType: "Comunicazioni Diplomatiche", rewardScale: 4, sensitivity: 10, baseExecutionTime: 129600 },
    "ru_gazprom": { id: "ru_gazprom", name: "Gazprom Network", category: "energy", req: { lso: 12, rc: 4.0, lcs: 7, an: 9, eo: 8, rl: 3 }, rewardType: "Mappe Gasdotti", rewardScale: 20, sensitivity: 8, baseExecutionTime: 36000 },

    // Svizzera
    "ch_swiss_banks": { id: "ch_swiss_banks", name: "Caveau Banche Svizzere", category: "financial", req: { lso: 14, rc: 4.5, lcs: 12, an: 13, eo: 8, rl: 1 }, rewardType: "Numeri Conti Segreti", rewardScale: 100, sensitivity: 10, baseExecutionTime: 172800 },
    "ch_cern": { id: "ch_cern", name: "Datacenter CERN", category: "industry", req: { lso: 14, rc: 4.5, lcs: 11, an: 12, eo: 9, rl: 2 }, rewardType: "Dati Esperimenti Fisici", rewardScale: 2, sensitivity: 9, baseExecutionTime: 108000 },
    
    // --- NODI DI RETE GLOBALI (Sovranazionali) ---
    "ixp_linx_london": {
    id: "ixp_linx_london", name: "LINX (Londra)", category: "network_nodes",
    lat: 51.5074, lon: -0.1278,
    req: { lso: 16, rc: 4.7, lcs: 10, an: 12, eo: 12, rl: 1 },
    rewardType: "Dati di Peering Britannico", rewardScale: 9500, sensitivity: 9, baseExecutionTime: 145000
},
"cloud_azure_dublin": {
    id: "cloud_azure_dublin", name: "Azure Region (Dublino)", category: "network_nodes",
    lat: 53.3498, lon: -6.2603,
    req: { lso: 17, rc: 4.8, lcs: 12, an: 13, eo: 11, rl: 0 },
    rewardType: "Dati Cloud Europei", rewardScale: 24000, sensitivity: 10, baseExecutionTime: 210000
},
"submarine_cable_landing_jp": {
    id: "submarine_cable_landing_jp", name: "Stazione Cavi Sottomarini (Giappone)", category: "network_nodes",
    lat: 35.6895, lon: 139.6917,
    req: { lso: 15, rc: 4.5, lcs: 11, an: 11, eo: 10, rl: 2 },
    rewardType: "Traffico Dati Trans-Pacifico", rewardScale: 15000, sensitivity: 9, baseExecutionTime: 180000
},
    "ixp_de-cix": {
        id: "ixp_de-cix",
        name: "DE-CIX (Francoforte)",
        category: "network_nodes",
        lat: 50.1109, lon: 8.6821,
        req: { lso: 16, rc: 4.7, lcs: 10, an: 12, eo: 12, rl: 1 },
        rewardType: "Flussi di Traffico Globale",
        rewardScale: 10000,
        sensitivity: 9,
        baseExecutionTime: 150000
    },
    "ixp_ams-ix": {
        id: "ixp_ams-ix",
        name: "AMS-IX (Amsterdam)",
        category: "network_nodes",
        lat: 52.3676, lon: 4.9041,
        req: { lso: 16, rc: 4.7, lcs: 10, an: 12, eo: 12, rl: 1 },
        rewardType: "Flussi di Traffico Globale",
        rewardScale: 10000,
        sensitivity: 9,
        baseExecutionTime: 150000
    },
    "cloud_aws_virginia": {
        id: "cloud_aws_virginia",
        name: "AWS Region (N. Virginia)",
        category: "network_nodes",
        lat: 38.8816, lon: -77.4284,
        req: { lso: 17, rc: 4.8, lcs: 12, an: 13, eo: 11, rl: 0 },
        rewardType: "Dati Aziendali Cloud",
        rewardScale: 25000,
        sensitivity: 10,
        baseExecutionTime: 200000
    },
    "dns_root_server": {
        id: "dns_root_server",
        name: "DNS Root Server (Simulato)",
        category: "network_nodes",
        lat: 48.8566, lon: 2.3522, // Posizione simbolica
        req: { lso: 20, rc: 5.0, lcs: 15, an: 15, eo: 10, rl: 0 },
        rewardType: "Chiavi DNS Globali",
        rewardScale: 1,
        sensitivity: 10,
        baseExecutionTime: 300000
    },
    // --- SECONDO BLOCCO DI TARGET AGGIUNTI ---

// Nodi di Rete Globali
"cloud_google_belgium": {
    id: "cloud_google_belgium", name: "Google Cloud Region (Belgio)", category: "network_nodes",
    lat: 50.8503, lon: 4.3517,
    req: { lso: 17, rc: 4.8, lcs: 12, an: 13, eo: 11, rl: 0 },
    rewardType: "Dati Utenti Google Europei", rewardScale: 22000, sensitivity: 10, baseExecutionTime: 215000
},
"submarine_cable_landing_uk": {
    id: "submarine_cable_landing_uk", name: "Stazione Cavi Sottomarini (Cornwall, UK)", category: "network_nodes",
    lat: 50.2660, lon: -5.0527,
    req: { lso: 15, rc: 4.5, lcs: 11, an: 11, eo: 10, rl: 2 },
    rewardType: "Traffico Dati Trans-Atlantico", rewardScale: 16000, sensitivity: 9, baseExecutionTime: 185000
},

// Paesi Bassi
"nl_port_rotterdam": { id: "nl_port_rotterdam", name: "Porto di Rotterdam", category: "transport", req: { lso: 12, rc: 4.0, lcs: 7, an: 9, eo: 10, rl: 2 }, rewardType: "Manifesti di Carico Internazionali", rewardScale: 9000, sensitivity: 8, baseExecutionTime: 50000 },
"nl_asml_hq": { id: "nl_asml_hq", name: "ASML (Litografia EUV)", category: "industry", req: { lso: 16, rc: 4.7, lcs: 12, an: 13, eo: 10, rl: 1 }, rewardType: "Schemi Macchinari Semiconduttori", rewardScale: 2, sensitivity: 10, baseExecutionTime: 190000 },

// Svezia
"se_saab_defence": { id: "se_saab_defence", name: "SAAB Defence Systems", category: "industry", req: { lso: 13, rc: 4.3, lcs: 9, an: 11, eo: 9, rl: 2 }, rewardType: "Progetti Caccia Gripen", rewardScale: 4, sensitivity: 9, baseExecutionTime: 54000 },
"se_bankid_system": { id: "se_bankid_system", name: "Sistema BankID", category: "financial", req: { lso: 14, rc: 4.5, lcs: 11, an: 12, eo: 8, rl: 2 }, rewardType: "Chiavi di Autenticazione Nazionale", rewardScale: 1000, sensitivity: 8, baseExecutionTime: 86400 },

// Spagna
"es_cni_intel": { id: "es_cni_intel", name: "CNI (Intelligence)", category: "government", req: { lso: 12, rc: 3.8, lcs: 8, an: 10, eo: 7, rl: 3 }, rewardType: "Informazioni sul Narcotraffico", rewardScale: 10, sensitivity: 8, baseExecutionTime: 57600 },
"es_tourism_db": { id: "es_tourism_db", name: "Database Turistico Nazionale", category: "public", req: { lso: 7, rc: 2.6, lcs: 5, an: 6, eo: 6, rl: 5 }, rewardType: "Dati Carte di Credito Turisti", rewardScale: 30000, sensitivity: 6, baseExecutionTime: 9000 },

// Messico
"mx_cartel_comms": { id: "mx_cartel_comms", name: "Reti di Comunicazione Cartelli", category: "government", req: { lso: 9, rc: 3.2, lcs: 7, an: 8, eo: 7, rl: 5 }, rewardType: "Rotta del Narcotraffico", rewardScale: 50, sensitivity: 8, baseExecutionTime: 3600 },
"mx_pemex_oil": { id: "mx_pemex_oil", name: "Pemex (Compagnia Petrolifera)", category: "energy", req: { lso: 8, rc: 2.8, lcs: 5, an: 6, eo: 8, rl: 6 }, rewardType: "Dati di Esplorazione", rewardScale: 100, sensitivity: 7, baseExecutionTime: 5400 },

// Nigeria
"ng_oil_industry": { id: "ng_oil_industry", name: "Industria Petrolifera", category: "energy", req: { lso: 7, rc: 2.5, lcs: 4, an: 5, eo: 6, rl: 5 }, rewardType: "Dati Produzione Petrolio", rewardScale: 100, sensitivity: 7, baseExecutionTime: 5400 },
"ng_banking_system": { id: "ng_banking_system", name: "Sistemi Bancari Locali", category: "financial", req: { lso: 6, rc: 2.2, lcs: 3, an: 4, eo: 5, rl: 6 }, rewardType: "Liste Clienti Vulnerabili", rewardScale: 25000, sensitivity: 6, baseExecutionTime: 3600 },

// Egitto
"eg_suez_control": { id: "eg_suez_control", name: "Controllo Canale di Suez", category: "transport", req: { lso: 11, rc: 3.4, lcs: 6, an: 8, eo: 9, rl: 4 }, rewardType: "Log di Transito Navi", rewardScale: 500, sensitivity: 8, baseExecutionTime: 36000 },
"eg_mukhabarat_hq": { id: "eg_mukhabarat_hq", name: "Intelligence Generale (Mukhabarat)", category: "government", req: { lso: 13, rc: 4.0, lcs: 8, an: 10, eo: 8, rl: 3 }, rewardType: "Dati di Sorveglianza Interna", rewardScale: 10000, sensitivity: 9, baseExecutionTime: 64800 },

// Norvegia
"no_seed_vault": { id: "no_seed_vault", name: "Global Seed Vault (Svalbard)", category: "industry", req: { lso: 12, rc: 4.1, lcs: 10, an: 11, eo: 7, rl: 2 }, rewardType: "Mappatura Genetica Agricola", rewardScale: 5, sensitivity: 8, baseExecutionTime: 95000 },
"no_oil_platform": { id: "no_oil_platform", name: "Piattaforma Petrolifera (Statoil)", category: "energy", req: { lso: 13, rc: 4.3, lcs: 8, an: 10, eo: 9, rl: 2 }, rewardType: "Dati di Trivellazione Offshore", rewardScale: 150, sensitivity: 8, baseExecutionTime: 78000 },

// Singapore
"sg_port_authority": { id: "sg_port_authority", name: "Autorità Portuale di Singapore", category: "transport", req: { lso: 13, rc: 4.2, lcs: 9, an: 10, eo: 11, rl: 2 }, rewardType: "Dati Movimento Flotte Globali", rewardScale: 7000, sensitivity: 8, baseExecutionTime: 62000 },
"sg_mas_financial": { id: "sg_mas_financial", name: "Autorità Monetaria di Singapore (MAS)", category: "financial", req: { lso: 14, rc: 4.4, lcs: 11, an: 12, eo: 9, rl: 1 }, rewardType: "Dati Riserve Valutarie", rewardScale: 200, sensitivity: 9, baseExecutionTime: 110000 },

// Emirati Arabi Uniti
"ae_burj_khalifa_scada": { id: "ae_burj_khalifa_scada", name: "SCADA Burj Khalifa", category: "public", req: { lso: 10, rc: 3.6, lcs: 7, an: 8, eo: 8, rl: 3 }, rewardType: "Controllo Sistemi Edificio", rewardScale: 1, sensitivity: 7, baseExecutionTime: 48000 },
"ae_dubai_financial_market": { id: "ae_dubai_financial_market", name: "Borsa di Dubai", category: "financial", req: { lso: 11, rc: 3.9, lcs: 8, an: 10, eo: 10, rl: 3 }, rewardType: "Dati Transazioni Petrolifere", rewardScale: 3000, sensitivity: 8, baseExecutionTime: 55000 },

// Corea del Nord
"kp_bureau_121": { id: "kp_bureau_121", name: "Bureau 121 (Guerra Cibernetica)", category: "government", req: { lso: 16, rc: 4.5, lcs: 10, an: 14, eo: 9, rl: 1 }, rewardType: "Toolkit di Hacking Statali", rewardScale: 3, sensitivity: 10, baseExecutionTime: 280000 },
"kp_national_intranet": { id: "kp_national_intranet", name: "Intranet Nazionale 'Kwangmyong'", category: "communication", req: { lso: 9, rc: 3.0, lcs: 5, an: 8, eo: 4, rl: 4 }, rewardType: "Log di Navigazione Utenti", rewardScale: 1000, sensitivity: 5, baseExecutionTime: 15000 },

// Generici di alto livello
"generic_who_database": { id: "generic_who_database", name: "Database Organizzazione Mondiale Sanità", category: "public", req: { lso: 14, rc: 4.3, lcs: 11, an: 12, eo: 8, rl: 1 }, rewardType: "Dati Ricerca Virologica", rewardScale: 10, sensitivity: 9, baseExecutionTime: 130000 },
"generic_satellite_network": { id: "generic_satellite_network", name: "Rete Satellitare Commerciale", category: "communication", req: { lso: 13, rc: 4.1, lcs: 9, an: 11, eo: 10, rl: 2 }, rewardType: "Dati di Geolocalizzazione Globale", rewardScale: 5000, sensitivity: 8, baseExecutionTime: 90000 },
"generic_ca_root": { id: "generic_ca_root", name: "Server Root Certificate Authority", category: "communication", req: { lso: 18, rc: 4.9, lcs: 14, an: 14, eo: 9, rl: 0 }, rewardType: "Chiavi Private CA", rewardScale: 1, sensitivity: 10, baseExecutionTime: 260000 }
};
