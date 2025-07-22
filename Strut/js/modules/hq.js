// File: js/modules/hq.js
// VERSIONE AGGIORNATA: Aggiunto indicatore di tracciabilità per le VPN personali.

const MAX_NEWS_ITEMS = 5;

function renderHqPage() {
    const statsContainer = document.getElementById('hq-computer-stats');
    if (!statsContainer) return;
    statsContainer.innerHTML = '';
    
    const { hardwareBonuses, clanBonuses } = state;
    const personalStudyBonus = Math.round((1 - hardwareBonuses.studyTimeModifier) * 100);
    const clanStudyBonus = Math.round((1 - clanBonuses.studyTimeModifier) * 100);
    const totalStudyBonus = Math.round((1 - (hardwareBonuses.studyTimeModifier * clanBonuses.studyTimeModifier)) * 100);

    let bonusHTML = `
        <div class="hq-stat-card p-4 rounded-lg">
            <h4 class="text-lg font-bold text-indigo-300 mb-2">Bonus Globali Attivi</h4>
            <div class="text-sm space-y-1">
                <p>Velocità Studio: <span class="font-bold hq-bonus-text">+${totalStudyBonus}%</span> <span class="text-xs text-gray-400">(Personale: ${personalStudyBonus}%, Clan: ${clanStudyBonus}%)</span></p>
                <p>Efficienza (EO): <span class="font-bold hq-bonus-text">${(hardwareBonuses.toolStatModifiers.eo + clanBonuses.toolStatModifiers.eo)}</span></p>
                <p>Robustezza (RC): <span class="font-bold hq-bonus-text">+${(hardwareBonuses.toolStatModifiers.rc + clanBonuses.toolStatModifiers.rc).toFixed(2)}</span></p>
            </div>
        </div>`;
    statsContainer.innerHTML += bonusHTML;

    let hardwareHTML = `<div class="hq-stat-card p-4 rounded-lg"><h4 class="text-lg font-bold text-indigo-300 mb-2">Hardware Personale</h4><ul class="text-sm space-y-1 list-disc list-inside text-gray-300">`;
    const allPersonalItems = [...marketData.personalHardware, ...marketData.personalInfrastructure];
    const ownedItems = Object.keys(state.ownedHardware);
    if (ownedItems.length > 0) {
        ownedItems.forEach(id => {
            const item = allPersonalItems.find(i => i.id === id);
            if(item) hardwareHTML += `<li>${item.name}</li>`;
        });
    } else {
        hardwareHTML += `<li>Nessun componente installato.</li>`;
    }
    hardwareHTML += `</ul></div>`;
    statsContainer.innerHTML += hardwareHTML;

    // --- SEZIONE RETE PERSONALE MODIFICATA ---
    const realIpTraceScore = state.ipTraceability[state.identity.realIp] || 0;
    let realIpTraceColor = 'trace-low';
    if (realIpTraceScore > 75) realIpTraceColor = 'trace-high';
    else if (realIpTraceScore > 40) realIpTraceColor = 'trace-medium';

    let networkHTML = `
        <div class="hq-stat-card p-4 rounded-lg">
            <h4 class="text-lg font-bold text-indigo-300 mb-2">Stato Rete Personale</h4>
            <div class="text-sm space-y-2">
                <div class="flex justify-between items-center">
                    <span>IP Pubblico (HQ):</span>
                    <span class="font-bold font-mono text-white">${state.identity.realIp}</span>
                </div>
                <div class="trace-bar-bg mt-1">
                    <div class="trace-bar-fill ${realIpTraceColor}" style="width: ${realIpTraceScore}%" title="Tracciabilità: ${realIpTraceScore}%"></div>
                </div>
            </div>
        </div>`;

    const purchasedVpns = Object.keys(state.purchasedServices);
    if (purchasedVpns.length > 0) {
        networkHTML += `
            <div class="hq-stat-card p-4 rounded-lg">
                <h4 class="text-lg font-bold text-indigo-300 mb-2">Servizi VPN Attivi</h4>
                <div class="space-y-3">`;
        purchasedVpns.forEach(serviceId => {
            const serviceState = state.purchasedServices[serviceId];
            const serviceData = marketData.networkServices.find(s => s.id === serviceId);
            if (serviceState && serviceData) {
                const ip = serviceState.currentIp;
                const traceScore = state.ipTraceability[ip] || 0;
                let traceColor = 'trace-low';
                if (traceScore > 75) traceColor = 'trace-high';
                else if (traceScore > 40) traceColor = 'trace-medium';

                networkHTML += `
                    <div>
                        <p class="font-semibold text-gray-300">${serviceData.name}</p>
                        <div class="flex justify-between items-center text-sm mt-1">
                            <span class="font-mono text-white">${ip}</span>
                            <button class="refresh-ip-btn px-2 py-1 text-xs font-semibold rounded-md bg-purple-600 hover:bg-purple-700" data-service-id="${serviceId}">
                                <i class="fas fa-sync-alt"></i> Cambia IP (${serviceData.refreshCostXMR} XMR)
                            </button>
                        </div>
                        <div class="trace-bar-bg mt-2">
                            <div class="trace-bar-fill ${traceColor}" style="width: ${traceScore}%" title="Tracciabilità: ${traceScore}%"></div>
                        </div>
                    </div>`;
            }
        });
        networkHTML += `</div></div>`;
    }
    statsContainer.innerHTML += networkHTML;

    statsContainer.querySelectorAll('.refresh-ip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            refreshVpnIp(e.target.closest('button').dataset.serviceId);
        });
    });
}

// (Il resto del file hq.js rimane invariato)
// ...
function renderPersonalComputer() {
    const container = document.getElementById('personal-computer-slots');
    if (!container) return;

    let slotsHTML = '';
    const flowOptions = Object.keys(state.savedFlows)
        .map(name => `<option value="${name}">${name}</option>`)
        .join('');

    state.personalComputer.attachedFlows.forEach((slot, index) => {
        let slotContent = '';
        const isGlobalScanSlot = index === 0 && !state.isWorldUnlocked;

        if (slot.flowName) {
            const flow = state.savedFlows[slot.flowName];
            const statusColor = slot.status === 'running' ? 'text-yellow-400' : 'text-green-400';
            const progress = slot.status === 'running' ? Math.min(100, ((Date.now() - slot.startTime) / slot.duration) * 100) : 0;

            slotContent = `
                <div class="flex-grow">
                    <p class="font-bold text-white">${slot.flowName}</p>
                    <p class="text-xs ${statusColor} capitalize">${slot.status}</p>
                    ${slot.status === 'running' ? `
                        <div class="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                            <div class="bg-yellow-500 h-1.5 rounded-full" style="width: ${progress}%"></div>
                        </div>
                    ` : ''}
                </div>
                <div class="flex flex-col gap-1">
                    <button class="execute-flow-btn px-2 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700 ${slot.status === 'running' ? 'hidden' : ''}" data-slot-index="${index}">Esegui</button>
                    <button class="detach-flow-btn px-2 py-1 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700" data-slot-index="${index}">Sgancia</button>
                </div>
            `;
        } else {
            slotContent = `
                <div class="flex-grow">
                    <p class="text-gray-400">${isGlobalScanSlot ? 'Slot Scansione Globale' : `Slot Libero ${index + 1}`}</p>
                    <select class="flow-select-personal w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-xs mt-1">
                        <option value="">Seleziona Flusso...</option>
                        ${flowOptions}
                    </select>
                </div>
                <button class="attach-flow-btn px-2 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 self-end" data-slot-index="${index}">Aggancia</button>
            `;
        }

        slotsHTML += `
            <div class="hq-stat-card p-3 rounded-lg flex items-center gap-3 ${isGlobalScanSlot ? 'border-l-4 border-yellow-400' : ''}">
                <i class="fas fa-microchip text-2xl text-gray-500"></i>
                ${slotContent}
            </div>
        `;
    });

    container.innerHTML = slotsHTML;

    container.querySelectorAll('.attach-flow-btn').forEach(btn => btn.addEventListener('click', attachFlowToPersonalComputer));
    container.querySelectorAll('.detach-flow-btn').forEach(btn => btn.addEventListener('click', detachFlowFromPersonalComputer));
    container.querySelectorAll('.execute-flow-btn').forEach(btn => btn.addEventListener('click', executeFlowFromPersonalComputer));
}
function attachFlowToPersonalComputer(event) {
    const slotIndex = parseInt(event.target.dataset.slotIndex);
    const select = event.target.previousElementSibling.querySelector('select');
    const flowName = select.value;

    if (flowName && state.savedFlows[flowName]) {
        state.personalComputer.attachedFlows[slotIndex].flowName = flowName;
        saveState();
        renderPersonalComputer();
    }
}
function detachFlowFromPersonalComputer(event) {
    const slotIndex = parseInt(event.target.dataset.slotIndex);
    state.personalComputer.attachedFlows[slotIndex] = { flowName: null, status: 'idle', startTime: 0, duration: 0 };
    saveState();
    renderPersonalComputer();
}
function executeFlowFromPersonalComputer(event) {
    const slotIndex = parseInt(event.target.dataset.slotIndex);
    const slot = state.personalComputer.attachedFlows[slotIndex];
    const flow = state.savedFlows[slot.flowName];

    if (!flow) return;

    if (slotIndex === 0 && !state.isWorldUnlocked) {
        if (flow.objective === 'reconnaissance' && flow.fc >= 80) {
            slot.status = 'running';
            slot.startTime = Date.now();
            slot.duration = 30000; // 30 secondi per la scansione
            saveState();
            renderPersonalComputer();
        } else {
            alert("Flusso non valido per la Scansione Globale. Assicurati che l'obiettivo sia 'Ricognizione / Intelligence' e che la Completezza Funzionale (FC) sia almeno dell'80%.");
        }
        return;
    }
    
    alert("Questa funzionalità di esecuzione in background è in fase di sviluppo.");
}
function updatePersonalComputer() {
    let shouldRerender = false;
    
    if (state.personalComputer.attachedFlows.some(slot => slot.status === 'running')) {
        shouldRerender = true;
    }

    state.personalComputer.attachedFlows.forEach((slot, index) => {
        if (slot.status === 'running' && (Date.now() - slot.startTime >= slot.duration)) {
            slot.status = 'idle';
            shouldRerender = true;

            if (index === 0 && !state.isWorldUnlocked) {
                state.isWorldUnlocked = true;
                state.discoveredTargets = Object.values(worldTargets)
                    .filter(t => t.tier === 1)
                    .map(t => t.id);
                alert("Scansione Globale completata! La Pagina del Mondo è ora accessibile. Hai mappato i primi target di basso livello.");
                switchPage('hq');
                return;
            }
        }
    });

    if (shouldRerender && state.activePage === 'hq') {
        renderPersonalComputer();
    }
}
function updateNewsTicker() {
    if (state.activePage !== 'hq') return;
    if (state.news.length < MAX_NEWS_ITEMS) {
        const availableNews = newsData.filter(n => !state.news.some(sn => sn.headline === n.headline));
        if (availableNews.length > 0) {
            state.news.unshift(availableNews[Math.floor(Math.random() * availableNews.length)]);
        }
    } else {
        state.news.pop();
        const availableNews = newsData.filter(n => !state.news.some(sn => sn.headline === n.headline));
        if (availableNews.length > 0) {
            state.news.unshift(availableNews[Math.floor(Math.random() * availableNews.length)]);
        }
    }
    renderNewsTicker();
}
function renderNewsTicker() {
    const container = document.getElementById('news-ticker-container');
    if (!container) return;
    const getCategoryClass = (category) => {
        switch (category) {
            case 'Finanza': return 'border-green-500';
            case 'Geopolitica': return 'border-red-500';
            case 'Tech': return 'border-blue-500';
            case 'Cybersecurity': return 'border-yellow-500';
            default: return 'border-gray-500';
        }
    };
    container.innerHTML = state.news.map(newsItem => `
        <div class="news-item p-2 border-l-4 ${getCategoryClass(newsItem.category)} bg-gray-800/50 rounded-r-md">
            <p class="text-xs font-bold">${newsItem.category}</p>
            <p class="text-sm text-gray-300">${newsItem.headline}</p>
        </div>
    `).join('');
}
function initHqPage() {
    renderHqPage();
    renderQuestBoard();
    renderNewsTicker();
    renderPersonalComputer();

    const intelBtn = document.getElementById('goto-intel-console-btn');
    if (intelBtn) {
        intelBtn.addEventListener('click', () => switchPage('intelligence_console'));
    }

    const refreshQuestsBtn = document.getElementById('refresh-quests-btn');
    if (refreshQuestsBtn) {
        refreshQuestsBtn.addEventListener('click', () => {
            if (typeof forceRefreshQuests === 'function') {
                forceRefreshQuests();
            }
        });
    }
}
