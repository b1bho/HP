function initIntelligencePage() {
    renderDataPacketsList();
}

function renderDataPacketsList() {
    const container = document.getElementById('data-packets-list');
    if (!container) return;

    const allData = [
        ...state.dataLocker.personal.map(p => ({ ...p, source: 'PC Personale' })),
        ...state.dataLocker.clan.map(c => ({ ...c.data, source: `Server Clan #${c.serverId}` }))
    ];

    if (allData.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun archivio dati disponibile.</p>`;
        return;
    }

    container.innerHTML = allData.map(packet => `
        <div class="data-card p-3 rounded-lg cursor-pointer hover:border-indigo-500" data-packet-id="${packet.id}">
            <p class="font-semibold text-white">${packet.name}</p>
            <p class="text-xs text-gray-400">Fonte: ${packet.source}</p>
        </div>
    `).join('');

    container.querySelectorAll('.data-card').forEach(card => {
        card.addEventListener('click', () => {
            const packetId = card.dataset.packetId;
            const packet = allData.find(p => p.id === packetId);
            if (packet) {
                renderAnalysisInterface(packet);
            }
        });
    });
}

function renderAnalysisInterface(packet) {
    const container = document.getElementById('analysis-interface');
    if (!container) return;

    container.innerHTML = `
        <h3 class="text-xl font-semibold mb-2 text-white">${packet.name}</h3>
        <p class="text-sm text-gray-400 mb-4">${packet.description}</p>
        <div class="data-card p-4 rounded-lg mb-6">
             <div class="grid grid-cols-3 gap-2 text-sm font-mono">
                <div><span class="text-gray-500">Purezza:</span> <span class="text-indigo-300">${packet.purity.toFixed(2)}%</span></div>
                <div><span class="text-gray-500">Sensibilità:</span> <span class="text-indigo-300">${packet.sensitivity}</span></div>
                <div><span class="text-gray-500">Valore:</span> <span class="text-yellow-400">${packet.value.toLocaleString()} BTC</span></div>
            </div>
        </div>

        <div>
            <h4 class="font-semibold mb-3 text-indigo-300">Ricerca per Keyword</h4>
            <div class="flex gap-2">
                <input type="text" id="keyword-search-input" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white w-full" placeholder="Es: Mario Rossi, password123...">
                <button id="keyword-search-btn" class="px-4 py-2 font-semibold rounded-md bg-green-600 hover:bg-green-700">Cerca</button>
            </div>
            <div id="search-result" class="mt-4 p-4 bg-black/20 rounded-md min-h-[50px]"></div>
        </div>
    `;

    document.getElementById('keyword-search-btn').addEventListener('click', () => {
        const keyword = document.getElementById('keyword-search-input').value;
        if (keyword) {
            handleBasicSearch(packet, keyword);
        }
    });
}

function handleBasicSearch(packet, keyword) {
    const resultContainer = document.getElementById('search-result');
    resultContainer.innerHTML = `<p class="text-yellow-400"><i class="fas fa-spinner fa-spin mr-2"></i>Ricerca in corso nell'archivio...</p>`;

    const playerLevelFactor = 1 + (state.level / 10);
    const purityFactor = packet.purity / 100;
    const hardwareEfficiency = 1; 
    const baseChance = 0.20;
    const successChance = baseChance * playerLevelFactor * purityFactor * hardwareEfficiency;

    setTimeout(() => {
        if (Math.random() < successChance) {
            // Controlla se la keyword completa una quest
            const activeQuest = state.activeQuests.find(q => q.status === 'accepted' && q.targetKeyword.toLowerCase() === keyword.toLowerCase());
            
            if (activeQuest) {
                resultContainer.innerHTML = `<p class="text-green-400"><i class="fas fa-check-circle mr-2"></i>Corrispondenza Trovata! Obiettivo della quest <span class="font-bold">'${activeQuest.title}'</span> completato!</p>`;
                completeQuest(activeQuest.id);
            } else {
                resultContainer.innerHTML = `<p class="text-green-400"><i class="fas fa-check-circle mr-2"></i>Corrispondenza trovata per: "${keyword}"!</p>
                                             <p class="text-xs text-gray-400 mt-2">Questa informazione non sembra legata a nessuna missione attiva.</p>`;
            }
        } else {
            resultContainer.innerHTML = `<p class="text-red-400"><i class="fas fa-times-circle mr-2"></i>Nessuna corrispondenza trovata per: "${keyword}".</p>
                                         <p class="text-xs text-gray-400 mt-2">L'archivio potrebbe essere troppo corrotto o l'informazione non è presente.</p>`;
        }
    }, 2000);
}

