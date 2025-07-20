// File: js/main.js
// VERSIONE AGGIORNATA CON ECONOMIA DINAMICA

// --- STATO GLOBALE ---
let state = {
    talentPoints: 5,
    btc: 0.1, // Il giocatore ora possiede frazioni di BTC
    xmr: 10,
    btcValueInUSD: 65000, // Valore iniziale di 1 BTC in USD
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    unlocked: {},
    studying: {},
    hackerName: 'Anon',
    morality: 0,
    identity: {
        hacked: false,
        traces: 3,
        investigatedBy: 'Nessuno',
        suspicion: 15
    },
    storage: {
        personalMax: 100,
        personalUsed: 0
    },
    dataLocker: {
        personal: [],
        clan: []
    },
    intelItems: [],
    activeAttacks: [],
    activeQuests: [], 
    completedQuests: [],
    activePage: 'hq',
    activeProfileSection: 'talents',
    savedFlows: {},
    ownedHardware: {},
    clan: null,
    hardwareBonuses: {
        studyTimeModifier: 1,
        toolStatModifiers: { rc: 0, eo: 0, an: 0, rl: 0 }
    },
    clanBonuses: {
        studyTimeModifier: 1,
        toolStatModifiers: { rc: 0, eo: 0, an: 0, rl: 0 }
    },
    news: []
};

let lines = [];
let startSocket = null;
const QUEST_CHECK_INTERVAL_MS = 15000; 
const NEWS_TICKER_INTERVAL_MS = 8000;
const BTC_VALUE_UPDATE_INTERVAL_MS = 30000;

const appContainer = document.getElementById('app-container');
const btcBalanceEl = document.getElementById('btc-balance');
const xmrBalanceEl = document.getElementById('xmr-balance');
const talentPointsEl = document.getElementById('talent-points');
const resetButton = document.getElementById('reset-button');
const navButtons = document.querySelectorAll('.nav-btn');

// --- NUOVA FUNZIONE PER L'ECONOMIA ---
function updateBTCValue() {
    const volatility = 0.05; // Variazione massima del 5%
    const changePercent = (Math.random() * volatility * 2) - volatility;
    state.btcValueInUSD *= (1 + changePercent);
    
    if (state.btcValueInUSD < 10000) state.btcValueInUSD = 10000;

    updateUI();
    if (state.activePage === 'market') {
        renderMarket();
    }
    if (state.activePage === 'hq') {
        renderQuestBoard();
    }
}

function saveState() {
    localStorage.setItem('hackerAppState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('hackerAppState');
    if (savedState) {
        const loadedState = JSON.parse(savedState);
        state = { ...state, ...loadedState };

        if (!Array.isArray(state.intelItems)) state.intelItems = [];
        if (!Array.isArray(state.news)) state.news = [];
        if (!state.dataLocker || !Array.isArray(state.dataLocker.personal)) state.dataLocker = { personal: [], clan: [] };
        if (typeof state.btcValueInUSD !== 'number') state.btcValueInUSD = 65000;
    }
}

function resetState() {
    if (confirm('Sei sicuro di voler resettare tutti i progressi? Questa azione è irreversibile.')) {
        localStorage.removeItem('hackerAppState');
        window.location.reload();
    }
}

function destroyLines() {
    lines.forEach(line => line.remove());
    lines = [];
}

async function switchPage(pageName) {
    if (!pageName) return;
    state.activePage = pageName;
    destroyLines();
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageName);
    });
    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`Pagina non trovata: ${pageName}.html`);
        appContainer.innerHTML = await response.text();
        switch (pageName) {
            case 'hq': initHqPage(); break;
            case 'profile': initProfilePage(); break;
            case 'editor': initEditorPage(); break;
            case 'world': initWorldPage(); break;
            case 'market': initMarketPage(); break;
            case 'dark_market': initDarkMarketPage(); break;
            case 'intelligence_console': initIntelligencePage(); break;
        }
    } catch (error) {
        console.error("Errore nel caricamento della pagina:", error);
        appContainer.innerHTML = `<p class="text-center text-red-500">Errore: Impossibile caricare la sezione ${pageName}.</p>`;
    }
    saveState();
}

function updateUI() {
    btcBalanceEl.textContent = state.btc.toFixed(6); 
    xmrBalanceEl.textContent = state.xmr;
    talentPointsEl.textContent = state.talentPoints;

    const btcValueEl = document.getElementById('btc-value');
    if (btcValueEl) {
        btcValueEl.textContent = `$${state.btcValueInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const playerLevelEl = document.getElementById('player-level');
    const playerXpEl = document.getElementById('player-xp');
    const playerXpNextEl = document.getElementById('player-xp-next');
    const playerXpFillEl = document.getElementById('player-xp-bar-fill');
    if (playerLevelEl) {
        playerLevelEl.textContent = state.level;
        playerXpEl.textContent = state.xp;
        playerXpNextEl.textContent = state.xpToNextLevel;
        playerXpFillEl.style.width = `${(state.xp / state.xpToNextLevel) * 100}%`;
    }
    const dynamicNavContainer = document.getElementById('dynamic-nav-container');
    if (dynamicNavContainer) {
        const existingBtn = dynamicNavContainer.querySelector('button');
        if (state.clan && state.clan.darkMarket) {
            if (!existingBtn) {
                dynamicNavContainer.innerHTML = `<button data-page="dark_market" class="nav-btn px-3 py-2 font-semibold text-gray-300"><i class="fas fa-spider mr-2"></i>Dark Market</button>`;
                dynamicNavContainer.querySelector('button').addEventListener('click', () => switchPage('dark_market'));
            }
        } else {
            dynamicNavContainer.innerHTML = '';
        }
    }
    if (typeof updateAdminPanelUI === 'function') {
        updateAdminPanelUI();
    }
}

function addXp(amount, target = 'player') {
    if (target === 'player') {
        state.xp += amount;
        while (state.xp >= state.xpToNextLevel) {
            state.level++;
            state.xp -= state.xpToNextLevel;
            state.xpToNextLevel = Math.floor(state.xpToNextLevel * 1.5);
            state.talentPoints += 1;
        }
    } else if (target === 'clan' && state.clan) {
        state.clan.xp += amount;
        while (state.clan.xp >= state.clan.xpToNextLevel) {
            state.clan.level++;
            state.clan.xp -= state.clan.xpToNextLevel;
            state.clan.xpToNextLevel = Math.floor(state.clan.xpToNextLevel * 2);
        }
        if (state.activePage === 'profile' && state.activeProfileSection === 'clan') {
            renderClanSection();
        }
    }
    updateUI();
}

function updateAllBonuses() {
    state.hardwareBonuses = { studyTimeModifier: 1, toolStatModifiers: { rc: 0, eo: 0, an: 0, rl: 0 } };
    state.clanBonuses = { studyTimeModifier: 1, toolStatModifiers: { rc: 0, eo: 0, an: 0, rl: 0 } };
    const allPersonalItems = [...marketData.personalHardware, ...marketData.personalInfrastructure];
    for (const itemId in state.ownedHardware) {
        if (state.ownedHardware[itemId]) {
            const item = allPersonalItems.find(i => i.id === itemId);
            if (item && item.bonus) {
                if (item.bonus.type === 'studyTime') state.hardwareBonuses.studyTimeModifier *= item.bonus.value;
                else if (item.bonus.type === 'toolStat') {
                    state.hardwareBonuses.toolStatModifiers[item.bonus.stat] += item.bonus.value;
                }
            }
        }
    }
    if (state.clan) {
        for (const infraId in state.clan.infrastructure) {
            const infraState = state.clan.infrastructure[infraId];
            if (infraId === 'servers') continue;
            const infraData = marketData.clanInfrastructure[infraId];
            if (infraState && infraData && infraData.tiers) {
                const currentTier = infraData.tiers[infraState.tier - 1];
                if (currentTier && currentTier.bonus) {
                   if (currentTier.bonus.type === 'studyTime') state.clanBonuses.studyTimeModifier *= currentTier.bonus.value;
                   else if (currentTier.bonus.type === 'toolStat') {
                       state.clanBonuses.toolStatModifiers[currentTier.bonus.stat] += currentTier.bonus.value;
                   }
                }
            }
        }
    }
}

function updateClanEcosystemScore() {
    if (!state.clan) return;
    let securityScore = 0;
    let capacityScore = 0;
    for (const infraId in state.clan.infrastructure) {
        const infraState = state.clan.infrastructure[infraId];
        if (infraId === 'servers') {
            const serverData = marketData.clanInfrastructure.clanServer;
            const serverCount = infraState.length;
            securityScore += serverData.points.security * serverCount;
            capacityScore += serverData.points.capacity * serverCount;
        } else {
            const infraData = marketData.clanInfrastructure[infraId];
            if (infraData && infraData.tiers) {
                const currentTier = infraData.tiers[infraState.tier - 1];
                if (currentTier && currentTier.points) {
                    securityScore += currentTier.points.security || 0;
                    capacityScore += currentTier.points.capacity || 0;
                }
            }
        }
    }
    state.clan.ecosystem = {
        security: securityScore,
        capacity: capacityScore,
        total: securityScore + capacityScore
    };
    if (state.activePage === 'profile' && state.activeProfileSection === 'clan') {
        renderClanSection();
    }
}

function findTalentByName(talentName) {
    for (const branchName in talentData) {
        if (talentData[branchName].talents[talentName]) {
            return talentData[branchName].talents[talentName];
        }
    }
    return null;
}

function checkStudyProgress() {
    let changed = false;
    const talentModal = document.getElementById('talent-modal');
    const isModalOpen = talentModal && !talentModal.classList.contains('hidden');
    const currentOpenTalent = isModalOpen ? talentModal.querySelector('#modal-title')?.textContent : null;
    for (const levelId in state.studying) {
        const study = state.studying[levelId];
        const elapsed = Date.now() - study.startTime;
        const progress = Math.min(100, (elapsed / study.duration) * 100);
        const progressBar = document.getElementById(`progress-${levelId}`);
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (elapsed >= study.duration) {
            const [talentName] = levelId.split('-');
            state.unlocked[talentName] = (state.unlocked[talentName] || 0) + 1;
            delete state.studying[levelId];
            changed = true;
        }
    }
    if (changed) {
        saveState();
        if (state.activePage === 'profile') {
            renderTalentTree(); 
            if (state.activeProfileSection === 'talents' && currentOpenTalent) {
                const talent = findTalentByName(currentOpenTalent);
                if (talent) openTalentModal(currentOpenTalent, talent);
            }
        }
        if (state.activePage === 'editor') {
            renderToolbox();
        }
    }
}

function init() {
    loadState();
    updateAllBonuses();
    updateUI();
    
    document.querySelectorAll('nav .nav-btn').forEach(button => {
        button.addEventListener('click', () => switchPage(button.dataset.page));
    });
    
    resetButton.addEventListener('click', resetState);
    switchPage(state.activePage || 'hq');
    initAdminPanel();

    setInterval(() => {
        checkStudyProgress();
        if (typeof updateActiveAttacks === 'function') {
            updateActiveAttacks();
        }
    }, 1000);

    initQuestSystem();
    setInterval(() => {
        if (typeof manageQuests === 'function') {
            manageQuests();
        }
    }, QUEST_CHECK_INTERVAL_MS);

    setInterval(() => {
        if (typeof updateNewsTicker === 'function') {
            updateNewsTicker();
        }
    }, NEWS_TICKER_INTERVAL_MS);

    updateBTCValue();
    setInterval(() => {
        updateBTCValue();
    }, BTC_VALUE_UPDATE_INTERVAL_MS);
}

document.addEventListener('DOMContentLoaded', init);
