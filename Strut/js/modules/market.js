// File: js/modules/market.js

function renderMarket() {
    const hardwareContainer = document.getElementById('hardware-market');
    const infraContainer = document.getElementById('infra-market');
    const clanInfraContainer = document.getElementById('clan-infra-market');
    if (!hardwareContainer || !infraContainer || !clanInfraContainer) return;
    
    hardwareContainer.innerHTML = '';
    infraContainer.innerHTML = '';
    clanInfraContainer.innerHTML = '';

    marketData.personalHardware.forEach(item => hardwareContainer.appendChild(createMarketItem(item, 'personal')));
    marketData.personalInfrastructure.forEach(item => infraContainer.appendChild(createMarketItem(item, 'personal')));
    
    // Gestisce sia i server acquistabili multipli sia le infrastrutture a tier
    Object.values(marketData.clanInfrastructure).forEach(infra => {
        if (infra.id === 'c_server') { // Gestione speciale per i server
            clanInfraContainer.appendChild(createMarketItem(infra, 'clan'));
        } else if (infra.tiers) { // Gestione per infrastrutture a tier
            const currentTier = (state.clan && state.clan.infrastructure[infra.id]) ? state.clan.infrastructure[infra.id].tier : 0;
            if (currentTier < infra.tiers.length) {
                const tierToDisplay = infra.tiers[currentTier];
                clanInfraContainer.appendChild(createMarketItem(tierToDisplay, 'clan', infra.id));
            }
        }
    });
}

function createMarketItem(item, type, baseId = null) {
    const itemId = item.id;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'market-item p-4 rounded-lg flex flex-col';
    
    const isOwned = type === 'personal' && state.ownedHardware[itemId];
    const canAfford = type === 'personal' ? state.btc >= item.cost : (state.clan && state.clan.treasury >= item.cost);
    const isLeader = state.clan && state.clan.members.find(m => m.name === state.hackerName && m.role === 'Leader');
    
    let canBuy = false;
    let buttonText = 'Compra';

    if (type === 'personal') {
        canBuy = canAfford && !isOwned;
        if (isOwned) buttonText = 'Posseduto';
    } else if (type === 'clan') {
        const isServer = item.id === 'c_server';
        if (isServer) {
            const serverCount = state.clan && state.clan.infrastructure.servers ? state.clan.infrastructure.servers.length : 0;
            if (serverCount >= 5) {
                canBuy = false;
                buttonText = 'Massimo Raggiunto';
            } else {
                canBuy = isLeader && canAfford;
                buttonText = `Compra (${serverCount}/5)`;
            }
        } else {
            const currentTier = (state.clan && state.clan.infrastructure[baseId]) ? state.clan.infrastructure[baseId].tier : 0;
            const isFirstPurchase = currentTier === 0;
            canBuy = isLeader && canAfford && isFirstPurchase;
        }
    }

    itemDiv.innerHTML = `
        <h4 class="text-lg font-bold text-white">${item.name}</h4>
        <p class="text-sm text-gray-400 flex-grow my-2">${item.description}</p>
        <div class="flex justify-between items-center mt-4">
            <span class="text-yellow-400 font-bold">${item.cost.toLocaleString('it-IT')} BTC</span>
            <button class="buy-btn px-4 py-2 text-sm font-medium rounded-md" data-item-id="${itemId}" data-item-base-id="${baseId || itemId}" data-item-type="${type}" ${!canBuy ? 'disabled' : ''}>
                ${buttonText}
            </button>
        </div>`;
    if (canBuy) {
        itemDiv.querySelector('.buy-btn').addEventListener('click', buyMarketItem);
    }
    return itemDiv;
}

function buyMarketItem(event) {
    const { itemId, itemBaseId, itemType } = event.target.dataset;
    
    if (itemType === 'personal') {
        const allItems = [...marketData.personalHardware, ...marketData.personalInfrastructure];
        const item = allItems.find(i => i.id === itemId);
        if (!item) return;

        if (state.btc >= item.cost && !state.ownedHardware[item.id]) {
            if (confirm(`Acquistare ${item.name} per ${item.cost} BTC?`)) {
                state.btc -= item.cost;
                state.ownedHardware[item.id] = true;
                updateAllBonuses();
                saveState();
                updateUI();
                renderMarket();
            }
        }
    } else if (itemType === 'clan') {
        // Gestione acquisto server
        if (itemBaseId === 'c_server') {
            const item = marketData.clanInfrastructure.clanServer;
            const serverCount = state.clan && state.clan.infrastructure.servers ? state.clan.infrastructure.servers.length : 0;
            if (state.clan && state.clan.treasury >= item.cost && serverCount < 5) {
                if (confirm(`Acquistare un nuovo Server Clan per ${item.cost} BTC?`)) {
                    state.clan.treasury -= item.cost;
                    if (!state.clan.infrastructure.servers) {
                        state.clan.infrastructure.servers = [];
                    }
                    if (!state.clan.id) state.clan.id = Math.floor(Math.random() * 100); // Fallback per ID clan
                    const newServerId = state.clan.infrastructure.servers.length > 0 ? Math.max(...state.clan.infrastructure.servers.map(s => s.id)) + 1 : 1;
                    const newIp = `10.C${state.clan.id}.${newServerId}.${Math.floor(Math.random() * 254) + 1}`;
                    
                    // Inizializza il server con i suoi slot vuoti
                    const newServer = { 
                        id: newServerId, 
                        ip: newIp, 
                        attachedFlows: Array(item.flowSlots).fill(null) 
                    };
                    state.clan.infrastructure.servers.push(newServer);
                    
                    updateAllBonuses();
                    updateClanEcosystemScore(); // Ricalcola il punteggio
                    saveState();
                    updateUI();
                    renderMarket();
                    if (state.activePage === 'profile') renderClanSection();
                }
            }
        } else {
            // Logica per le altre infrastrutture a tier
            const infra = marketData.clanInfrastructure[itemBaseId];
            if (!infra) return;
            const item = infra.tiers.find(t => t.id === itemId);
            if (!item) return;

            if (state.clan && state.clan.treasury >= item.cost && !state.clan.infrastructure[itemBaseId]) {
                 if (confirm(`Acquistare ${item.name} per il clan per ${item.cost} BTC? I fondi verranno prelevati dalla tesoreria.`)) {
                    state.clan.treasury -= item.cost;
                    state.clan.infrastructure[itemBaseId] = { tier: 1, attachedFlows: [] };
                    updateAllBonuses();
                    updateClanEcosystemScore(); // Ricalcola il punteggio
                    saveState();
                    updateUI();
                    renderMarket();
                    if (state.activePage === 'profile') renderClanSection();
                 }
            } else {
                alert("Condizioni non soddisfatte per l'acquisto.");
            }
        }
    }
}


function initMarketPage() {
    renderMarket();
}
