// File: js/modules/botnet.js
// Gestisce la logica del pannello di controllo della Botnet.

let selectedHostIds = new Set();

function initBotnetPage() {
    renderInfectedHostsList();
    updateBotnetAggregateStats();
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

    container.innerHTML = state.infectedHostPool.map(host => {
        const traceScore = host.traceabilityScore || 0;
        let traceColorClass = 'trace-low';
        if (traceScore > 75) traceColorClass = 'trace-high';
        else if (traceScore > 40) traceColorClass = 'trace-medium';

        let statusColor = 'text-gray-400';
        if (host.status === 'Active') statusColor = 'text-green-400';
        if (host.status === 'Offline') statusColor = 'text-yellow-400';
        if (host.status === 'Compromised') statusColor = 'text-red-400';

        return `
            <div class="host-card p-3 rounded-lg cursor-pointer hover:bg-gray-700/50 ${selectedHostIds.has(host.id) ? 'bg-indigo-900/50' : ''}" data-host-id="${host.id}">
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
            renderInfectedHostsList(); // Ridisegna per mostrare la selezione
            renderHostDetailsPanel();
        });
    });
}

function renderHostDetailsPanel() {
    const container = document.getElementById('host-details-panel');
    if (!container) return;

    if (selectedHostIds.size === 0) {
        container.innerHTML = `<p class="text-center text-gray-500">Seleziona un host dalla lista per visualizzare i dettagli e lanciare comandi.</p>`;
        return;
    }

    if (selectedHostIds.size > 1) {
        container.innerHTML = `<p class="text-center text-gray-300">${selectedHostIds.size} host selezionati. Pronti a ricevere un comando di gruppo.</p>`;
        // Aggiungere qui la UI per i comandi di gruppo
        return;
    }

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
            <div class="grid grid-cols-2 gap-3">
                <button class="action-btn" disabled>Rinforza Infezione</button>
                <button class="action-btn" disabled>Rimuovi Tracce</button>
                <button class="action-btn" disabled>Disattiva</button>
                <button class="action-btn" disabled>Pulisci Host</button>
            </div>
        </div>
    `;
}
