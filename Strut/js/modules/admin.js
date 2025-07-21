// File: js/modules/admin.js

function setAdminValues() {
    const btc = parseInt(document.getElementById('admin-btc').value, 10);
    const xmr = parseInt(document.getElementById('admin-xmr').value, 10);
    const talents = parseInt(document.getElementById('admin-talents').value, 10);

    if (!isNaN(btc)) state.btc = btc;
    if (!isNaN(xmr)) state.xmr = xmr;
    if (!isNaN(talents)) state.talentPoints = talents;

    updateUI();
    saveState();
    alert('Valori admin impostati!');
}

function unlockAllTalents() {
    if (!confirm('Sei sicuro di voler sbloccare tutti i talenti?')) return;

    for (const branchName in talentData) {
        const branch = talentData[branchName];
        for (const talentName in branch.talents) {
            const talent = branch.talents[talentName];
            state.unlocked[talentName] = talent.levels.length;
        }
    }
    
    state.studying = {};
    saveState();
    
    if (state.activePage === 'profile') initProfilePage();
    if (state.activePage === 'editor') initEditorPage();
    alert('Tutti i talenti sono stati sbloccati!');
}

function unlockAllMarketItems() {
    if (!confirm('Sei sicuro di voler sbloccare tutti gli oggetti del mercato?')) return;
    
    marketData.personalHardware.forEach(item => state.ownedHardware[item.id] = true);
    marketData.personalInfrastructure.forEach(item => state.ownedHardware[item.id] = true);

    if (state.clan) {
        for(const infraId in marketData.clanInfrastructure) {
            const maxTier = marketData.clanInfrastructure[infraId].tiers.length;
            state.clan.infrastructure[infraId] = { tier: maxTier, attachedFlows: [] };
        }
    }

    updateAllBonuses();
    saveState();

    if (state.activePage === 'market') initMarketPage();
    if (state.activePage === 'hq') initHqPage();
    if (state.activePage === 'profile' && state.activeProfileSection === 'clan') renderClanSection();
    
    alert('Tutti gli oggetti del mercato sono stati sbloccati!');
}

/**
 * NUOVA FUNZIONE DI DEBUG: Resetta lo stato delle missioni.
 */
function resetQuests() {
    if (!confirm('Sei sicuro di voler resettare lo stato di tutte le missioni? Le missioni completate e annullate torneranno disponibili.')) return;

    // Svuota la lista delle missioni completate
    state.completedQuests = [];
    // Rimuove eventuali Dati Intel legati a missioni
    state.intelItems = [];
    // Rimuove tutte le missioni attive dalla bacheca per una pulizia completa
    state.activeQuests = [];

    saveState();

    // Forza il sistema a generare un nuovo set di missioni
    if (typeof manageQuests === 'function') {
        manageQuests();
    }
    
    alert('Stato delle missioni resettato!');
}


function updateAdminPanelUI() {
    const adminBtcInput = document.getElementById('admin-btc');
    const adminXmrInput = document.getElementById('admin-xmr');
    const adminTalentsInput = document.getElementById('admin-talents');
    if(adminBtcInput) adminBtcInput.value = state.btc;
    if(adminXmrInput) adminXmrInput.value = state.xmr;
    if(adminTalentsInput) adminTalentsInput.value = state.talentPoints;
}

function initAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.innerHTML = `
        <button id="toggle-admin-panel" class="absolute -left-8 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-l-md hover:bg-indigo-700">
            <i class="fas fa-cogs"></i>
        </button>
        <h3 class="text-lg font-bold text-indigo-400 mb-4 text-center">Pannello Admin</h3>
        <div class="space-y-3">
            <div>
                <label for="admin-btc" class="block text-sm font-medium text-gray-300">BTC</label>
                <input type="number" id="admin-btc" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white">
            </div>
            <div>
                <label for="admin-xmr" class="block text-sm font-medium text-gray-300">XMR</label>
                <input type="number" id="admin-xmr" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white">
            </div>
            <div>
                <label for="admin-talents" class="block text-sm font-medium text-gray-300">Punti Talento</label>
                <input type="number" id="admin-talents" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white">
            </div>
            <button id="admin-set-values" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700">Imposta Valori</button>
            <button id="admin-unlock-talents" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700">Sblocca Tutti i Talenti</button>
            <button id="admin-unlock-market" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-yellow-600 hover:bg-yellow-700 text-gray-900">Sblocca Tutto il Mercato</button>
            <!-- NUOVO PULSANTE -->
            <button id="admin-reset-quests" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700">Reset Missioni</button>
        </div>
    `;

    document.getElementById('toggle-admin-panel').addEventListener('click', () => adminPanel.classList.toggle('open'));
    document.getElementById('admin-set-values').addEventListener('click', setAdminValues);
    document.getElementById('admin-unlock-talents').addEventListener('click', unlockAllTalents);
    document.getElementById('admin-unlock-market').addEventListener('click', unlockAllMarketItems);
    // NUOVO LISTENER
    document.getElementById('admin-reset-quests').addEventListener('click', resetQuests);
    
    updateAdminPanelUI();
}
