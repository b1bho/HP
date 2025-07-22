/**
 * js/world_targets_data.js
 * VERSIONE AGGIORNATA: Aggiunti TIER e CONDIZIONI DI SBLOCCO a ogni target.
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
    // --- TIER 1 (Iniziali - Sbloccati con la Scansione Globale) ---
    "generic_population": {
        id: "generic_population", name: "Popolazione Generale", ipAddress: "100.64.0.0/10",
        category: "population", req: { lso: 4, rc: 1.8, lcs: 2, an: 3, eo: 4, rl: 6 },
        rewardType: "Dati Anagrafici", rewardScale: 30000, sensitivity: 4, baseExecutionTime: 600,
        tier: 1,
        unlock_conditions: [] // Sbloccato di default con la pagina del mondo
    },

    // --- TIER 2 (Intermedi) ---
    "generic_regional_bank": {
        id: "generic_regional_bank", name: "Banca Commerciale Regionale", ipAddress: "172.21.10.5",
        category: "financial", req: { lso: 6, rc: 2.5, lcs: 4, an: 5, eo: 6, rl: 5 },
        rewardType: "Dati Carte di Credito", rewardScale: 10000, sensitivity: 6, baseExecutionTime: 3600,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 5 }]
    },
    "generic_isp": {
        id: "generic_isp", name: "Provider Internet Nazionale", ipAddress: "198.51.100.1",
        category: "communication", req: { lso: 7, rc: 2.8, lcs: 4, an: 6, eo: 8, rl: 4 },
        rewardType: "Log di Traffico Utenti", rewardScale: 5000, sensitivity: 6, baseExecutionTime: 5400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 7 }, { type: "TALENT", value: "Networking (Net)_LV1" }]
    },
    "it_gov": { 
        id: "it_gov", name: "Server Governativi", ipAddress: "212.48.24.25", category: "government", 
        req: { lso: 7, rc: 2.5, lcs: 5, an: 6, eo: 4, rl: 3 }, rewardType: "Comunicazioni Ministeriali", 
        rewardScale: 5, sensitivity: 7, baseExecutionTime: 10800,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 8 }]
    },
    
    // --- TIER 3 (Avanzati) ---
    "generic_power_plant": {
        id: "generic_power_plant", name: "Centrale Elettrica Locale", ipAddress: "10.200.5.1",
        category: "energy", req: { lso: 8, rc: 3.0, lcs: 5, an: 6, eo: 7, rl: 4 },
        rewardType: "Controllo Rete Elettrica Locale", rewardScale: 1, sensitivity: 7, baseExecutionTime: 7200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 12 }, { type: "TALENT", value: "Networking (Net)_LV2" }]
    },
    "generic_hospital": {
        id: "generic_hospital", name: "Sistema Sanitario Regionale", ipAddress: "192.0.2.123",
        category: "public", req: { lso: 8, rc: 3.0, lcs: 7, an: 8, eo: 6, rl: 4 },
        rewardType: "Cartelle Cliniche", rewardScale: 10000, sensitivity: 8, baseExecutionTime: 14400,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 15 }, { type: "TALENT", value: "SQL_LV2" }]
    },
    "usa_wallstreet": { 
        id: "usa_wallstreet", name: "Borsa di Wall Street", ipAddress: "72.21.206.6", category: "financial", 
        req: { lso: 12, rc: 4.0, lcs: 8, an: 10, eo: 10, rl: 2 }, rewardType: "Dati Finanziari Top-Tier", 
        rewardScale: 500, sensitivity: 9, baseExecutionTime: 43200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 18 }, { type: "TALENT", value: "SQL_LV3" }]
    },

    // --- TIER 4 (Elite) ---
    "usa_pentagon": { 
        id: "usa_pentagon", name: "Pentagono", ipAddress: "208.111.153.100", category: "government", 
        req: { lso: 15, rc: 4.5, lcs: 10, an: 12, eo: 8, rl: 0 }, rewardType: "Informazioni Governative Riservate", 
        rewardScale: 1, sensitivity: 10, baseExecutionTime: 86400,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 25 }, { type: "TALENT", value: "Exploit Development_LV2" }]
    },
    "il_mossad_hq": { 
        id: "il_mossad_hq", name: "Quartier Generale Mossad", ipAddress: "82.80.11.18", category: "government", 
        req: { lso: 19, rc: 5.0, lcs: 14, an: 15, eo: 10, rl: 0 }, rewardType: "Identità Agenti Sotto Copertura", 
        rewardScale: 1, sensitivity: 10, baseExecutionTime: 259200,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 30 }, { type: "TALENT", value: "Stealth_LV3" }, { type: "TALENT", value: "Social Engineering (SocEng)_LV4" }]
    },
     "dns_root_server": {
        id: "dns_root_server", name: "DNS Root Server (Simulato)", ipAddress: "199.7.83.42", category: "network_nodes",
        lat: 48.8566, lon: 2.3522, req: { lso: 20, rc: 5.0, lcs: 15, an: 15, eo: 10, rl: 0 },
        rewardType: "Chiavi DNS Globali", rewardScale: 1, sensitivity: 10, baseExecutionTime: 300000,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 35 }, { type: "TALENT", value: "Exploit Development_LV3" }]
    }
};
