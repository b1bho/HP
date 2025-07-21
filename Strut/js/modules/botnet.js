// File: js/modules/botnet.js
// VERSIONE AGGIORNATA: Aggiunta gestione gruppi e funzionalità pulsanti di manutenzione.

let selectedHostIds = new Set();

function initBotnetPage() {
    renderInfectedHostsList();
    updateBotnetAggregateStats();
    renderHostDetailsPanel();
}

function updateBotnetAggregateStats() {
    const container = document.getElementById('botnet-aggregate-stats');
    if (!container) return;

    const totalHosts = state.infectedHostPool.length;
    const activeHosts = state.infectedHostPool.filter(h => h.status === 'Active').length;

    let aggregatePower = 0;
    state.infectedHostPool.forEach(host => {
        if (host.status === 'Active') {
            aggregatePower += host.resources.cpuPower;
        }
    });

    container.innerHTML = `
        <div class="text-center">
            <div class="text-xs text-gray-400">TOTAL HOSTS</div>
            <div class="text-2xl font-bold text-white">${totalHosts}</div>
        </div>
        <div class="text-center">
            <div class="text-xs text-gray-400">ACTIVE HOSTS</div>
            <div class="text-2xl font-bold text-green-400">${activeHosts}</div>
        </div>
        <div class="text-center">
            <div class="text-xs text-gray-400">AGGREGATE POWER</div>
            <div class="text-2xl font-bold text-purple-400">${aggregatePower.toFixed(2)} GFLOPS</div>
        </div>
    `;
    
    const countEl = document.getElementById('infected-host-count');
    if(countEl) countEl.textContent = totalHosts;
}

function renderInfectedHostsList() {
    const container = document.getElementById('infected-hosts-list');
    if (!container) return;

    if (state.infectedHostPool.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun host infetto nel pool. Esegui attacchi con obiettivi di controllo remoto per acquisirne.</p>`;
        return;
    }

    // Raggruppa gli host per gruppo
    const groupedHosts = { 'unassigned': [] };
    Object.keys(state.botnetGroups).forEach(g => groupedHosts[g] = []);
    
    state.infectedHostPool.forEach(host => {
        const groupName = Object.keys(state.botnetGroups).find(g => state.botnetGroups[g].hostIds.includes(host.id));
        if (groupName) {
            groupedHosts[groupName].push(host);
        } else {
            groupedHosts['unassigned'].push(host);
        }
    });

    let html = '';
    for (const groupName in groupedHosts) {
        if (groupedHosts[groupName].length > 0) {
            html += `<h4 class="text-sm font-bold text-indigo-400 sticky top-0 bg-gray-800/80 backdrop-blur-sm py-1 px-2 rounded my-2">${groupName === 'unassigned' ? 'Non Raggruppati' : groupName}</h4>`;
            html += groupedHosts[groupName].map(host => {
                const traceScore = host.traceabilityScore || 0;
                let traceColorClass = 'trace-low';
                if (traceScore > 75) traceColorClass = 'trace-high';
                else if (traceScore > 40) traceColorClass = 'trace-medium';

                let statusColor = 'text-gray-400';
                if (host.status === 'Active') statusColor = 'text-green-400';
                if (host.status === 'Offline') statusColor = 'text-yellow-400';
                if (host.status === 'Compromised') statusColor = 'text-red-400';

                return `
                    <div class="host-card p-3 rounded-lg cursor-pointer hover:bg-gray-700/50 ${selectedHostIds.has(host.id) ? 'bg-indigo-900/50 border border-indigo-500' : 'border border-transparent'}" data-host-id="${host.id}">
                        <div class="flex justify-between items-center">
                            <p class="font-mono text-sm text-white">${host.ipAddress}</p>
                            <p class="text-xs font-bold ${statusColor}">${host.status}</p>
                        </div>
                        <p class="text-xs text-gray-400">${host.location}</p>
                        <div class="trace-bar-bg mt-2">
                            <div class="trace-bar-fill ${traceColorClass}" style="width: ${traceScore}%" title="Tracciabilità: ${traceScore}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    container.innerHTML = html;

    container.querySelectorAll('.host-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const hostId = card.dataset.hostId;
            if (event.ctrlKey || event.metaKey) {
                if (selectedHostIds.has(hostId)) {
                    selectedHostIds.delete(hostId);
                } else {
                    selectedHostIds.add(hostId);
                }
            } else {
                selectedHostIds.clear();
                selectedHostIds.add(hostId);
            }
            renderInfectedHostsList();
            renderHostDetailsPanel();
        });
    });
}

function renderHostDetailsPanel() {
    const container = document.getElementById('host-details-panel');
    if (!container) return;

    // UI per la gestione dei gruppi (visibile se ci sono host selezionati)
    let groupManagementHTML = '';
    if (selectedHostIds.size > 0) {
        const groupOptions = Object.keys(state.botnetGroups).map(g => `<option value="${g}">${g}</option>`).join('');
        groupManagementHTML = `
            <div class="mt-6 p-4 bg-gray-900/50 rounded-lg">
                <h4 class="text-lg font-semibold text-indigo-300 mb-3">Gestione Gruppo</h4>
                <div class="flex gap-2 mb-2">
                    <input type="text" id="new-group-name" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white w-full" placeholder="Nuovo nome gruppo...">
                    <button id="create-group-btn" class="px-4 py-2 font-semibold rounded-md bg-green-600 hover:bg-green-700">Crea</button>
                </div>
                <div class="flex gap-2">
                    <select id="assign-group-select" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white w-full">
                        <option value="unassigned">Nessun Gruppo</option>
                        ${groupOptions}
                    </select>
                    <button id="assign-group-btn" class="px-4 py-2 font-semibold rounded-md bg-blue-600 hover:bg-blue-700">Assegna</button>
                </div>
            </div>
        `;
    }

    if (selectedHostIds.size === 0) {
        container.innerHTML = `<p class="text-center text-gray-500">Seleziona un host dalla lista per visualizzare i dettagli e lanciare comandi.</p>`;
        return;
    }

    if (selectedHostIds.size > 1) {
        container.innerHTML = `<p class="text-center text-gray-300">${selectedHostIds.size} host selezionati. Pronti a ricevere un comando di gruppo.</p>${groupManagementHTML}`;
    } else {
        const hostId = selectedHostIds.values().next().value;
        const host = state.infectedHostPool.find(h => h.id === hostId);
        if (!host) return;

        container.innerHTML = `
            <h3 class="text-xl font-bold font-mono text-white mb-2">${host.ipAddress}</h3>
            <p class="text-sm text-gray-400 mb-4">${host.location}</p>
            <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                <div><span class="font-semibold text-gray-300">Status:</span> <span class="font-bold text-green-400">${host.status}</span></div>
                <div><span class="font-semibold text-gray-300">Stabilità:</span> ${host.stabilityScore.toFixed(0)}%</div>
                <div><span class="font-semibold text-gray-300">Tracciabilità:</span> ${host.traceabilityScore.toFixed(0)}%</div>
                <div><span class="font-semibold text-gray-300">Potenza CPU:</span> ${host.resources.cpuPower.toFixed(2)} GFLOPS</div>
                <div><span class="font-semibold text-gray-300">Banda:</span> ${host.resources.bandwidth} Mbps</div>
                <div><span class="font-semibold text-gray-300">Infezione:</span> ${host.infectionType}</div>
            </div>
            <div>
                <h4 class="text-lg font-semibold text-indigo-300 mb-3">Azioni di Manutenzione</h4>
                <div class="grid grid-cols-3 gap-3">
                    <button id="reinforce-btn" class="bg-yellow-600 hover:bg-yellow-700 text-black p-2 rounded text-sm">Rinforza Infezione</button>
                    <button id="remove-traces-btn" class="bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm">Rimuovi Tracce</button>
                    <button id="deactivate-btn" class="bg-red-600 hover:bg-red-700 p-2 rounded text-sm">Disattiva</button>
                </div>
            </div>
            ${groupManagementHTML}
        `;
        // Listener per i pulsanti di azione del singolo host
        document.getElementById('reinforce-btn')?.addEventListener('click', reinforceInfection);
        document.getElementById('remove-traces-btn')?.addEventListener('click', removeTraces);
        document.getElementById('deactivate-btn')?.addEventListener('click', deactivateHost);
    }
    
    // Listener per la gestione dei gruppi
    document.getElementById('create-group-btn')?.addEventListener('click', createBotnetGroup);
    document.getElementById('assign-group-btn')?.addEventListener('click', assignHostsToGroup);
}

// --- NUOVE FUNZIONI ---

function createBotnetGroup() {
    const input = document.getElementById('new-group-name');
    const groupName = input.value.trim();
    if (!groupName) {
        showNotification("Inserisci un nome valido per il gruppo.", "error");
        return;
    }
    if (state.botnetGroups[groupName]) {
        showNotification(`Un gruppo con il nome "${groupName}" esiste già.`, "error");
        return;
    }
    state.botnetGroups[groupName] = { hostIds: [], attachedFlows: [] };
    state.botnetGroups[groupName].hostIds.push(...selectedHostIds);
    
    // Rimuovi gli host appena assegnati da altri gruppi
    Object.keys(state.botnetGroups).forEach(g => {
        if (g !== groupName) {
            state.botnetGroups[g].hostIds = state.botnetGroups[g].hostIds.filter(id => !selectedHostIds.has(id));
        }
    });

    saveState();
    showNotification(`Gruppo "${groupName}" creato con ${selectedHostIds.size} host.`, "success");
    selectedHostIds.clear();
    renderHostDetailsPanel();
    renderInfectedHostsList();
    if (state.activePage === 'editor') populateHostSelector();
}

function assignHostsToGroup() {
    const select = document.getElementById('assign-group-select');
    const groupName = select.value;

    // Rimuovi gli host selezionati da tutti i gruppi
    Object.keys(state.botnetGroups).forEach(g => {
        state.botnetGroups[g].hostIds = state.botnetGroups[g].hostIds.filter(id => !selectedHostIds.has(id));
    });

    // Assegna al nuovo gruppo (se non è "unassigned")
    if (groupName !== 'unassigned' && state.botnetGroups[groupName]) {
        state.botnetGroups[groupName].hostIds.push(...selectedHostIds);
    }
    
    saveState();
    showNotification(`${selectedHostIds.size} host assegnati.`, "info");
    selectedHostIds.clear();
    renderHostDetailsPanel();
    renderInfectedHostsList();
}

function reinforceInfection() {
    if (selectedHostIds.size !== 1) return;
    const hostId = selectedHostIds.values().next().value;
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;

    const cost = 0.001; // Costo in BTC
    if (state.btc < cost) {
        showNotification(`BTC insufficienti. Costo: ${cost} BTC.`, "error");
        return;
    }
    state.btc -= cost;
    
    host.stabilityScore = Math.min(100, host.stabilityScore + 15);
    host.traceabilityScore = Math.min(100, host.traceabilityScore + 25);

    showNotification(`Infezione su ${host.ipAddress} rinforzata. Stabilità e tracciabilità aumentate.`, "success");
    saveState();
    updateUI();
    renderHostDetailsPanel();
    renderInfectedHostsList();
}

function removeTraces() {
    if (selectedHostIds.size !== 1) return;
    const hostId = selectedHostIds.values().next().value;
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;

    const cost = 0.0005;
    if (state.btc < cost) {
        showNotification(`BTC insufficienti. Costo: ${cost} BTC.`, "error");
        return;
    }
    state.btc -= cost;

    const antiForensicsLevel = state.unlocked['Anti-Forensics'] || 0;
    const effectiveness = (state.level * 2) + (antiForensicsLevel * 10); // 2 punti per livello, 10 per talento
    const reduction = Math.min(host.traceabilityScore, Math.floor(Math.random() * effectiveness));
    
    host.traceabilityScore -= reduction;

    showNotification(`Pulizia tracce su ${host.ipAddress} eseguita. Tracciabilità ridotta di ${reduction} punti.`, "success");
    saveState();
    updateUI();
    renderHostDetailsPanel();
    renderInfectedHostsList();
}

function deactivateHost() {
    if (selectedHostIds.size !== 1) return;
    const hostId = selectedHostIds.values().next().value;
    const hostIndex = state.infectedHostPool.findIndex(h => h.id === hostId);
    if (hostIndex === -1) return;

    const host = state.infectedHostPool[hostIndex];

    if (confirm(`Sei sicuro di voler disattivare permanentemente l'host ${host.ipAddress}? Questa azione è irreversibile.`)) {
        if (host.traceabilityScore > 50) {
            const penalty = Math.ceil(host.traceabilityScore / 10);
            state.identity.traces += penalty;
            showNotification(`Host disattivato, ma le tracce evidenti hanno aumentato il tuo livello di sospetto di +${penalty}!`, "error");
        } else {
            showNotification(`Host ${host.ipAddress} disattivato con successo.`, "info");
        }
        
        // Rimuovi l'host dal pool e da qualsiasi gruppo
        state.infectedHostPool.splice(hostIndex, 1);
        Object.keys(state.botnetGroups).forEach(g => {
            state.botnetGroups[g].hostIds = state.botnetGroups[g].hostIds.filter(id => id !== hostId);
        });
        
        selectedHostIds.clear();
        saveState();
        updateUI();
        initBotnetPage(); // Re-inizializza l'intera pagina
    }
}
